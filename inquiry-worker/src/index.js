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
 *   CONTACT_RECIPIENT_EMAIL          inbox for contact-page inquiries
 *   PRODUCT_INQUIRY_RECIPIENT_EMAIL  optional inbox for medical equipment inquiries; blank = contact
 *   ALLOWED_ORIGINS                  comma-separated origins allowed to submit ("*" = any)
 */

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

const esc = (value) =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

const FONT = "Georgia,'Times New Roman',serif";
const BRAND = 'Bishnoi Omniverse';

/**
 * @param {string} context  Sub-title under the masthead.
 * @param {Array<[string,string]>} fields  Ordered label/value rows; empty values dropped.
 * @param {Array<{name:string,url:string}>} items  Catalog products requested.
 * @param {string} message  Free-text notes.
 * @param {Array<{name:string,category:string}>} files  Attachment list.
 * @param {string} footer  Provenance line.
 */
function renderHtml(context, fields, items, message, files, footer) {
  const cell = (style, content) => `<td style="padding:12px 24px;border-bottom:1px solid #e4ddd0;font-family:${FONT};font-size:13px;vertical-align:top;${style}">${content}</td>`;

  const rows = fields
    .filter(([, value]) => value !== '' && value != null)
    .map(([label, value]) => `<tr>${cell('color:#6e675a;width:160px;white-space:nowrap;', esc(label))}${cell('color:#0f0e0c;', esc(value).replace(/\n/g, '<br>'))}</tr>`)
    .join('');

  const panel = (title, inner) =>
    `<tr><td style="padding:20px 24px 8px 24px;"><div style="font-family:${FONT};font-size:13px;color:#6e675a;margin-bottom:8px;">${title}</div>${inner}</td></tr>`;

  const itemsBlock = items.length
    ? panel(
        `Items Requested (${items.length})`,
        `<ul style="margin:0;padding-left:18px;">${items
          .map((item) => {
            const label = esc(item.name);
            const content = item.url ? `<a href="${esc(item.url)}" style="color:#c2561a;">${label}</a>` : label;
            return `<li style="font-family:${FONT};font-size:13px;color:#0f0e0c;margin-bottom:4px;">${content}</li>`;
          })
          .join('')}</ul>`
      )
    : '';

  const messageBlock = message.trim()
    ? panel(
        'Message',
        `<div style="font-family:${FONT};font-size:14px;color:#0f0e0c;line-height:1.65;background-color:#faf8f4;border:1px solid #e4ddd0;padding:16px 18px;">${esc(message).replace(/\n/g, '<br>')}</div>`
      )
    : '';

  const filesBlock = files.length
    ? panel(
        'Attached Files',
        `<ul style="margin:0;padding-left:18px;">${files
          .map((file) => {
            const category = file.category ? ` (${esc(file.category)})` : '';
            return `<li style="font-family:${FONT};font-size:13px;color:#0f0e0c;">${esc(file.name)}${category} &mdash; attached</li>`;
          })
          .join('')}</ul>`
      )
    : '';

  return (
    '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f2ede2;padding:32px 16px;">' +
    '<tr><td align="center">' +
    '<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border:1px solid #e4ddd0;max-width:600px;width:100%;">' +
    `<tr><td style="background-color:#0f0e0c;padding:24px;border-bottom:3px solid #f36b21;">` +
    `<span style="font-family:${FONT};font-size:17px;font-weight:bold;color:#ffffff;">${BRAND}</span><br>` +
    `<span style="font-family:${FONT};font-size:12px;color:#cfc8bb;">${esc(context)}</span>` +
    '</td></tr>' +
    `<tr><td style="padding:0;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0">${rows}</table></td></tr>` +
    itemsBlock +
    messageBlock +
    filesBlock +
    `<tr><td style="padding:20px 24px;border-top:1px solid #e4ddd0;"><span style="font-family:${FONT};font-size:11px;color:#6e675a;">${esc(footer)}</span></td></tr>` +
    '</table></td></tr></table>'
  );
}

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
    to: [{ email: msg.to }],
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
 * The pipeline
 * ------------------------------------------------------------------ */

/**
 * Blank PRODUCT_INQUIRY_RECIPIENT_EMAIL is treated as unset, so leaving it empty falls back to the
 * contact inbox instead of silently breaking equipment inquiries.
 */
function recipientFor(formType, env) {
  const fallback = String(env.CONTACT_RECIPIENT_EMAIL ?? '').trim();
  if (formType === 'product') {
    const specific = String(env.PRODUCT_INQUIRY_RECIPIENT_EMAIL ?? '').trim();
    return specific !== '' ? specific : fallback;
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

async function processInquiry(payload, env, ip) {
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

  const recipient = recipientFor(formType, env);
  if (email(recipient) === '') {
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
      to: recipient,
      subject,
      html: renderHtml(context, fields, items, message, files.listed, footer),
      text: renderText(context, fields, items, message, files.listed),
      replyTo: { name, email: mail },
      attachments: files.attachments,
    },
    env
  );

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
  async fetch(request, env) {
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
      const out = await processInquiry(payload, env, request.headers.get('CF-Connecting-IP') || '');
      return reply(out.status, out.body);
    } catch (err) {
      log(`Unhandled error: ${err && err.stack ? err.stack : err}`);
      return reply(500, { message: 'We could not send your message. Please try again later.' });
    }
  },
};
