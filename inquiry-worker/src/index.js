/**
 * Bishnoi Omniverse inquiry endpoint — a Cloudflare Worker.
 *
 * A port of the Getmeds PHP pipeline (api/inquiry.php + lib/inquiry.php, captcha.php, mailer.php
 * and email-template.php) for a site with no server of its own: the website is a static export on
 * GitHub Pages, so the forms POST here instead of to a PHP file.
 *
 * Order of operations, identical to the original:
 *   honeypot -> Turnstile -> validate -> pick recipient -> render -> send via Brevo
 *
 * Configuration — [vars] in wrangler.toml for the non-secret values, `npx wrangler secret put <NAME>`
 * for everything else (see README.md):
 *   BREVO_API_KEY                    secret
 *   BREVO_SENDER_EMAIL               a sender verified in that Brevo account
 *   BREVO_SENDER_NAME                optional; defaults to "Bishnoi Omniverse"
 *   TURNSTILE_SECRET_KEY             secret; blank skips the challenge (for a first test only)
 *   CONTACT_RECIPIENT_EMAIL          inbox(es) for contact-page inquiries; several = comma-separated
 *   PRODUCT_INQUIRY_RECIPIENT_EMAIL  optional inbox(es) for medical equipment inquiries, comma-separated;
 *                                    blank = the contact inboxes
 *   ALLOWED_ORIGINS                  comma-separated origins allowed to submit ("*" = any)
 *   SHEETS_WEBHOOK_URL               optional; the Google Apps Script web app that logs each
 *                                    inquiry to a Google Sheet (google-sheets/Code.gs). Blank = off
 *   SHEETS_WEBHOOK_SECRET            secret shared with that script, so only this Worker can write
 *   GOOGLE_SERVICE_ACCOUNT_JSON      optional, instead of the two above: a Google Cloud service
 *                                    account key file (the whole JSON) that writes to the sheet
 *                                    through the Sheets API
 *   SHEETS_SPREADSHEET_ID            the sheet that service account writes to (shared with it)
 *   SHEETS_TIME_ZONE                 optional; time zone of the Received column. Default Asia/Manila
 *   EMAIL_ASSET_BASE                 optional; where the email's images live. Default: this
 *                                    Worker's own /email/ folder (see src/email-assets.js)
 */

import { renderHtml } from './email-template.js';
import { EMAIL_ASSETS } from './email-assets.js';

// Attachment limits, the same numbers as the PHP original. Brevo refuses any single attachment of
// 4MB or more. lib/inquiry.ts publishes the same values to the browser — keep the two in step.
const MAX_FILE_BYTES = 4 * 1024 * 1024;
const MAX_TOTAL_BYTES = 10 * 1024 * 1024;
const MAX_FILE_COUNT = 6;

// Documents and images only — a subset of what Brevo supports, as in the original.
const ALLOWED_EXTENSIONS = [
  'jpg', 'jpeg', 'png', 'gif', 'bmp', 'tif', 'tiff',
  'pdf', 'doc', 'docx', 'odt', 'rtf', 'txt',
  'xls', 'xlsx', 'csv',
];

// contact = the contact page's general routes; product = medical equipment inquiries (the catalog
// requisition and the contact page's hospital-supply form, where product pages send buyers).
const FORM_TYPES = ['contact', 'product'];

const MAX_DETAILS = 30;
const MAX_ITEMS = 50;

const log = (message) => console.log(`[bishnoi-inquiry] ${message}`);

/* ------------------------------------------------------------------ *
 * Sanitizers
 * ------------------------------------------------------------------ */

/** Single-line text: tags stripped, line breaks folded (also blocks header injection). */
function text(value, max = 500) {
  return String(value ?? '')
    .replace(/<[^>]*>/g, '')
    .replace(/[\r\n\t]+/g, ' ')
    .trim()
    .slice(0, max);
}

/** Multi-line text: tags stripped, newlines kept. */
function textarea(value, max = 5000) {
  return String(value ?? '')
    .replace(/<[^>]*>/g, '')
    .trim()
    .slice(0, max);
}

function email(value) {
  const v = String(value ?? '').trim();
  return v.length <= 254 && /^[^\s@<>(),;:"]+@[^\s@<>(),;:"]+\.[^\s@<>(),;:".]{2,}$/.test(v) ? v : '';
}

function filename(value) {
  const v = String(value ?? '').replace(/[^A-Za-z0-9._-]/g, '_').slice(0, 120);
  return v === '' ? 'attachment' : v;
}

function extensionOf(name) {
  const dot = name.lastIndexOf('.');
  return dot === -1 ? '' : name.slice(dot + 1).toLowerCase().replace(/[^a-z0-9]/g, '');
}

function link(value) {
  try {
    const u = new URL(String(value ?? ''));
    return u.protocol === 'https:' || u.protocol === 'http:' ? u.toString() : '';
  } catch {
    return '';
  }
}

const result = (status, message, extra = {}) => ({ status, body: { message, ...extra } });

async function fetchWithTimeout(resource, init, ms) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  try {
    return await fetch(resource, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

/* ------------------------------------------------------------------ *
 * Attachments
 * ------------------------------------------------------------------ */

function decodedSize(base64) {
  const padding = base64.endsWith('==') ? 2 : base64.endsWith('=') ? 1 : 0;
  return Math.floor((base64.length * 3) / 4) - padding;
}

/**
 * Validates the browser's base64 attachments. Every rejection names the file and says what to do —
 * these messages go straight to the visitor. The browser checks the same rules first, but it
 * cannot be trusted, so they are enforced again here.
 */
function checkFiles(raw) {
  const fail = (message) => ({ ok: false, message, attachments: [], listed: [] });
  if (!Array.isArray(raw) || raw.length === 0) {
    return { ok: true, message: '', attachments: [], listed: [] };
  }
  if (raw.length > MAX_FILE_COUNT) {
    return fail(`Please attach no more than ${MAX_FILE_COUNT} files.`);
  }

  const attachments = [];
  const listed = [];
  let total = 0;

  for (const file of raw) {
    if (!file || typeof file !== 'object') continue;
    const base64 = String(file.base64 ?? '').replace(/\s+/g, '');
    if (base64 === '') continue;

    const name = filename(file.name);
    const ext = extensionOf(name);
    if (!ext || !ALLOWED_EXTENSIONS.includes(ext)) {
      return fail(`${name} is not a file type we can accept. Please upload a PDF, Word or Excel file, or an image.`);
    }
    if (base64.length % 4 !== 0 || !/^[A-Za-z0-9+/]+={0,2}$/.test(base64)) {
      return fail(`${name} could not be read. Please try attaching it again.`);
    }

    const size = decodedSize(base64);
    if (size >= MAX_FILE_BYTES) {
      return fail(
        `${name} is ${(size / 1048576).toFixed(1)} MB. Each file must be under ${MAX_FILE_BYTES / 1048576} MB — please compress it or split it.`
      );
    }
    total += size;
    if (total > MAX_TOTAL_BYTES) {
      return fail(`Your attachments add up to more than ${MAX_TOTAL_BYTES / 1048576} MB in total. Please remove one and try again.`);
    }

    attachments.push({ name, content: base64 });
    listed.push({ name, category: text(file.category, 80) });
  }

  return { ok: true, message: '', attachments, listed };
}

/* ------------------------------------------------------------------ *
 * Cloudflare Turnstile
 * ------------------------------------------------------------------ */

/**
 * Enabled purely by configuration: with TURNSTILE_SECRET_KEY set the check is mandatory and fails
 * CLOSED (Cloudflare unreachable = rejected); with it blank the check is skipped, so the pipeline
 * can be tested before the keys exist.
 */
async function verifyCaptcha(token, env, ip) {
  const secret = String(env.TURNSTILE_SECRET_KEY ?? '').trim();
  if (secret === '') return { ok: true, message: '' };

  const value = String(token ?? '').trim();
  if (value === '') {
    return { ok: false, message: 'Please complete the verification challenge and try again.' };
  }
  if (value.length > 2048) {
    return { ok: false, message: 'Verification failed. Please refresh the page and try again.' };
  }

  const form = new URLSearchParams({ secret, response: value });
  if (ip) form.set('remoteip', ip);

  let data;
  try {
    const res = await fetchWithTimeout(
      'https://challenges.cloudflare.com/turnstile/v0/siteverify',
      { method: 'POST', body: form },
      8000
    );
    if (!res.ok) {
      log(`Turnstile siteverify unreachable: HTTP ${res.status}`);
      return { ok: false, message: 'We could not verify your submission right now. Please try again in a moment.' };
    }
    data = await res.json();
  } catch (err) {
    log(`Turnstile siteverify unreachable: ${err}`);
    return { ok: false, message: 'We could not verify your submission right now. Please try again in a moment.' };
  }

  if (data && data.success) return { ok: true, message: '' };

  const codes = Array.isArray(data?.['error-codes']) ? data['error-codes'] : [];
  log(`Turnstile rejected token: ${codes.join(', ')}`);
  // A stale or already-redeemed token is the common, recoverable case — ask for a retry rather
  // than implying the visitor is a bot.
  if (codes.includes('timeout-or-duplicate') || codes.includes('invalid-input-response')) {
    return { ok: false, message: 'Your verification expired. Please complete the challenge again.' };
  }
  return { ok: false, message: 'Verification failed. Please refresh the page and try again.' };
}

/* ------------------------------------------------------------------ *
 * Email rendering (HTML + plain text)
 * ------------------------------------------------------------------ */

const BRAND = 'Bishnoi Omniverse';

// renderHtml lives in email-template.js.

function renderText(context, fields, items, message, files) {
  const lines = [`${context} — ${BRAND}`, ''];
  for (const [label, value] of fields) {
    if (value !== '' && value != null) lines.push(`${label}: ${value}`);
  }
  if (items.length) {
    lines.push('', `Items Requested (${items.length}):`);
    for (const item of items) lines.push(` - ${item.name}${item.url ? ` <${item.url}>` : ''}`);
  }
  if (message.trim()) lines.push('', 'Message:', message);
  if (files.length) {
    lines.push('', 'Attached Files:');
    for (const file of files) lines.push(` - ${file.name}${file.category ? ` (${file.category})` : ''}`);
  }
  return lines.join('\n');
}

/* ------------------------------------------------------------------ *
 * Mail (Brevo)
 * ------------------------------------------------------------------ */

async function sendViaBrevo(msg, env) {
  const apiKey = String(env.BREVO_API_KEY ?? '').trim();
  if (apiKey === '') return { ok: false, skipped: true, error: 'BREVO_API_KEY not set' };

  const senderEmail = String(env.BREVO_SENDER_EMAIL ?? '').trim();
  if (senderEmail === '') return { ok: false, skipped: true, error: 'No sender email configured' };
  const senderName = String(env.BREVO_SENDER_NAME ?? '').trim() || BRAND;

  const body = {
    sender: { name: senderName, email: senderEmail },
    // Every inbox on the list, in one email, so each can see who else has it.
    to: msg.to.map((address) => ({ email: address })),
    subject: msg.subject,
    htmlContent: msg.html,
    textContent: msg.text,
    // "Reply" in the inbox answers the visitor directly.
    replyTo: { email: msg.replyTo.email, name: msg.replyTo.name || msg.replyTo.email },
  };
  if (msg.attachments.length) body.attachment = msg.attachments;

  try {
    const res = await fetchWithTimeout(
      'https://api.brevo.com/v3/smtp/email',
      {
        method: 'POST',
        headers: { 'api-key': apiKey, 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(body),
      },
      15000
    );
    if (res.ok) return { ok: true, skipped: false, error: '' };
    const detail = (await res.text()).slice(0, 300);
    return { ok: false, skipped: false, error: `HTTP ${res.status} ${detail}` };
  } catch (err) {
    return { ok: false, skipped: false, error: `request failed: ${err}` };
  }
}

/** Every failure is logged with provider and status, so an outage shows up in `wrangler tail`. */
async function sendMail(msg, env) {
  const sent = await sendViaBrevo(msg, env);
  if (sent.ok) return { ok: true, errors: {} };
  if (sent.skipped) {
    log(`No mail provider is configured — ${sent.error}.`);
    return { ok: false, errors: { none: sent.error } };
  }
  log(`Provider brevo failed: ${sent.error}`);
  return { ok: false, errors: { brevo: sent.error } };
}

/* ------------------------------------------------------------------ *
 * Google Sheets log
 * ------------------------------------------------------------------ */

/**
 * Appends the inquiry to a Google Sheet, one tab per inquiry type. A record of every inquiry, not a
 * way of delivering it: it runs after the visitor has had their reply, and a failure here is only
 * logged — the email is what reaches the team, and it has already been sent or reported by then.
 *
 * Two ways to reach the sheet; the first one configured wins:
 *   1. A Google Cloud service account (GOOGLE_SERVICE_ACCOUNT_JSON + SHEETS_SPREADSHEET_ID). The
 *      Worker signs in as the service account and writes through the Sheets API. The spreadsheet
 *      only has to be shared with the service account's email as an Editor.
 *   2. The Apps Script web app in google-sheets/Code.gs (SHEETS_WEBHOOK_URL + SHEETS_WEBHOOK_SECRET).
 *
 * Either way the record is ordered label/value pairs, and a label the tab has not seen before
 * becomes a new column at the end, so adding a field to a form needs no change to the sheet.
 */
async function logToSheet(entry, env) {
  const serviceAccountJson = String(env.GOOGLE_SERVICE_ACCOUNT_JSON ?? '').trim();
  const spreadsheetId = String(env.SHEETS_SPREADSHEET_ID ?? '').trim();
  const url = String(env.SHEETS_WEBHOOK_URL ?? '').trim();
  const secret = String(env.SHEETS_WEBHOOK_SECRET ?? '').trim();

  const useServiceAccount = serviceAccountJson !== '' || spreadsheetId !== '';
  if (!useServiceAccount && url === '') return;
  if (useServiceAccount && (serviceAccountJson === '' || spreadsheetId === '')) {
    log('Set both GOOGLE_SERVICE_ACCOUNT_JSON and SHEETS_SPREADSHEET_ID — inquiry not logged to the sheet.');
    return;
  }
  if (!useServiceAccount && secret === '') {
    log('SHEETS_WEBHOOK_URL is set but SHEETS_WEBHOOK_SECRET is not — inquiry not logged to the sheet.');
    return;
  }

  const record = [
    // Blank for the Apps Script, which stamps it in the sheet's own time zone; the service account
    // path fills it in below.
    ['Received', ''],
    ['Inquiry Type', entry.inquiryType],
    ['Name', entry.name],
    ['Email', entry.email],
    ['Phone', entry.phone],
    ...entry.details,
    ['Items Requested', entry.items.map((item) => item.name).join('\n')],
    ['Item Links', entry.items.map((item) => item.url).filter(Boolean).join('\n')],
    ['Message', entry.message],
    // Only the names: the files themselves travel with the email.
    ['Attachments', entry.files.map((file) => file.name).join('\n')],
    ['Email Delivered', entry.emailed ? 'Yes' : 'No — check the inbox or Brevo logs'],
  ];

  if (useServiceAccount) {
    try {
      record[0][1] = receivedStamp(env);
      await appendWithServiceAccount(serviceAccountJson, spreadsheetId, sheetTabName(entry.inquiryType), record);
    } catch (err) {
      log(`Sheet log failed: ${err instanceof Error ? err.message : err}`);
    }
    return;
  }

  try {
    // Apps Script answers a POST with a redirect to its result; fetch follows it.
    const res = await fetchWithTimeout(
      url,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ secret, tab: entry.inquiryType, record }),
      },
      20000
    );
    const body = await res.json().catch(() => ({}));
    if (!res.ok || !body.ok) {
      log(`Sheet log failed: HTTP ${res.status} ${body.error ?? ''}`.trim());
    }
  } catch (err) {
    log(`Sheet log failed: ${err}`);
  }
}

/** Tabs are named after the inquiry type, cleaned to suit Sheets' rules (as Code.gs does). */
function sheetTabName(value) {
  const name = String(value || 'Other').replace(/[[\]*?/\\:]/g, ' ').trim().slice(0, 90);
  return name || 'Other';
}

/** "2026-10-01 09:21:33" in SHEETS_TIME_ZONE (default Asia/Manila). */
function receivedStamp(env) {
  const timeZone = String(env.SHEETS_TIME_ZONE ?? '').trim() || 'Asia/Manila';
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat('en-GB', {
      timeZone,
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23',
    })
      .formatToParts(new Date())
      .map((part) => [part.type, part.value])
  );
  return `${parts.year}-${parts.month}-${parts.day} ${parts.hour}:${parts.minute}:${parts.second}`;
}

/* --- Service account: OAuth token, then the Sheets API --- */

const SHEETS_SCOPE = 'https://www.googleapis.com/auth/spreadsheets';

// An access token lasts an hour; reused while this Worker instance stays warm.
let googleToken = null;

function base64url(input) {
  const bytes = typeof input === 'string' ? new TextEncoder().encode(input) : new Uint8Array(input);
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

/** Signs a JWT with the service account's private key and trades it for an access token. */
async function googleAccessToken(serviceAccountJson) {
  let account;
  try {
    account = JSON.parse(serviceAccountJson);
  } catch {
    throw new Error('GOOGLE_SERVICE_ACCOUNT_JSON is not valid JSON — upload the whole key file.');
  }
  if (!account.client_email || !account.private_key) {
    throw new Error('GOOGLE_SERVICE_ACCOUNT_JSON has no client_email or private_key — is it a service account key file?');
  }

  const now = Math.floor(Date.now() / 1000);
  if (googleToken && googleToken.email === account.client_email && googleToken.expires > now + 60) {
    return googleToken.value;
  }

  const der = Uint8Array.from(
    atob(account.private_key.replace(/-----[^-]+-----/g, '').replace(/\s+/g, '')),
    (c) => c.charCodeAt(0)
  );
  const key = await crypto.subtle.importKey(
    'pkcs8', der, { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }, false, ['sign']
  );
  const tokenUrl = account.token_uri || 'https://oauth2.googleapis.com/token';
  const claims = { iss: account.client_email, scope: SHEETS_SCOPE, aud: tokenUrl, iat: now, exp: now + 3600 };
  const unsigned = `${base64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }))}.${base64url(JSON.stringify(claims))}`;
  const signature = await crypto.subtle.sign('RSASSA-PKCS1-v1_5', key, new TextEncoder().encode(unsigned));

  const res = await fetchWithTimeout(
    tokenUrl,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
        assertion: `${unsigned}.${base64url(signature)}`,
      }),
    },
    10000
  );
  const body = await res.json().catch(() => ({}));
  if (!res.ok || !body.access_token) {
    throw new Error(`Google sign-in failed: HTTP ${res.status} ${body.error_description ?? body.error ?? ''}`.trim());
  }
  googleToken = { value: body.access_token, email: account.client_email, expires: now + (body.expires_in ?? 3600) };
  return googleToken.value;
}

async function sheetsApi(token, spreadsheetId, path, method = 'GET', payload) {
  const res = await fetchWithTimeout(
    `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(spreadsheetId)}${path}`,
    {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
        ...(payload ? { 'Content-Type': 'application/json' } : {}),
      },
      body: payload ? JSON.stringify(payload) : undefined,
    },
    15000
  );
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    // 403 = the sheet is not shared with the service account, or the Sheets API is not enabled in
    // its Google Cloud project; 404 = wrong SHEETS_SPREADSHEET_ID.
    throw new Error(`Sheets API ${method} ${path.split('?')[0]}: HTTP ${res.status} ${body.error?.message ?? ''}`.trim());
  }
  return body;
}

/**
 * Creates the tab on first use (bold, frozen header row), adds columns for labels the header row
 * lacks, then appends the row under the matching headers. Values are written RAW — stored exactly
 * as typed — so nothing a visitor enters is read as a formula and phone numbers keep leading zeros.
 */
async function appendWithServiceAccount(serviceAccountJson, spreadsheetId, tab, record) {
  const token = await googleAccessToken(serviceAccountJson);

  const meta = await sheetsApi(token, spreadsheetId, '?fields=sheets.properties(sheetId,title)');
  if (!(meta.sheets ?? []).some((sheet) => sheet.properties?.title === tab)) {
    const created = await sheetsApi(token, spreadsheetId, ':batchUpdate', 'POST', {
      requests: [{ addSheet: { properties: { title: tab, gridProperties: { frozenRowCount: 1 } } } }],
    });
    const sheetId = created.replies?.[0]?.addSheet?.properties?.sheetId;
    if (sheetId !== undefined) {
      await sheetsApi(token, spreadsheetId, ':batchUpdate', 'POST', {
        requests: [{
          repeatCell: {
            range: { sheetId, startRowIndex: 0, endRowIndex: 1 },
            cell: { userEnteredFormat: { textFormat: { bold: true } } },
            fields: 'userEnteredFormat.textFormat.bold',
          },
        }],
      });
    }
  }

  const quoted = `'${tab.replace(/'/g, "''")}'`;
  const range = (a1) => encodeURIComponent(`${quoted}!${a1}`);

  const head = await sheetsApi(token, spreadsheetId, `/values/${range('1:1')}`);
  let headers = (head.values?.[0] ?? []).map(String);
  const added = [];
  for (const [label] of record) {
    if (!headers.includes(String(label)) && !added.includes(String(label))) added.push(String(label));
  }
  if (added.length > 0) {
    headers = headers.concat(added);
    await sheetsApi(token, spreadsheetId, `/values/${range('A1')}?valueInputOption=RAW`, 'PUT', { values: [headers] });
  }

  const row = headers.map(() => '');
  for (const [label, value] of record) row[headers.indexOf(String(label))] = String(value ?? '');
  await sheetsApi(
    token, spreadsheetId,
    `/values/${range('A1')}:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS`, 'POST',
    { values: [row] }
  );
}

/* ------------------------------------------------------------------ *
 * The pipeline
 * ------------------------------------------------------------------ */

/**
 * The inboxes an inquiry goes to. Each setting holds one address or several, separated by commas
 * (e.g. "a@example.com, b@example.com"); every valid address gets the email, and a malformed one
 * is skipped and logged. A blank PRODUCT_INQUIRY_RECIPIENT_EMAIL is treated as unset, so leaving it
 * empty falls back to the contact inboxes instead of silently breaking equipment inquiries.
 */
function recipientsFor(formType, env) {
  const parse = (value) => {
    const list = [];
    for (const entry of String(value ?? '').split(/[,;\s]+/)) {
      if (entry === '') continue;
      const valid = email(entry);
      if (valid === '') log(`Skipping malformed recipient address: ${entry}`);
      else if (!list.some((known) => known.toLowerCase() === valid.toLowerCase())) list.push(valid);
    }
    return list;
  };
  const fallback = parse(env.CONTACT_RECIPIENT_EMAIL);
  if (formType === 'product') {
    const specific = parse(env.PRODUCT_INQUIRY_RECIPIENT_EMAIL);
    return specific.length ? specific : fallback;
  }
  return fallback;
}

function normaliseDetails(raw) {
  if (!Array.isArray(raw)) return [];
  return raw
    .slice(0, MAX_DETAILS)
    .map((row) => [text(row?.label, 80), textarea(row?.value, 1000)])
    .filter(([label, value]) => label !== '' && value !== '');
}

function normaliseItems(raw) {
  if (!Array.isArray(raw)) return [];
  return raw
    .slice(0, MAX_ITEMS)
    .map((item) => ({ name: text(item?.name, 200), url: link(item?.url) }))
    .filter((item) => item.name !== '');
}

async function processInquiry(payload, env, ip, ctx, assets) {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    return result(400, 'Invalid request body.');
  }

  const formType = text(payload.formType || 'contact', 20);
  if (!FORM_TYPES.includes(formType)) return result(400, 'Unrecognized form type.');

  // Honeypot: a field hidden from people. Anything that fills it is a bot auto-completing every
  // input it can see. Report success so it gets no signal about what caught it.
  if (text(payload.website) !== '') {
    log(`Honeypot tripped on ${formType} form — dropping submission.`);
    return result(200, 'Message sent.');
  }

  const captcha = await verifyCaptcha(payload.captchaToken, env, ip);
  if (!captcha.ok) return result(400, captcha.message, { code: 'captcha' });

  const name = text(payload.name, 200);
  const mail = email(payload.email);
  const phone = text(payload.phone, 60);
  const message = textarea(payload.message);

  if (name === '' || mail === '') {
    return result(400, 'Please fill in every required field with a valid email address.', { code: 'invalid_fields' });
  }
  // Equipment inquiries are quoted by phone as often as by email, so a number is required there.
  if (formType === 'product' && phone === '') {
    return result(400, 'Please fill in every required field with a valid email and phone number.', { code: 'invalid_fields' });
  }

  const recipients = recipientsFor(formType, env);
  if (recipients.length === 0) {
    log(`No valid recipient configured for form type ${formType}`);
    return result(500, 'We could not send your message. Please try again later.', { code: 'no_recipient' });
  }

  const files = checkFiles(payload.files);
  if (!files.ok) return result(413, files.message, { code: 'rejected' });

  const items = normaliseItems(payload.items);
  const details = normaliseDetails(payload.details);

  // A requisition has to say what is being requested — the browser checks this too.
  if (formType === 'product' && payload.requireItems === true && items.length === 0 && message === '' && files.attachments.length === 0) {
    return result(400, 'Please list at least one product, describe the items, or attach a list.', { code: 'rejected' });
  }

  const inquiryType = text(payload.inquiryType, 80) || (formType === 'product' ? 'Equipment Inquiry' : 'Contact Form');

  const fields = [
    ['Inquiry Type', inquiryType],
    ['Name', name],
    ['Email', mail],
    ['Phone', phone || '—'],
    ...details,
  ];

  const context = formType === 'product' ? 'Medical Equipment Inquiry' : 'Contact Form Submission';

  const firstItem = items[0]?.name;
  const subject =
    formType === 'product'
      ? `[Bishnoi Omniverse equipment inquiry] ${inquiryType} — ${
          firstItem ? `${firstItem}${items.length > 1 ? ` +${items.length - 1} more` : ''}` : name
        }`
      : `[Bishnoi Omniverse ${inquiryType}] Message from ${name}`;

  const footer =
    formType === 'product'
      ? `This inquiry was submitted through the Medical Equipment pages on the ${BRAND} website. Reply directly to this email to respond to the sender.`
      : `This message was submitted through the Contact Us page on the ${BRAND} website. Reply directly to this email to respond to the sender.`;

  const sent = await sendMail(
    {
      to: recipients,
      subject,
      html: renderHtml(context, fields, items, message, files.listed, footer, assets),
      text: renderText(context, fields, items, message, files.listed),
      replyTo: { name, email: mail },
      attachments: files.attachments,
    },
    env
  );

  // Logged whether or not the email went out: an inquiry the inbox never received is the one
  // most worth having on record. waitUntil lets it finish after the visitor has their answer.
  const sheetEntry = { inquiryType, name, email: mail, phone, details, items, message, files: files.listed, emailed: sent.ok };
  if (ctx) ctx.waitUntil(logToSheet(sheetEntry, env));
  else await logToSheet(sheetEntry, env);

  if (!sent.ok) {
    // Names which providers were tried, never why in detail.
    return result(500, 'We could not send your message. Please try again later.', {
      code: 'provider_failed',
      tried: Object.keys(sent.errors),
    });
  }

  return result(200, formType === 'product' ? 'Inquiry sent.' : 'Message sent.');
}

/* ------------------------------------------------------------------ *
 * HTTP entry point
 * ------------------------------------------------------------------ */

function isAllowedOrigin(origin, env) {
  const list = String(env.ALLOWED_ORIGINS ?? '')
    .split(',')
    .map((entry) => entry.trim())
    .filter(Boolean);
  if (list.includes('*')) return true;
  return origin !== '' && list.includes(origin);
}

export default {
  async fetch(request, env, ctx) {
    // The email's images, fetched by mail clients (Gmail through its image proxy) with no Origin.
    const url = new URL(request.url);
    if (url.pathname.startsWith('/email/') && (request.method === 'GET' || request.method === 'HEAD')) {
      const image = EMAIL_ASSETS[url.pathname.slice('/email/'.length)];
      if (!image) return new Response('Not found', { status: 404 });
      return new Response(request.method === 'HEAD' ? null : image, {
        headers: {
          'Content-Type': 'image/png',
          'Cache-Control': 'public, max-age=604800',
          'X-Content-Type-Options': 'nosniff',
        },
      });
    }

    const origin = request.headers.get('Origin') || '';
    const allowed = isAllowedOrigin(origin, env);

    const headers = {
      'Content-Type': 'application/json; charset=utf-8',
      'X-Content-Type-Options': 'nosniff',
      // Never let a proxy or browser cache a submission response.
      'Cache-Control': 'no-store, no-cache, must-revalidate',
      Vary: 'Origin',
    };
    if (allowed && origin) headers['Access-Control-Allow-Origin'] = origin;

    const reply = (status, body, extra = {}) =>
      new Response(JSON.stringify(body), { status, headers: { ...headers, ...extra } });

    if (request.method === 'OPTIONS') {
      if (!allowed) return new Response(null, { status: 403, headers });
      return new Response(null, {
        status: 204,
        headers: {
          ...headers,
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Max-Age': '86400',
        },
      });
    }

    if (request.method !== 'POST') {
      return reply(405, { message: 'Method not allowed.' }, { Allow: 'POST, OPTIONS' });
    }

    // Only the website's own pages may submit. (Without this, any page on the web could fire
    // POSTs at the endpoint even though it could not read the replies.)
    if (!allowed) return reply(403, { message: 'This form cannot be submitted from here.' });

    // Refuse a body we could never process before reading it. 4/3 covers base64 inflation, plus
    // room for the JSON envelope.
    const ceiling = Math.floor((MAX_TOTAL_BYTES * 4) / 3) + 512 * 1024;
    const tooLarge = () =>
      reply(413, { message: `Your attachments are too large. Please keep the total under ${MAX_TOTAL_BYTES / 1048576} MB.` });
    if (Number(request.headers.get('Content-Length') || 0) > ceiling) return tooLarge();

    let payload;
    try {
      const raw = await request.text();
      if (raw.length > ceiling) return tooLarge();
      payload = JSON.parse(raw);
    } catch {
      return reply(400, { message: 'Invalid request body.' });
    }

    try {
      // Image links in the email point back at this Worker, unless EMAIL_ASSET_BASE says otherwise.
      const assets = (String(env.EMAIL_ASSET_BASE ?? '').trim() || `${url.origin}/email`).replace(/\/+$/, '') + '/';
      const out = await processInquiry(payload, env, request.headers.get('CF-Connecting-IP') || '', ctx, assets);
      return reply(out.status, out.body);
    } catch (err) {
      log(`Unhandled error: ${err && err.stack ? err.stack : err}`);
      return reply(500, { message: 'We could not send your message. Please try again later.' });
    }
  },
};
