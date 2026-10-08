import contactData from '@/lib/data/contactData.json';
import { trackConversion } from '@/lib/analytics';

/**
 * Browser side of the inquiry pipeline — the React port of Getmeds' assets/inquiry.js.
 *
 * The forms POST JSON to a Cloudflare Worker (inquiry-worker/), which checks the honeypot and the
 * Turnstile token, validates the fields, and emails the inquiry through Brevo. This site is a
 * static export, so the endpoint lives on Cloudflare rather than in the site itself.
 *
 * Both values below are public and baked in at build time (GitHub repository variables in CI,
 * .env.local when developing). With no endpoint set, forms explain how to reach us instead of
 * pretending to send.
 */
export const INQUIRY_ENDPOINT = (process.env.NEXT_PUBLIC_INQUIRY_ENDPOINT ?? '').trim();
export const TURNSTILE_SITE_KEY = (process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? '').trim();
export const CAPTCHA_ENABLED = TURNSTILE_SITE_KEY !== '';

// The Worker enforces the same limits (inquiry-worker/src/index.js); keep the two in step.
export const INQUIRY_MAX_FILE_BYTES = 4 * 1024 * 1024;
export const INQUIRY_MAX_TOTAL_BYTES = 10 * 1024 * 1024;
export const INQUIRY_MAX_FILE_COUNT = 6;

/**
 * What the requisition and hospital-supply forms accept: documents, spreadsheets and images. The
 * same list the Worker allows (ALLOWED_EXTENSIONS in inquiry-worker/src/index.js).
 */
export const DOCUMENT_EXTENSIONS = [
  'pdf', 'doc', 'docx', 'odt', 'rtf', 'txt',
  'xls', 'xlsx', 'csv',
  'jpg', 'jpeg', 'png', 'gif', 'bmp', 'tif', 'tiff',
];
/** The same list as a file picker's accept attribute. */
export const DOCUMENT_ACCEPT = DOCUMENT_EXTENSIONS.map((ext) => `.${ext}`).join(',');
/** One line under a picker saying what it takes. */
export const DOCUMENT_HINT = `PDF, Word, Excel, CSV, text or images (JPG, PNG). Up to ${INQUIRY_MAX_FILE_COUNT} files, ${
  INQUIRY_MAX_FILE_BYTES / 1048576
} MB each, ${INQUIRY_MAX_TOTAL_BYTES / 1048576} MB in total.`;

/**
 * Adds newly picked files to those already on a form, checking each against the same rules
 * collectFiles applies at send time, so a problem shows when the file is picked. A file already
 * on the list (same name and size) is not added twice.
 */
export function addFiles(existing: File[], picked: File[]): { files: File[]; error: string } {
  const files = [...existing];
  let total = existing.reduce((sum, file) => sum + file.size, 0);
  for (const file of picked) {
    if (files.some((f) => f.name === file.name && f.size === file.size)) continue;
    if (files.length >= INQUIRY_MAX_FILE_COUNT) {
      return { files, error: `You can attach up to ${INQUIRY_MAX_FILE_COUNT} files.` };
    }
    if (!DOCUMENT_EXTENSIONS.includes(extensionOf(file.name))) {
      return { files, error: `${file.name} is not a file type we can accept.` };
    }
    if (file.size >= INQUIRY_MAX_FILE_BYTES) {
      return {
        files,
        error: `${file.name} is ${mb(file.size)} MB. Each file must be under ${mb(INQUIRY_MAX_FILE_BYTES)} MB.`,
      };
    }
    if (total + file.size > INQUIRY_MAX_TOTAL_BYTES) {
      return { files, error: `Adding ${file.name} would take your files over ${mb(INQUIRY_MAX_TOTAL_BYTES)} MB in total.` };
    }
    files.push(file);
    total += file.size;
  }
  return { files, error: '' };
}

/**
 * What a contact number field keeps of what is typed or pasted: digits and spaces, with a
 * single + allowed only at the start for the country code. Letters and other symbols are dropped.
 */
export function phoneInput(value: string): string {
  const plus = value.trimStart().startsWith('+') ? '+' : '';
  return plus + value.replace(/[^\d ]/g, '');
}

export interface InquiryFile {
  name: string;
  type: string;
  base64: string;
  category: string;
}

export interface InquiryPayload {
  /** product = the medical equipment inbox, which every form now sends to; contact = the general inbox. */
  formType: 'contact' | 'product';
  inquiryType: string;
  name: string;
  email: string;
  phone?: string;
  message?: string;
  details?: { label: string; value: string }[];
  items?: { name: string; url: string }[];
  files?: InquiryFile[];
  /** Ask the Worker to insist on at least one item, note or file. */
  requireItems?: boolean;
}

export interface InquiryResult {
  ok: boolean;
  message: string;
}

function extensionOf(name: string): string {
  const dot = name.lastIndexOf('.');
  return dot === -1 ? '' : name.slice(dot + 1).toLowerCase();
}

function mb(bytes: number): string {
  return (bytes / 1048576).toFixed(1).replace(/\.0$/, '');
}

/**
 * Checks files against the same rules the Worker enforces, then base64-encodes what passes. A
 * courtesy that saves waiting on an upload that was always going to be refused — the Worker
 * re-runs every check.
 */
export function collectFiles(
  files: File[],
  allowedExt: string[],
  category = ''
): Promise<{ ok: boolean; error: string; files: InquiryFile[] }> {
  if (files.length === 0) return Promise.resolve({ ok: true, error: '', files: [] });

  if (files.length > INQUIRY_MAX_FILE_COUNT) {
    return Promise.resolve({ ok: false, error: `Please attach no more than ${INQUIRY_MAX_FILE_COUNT} files.`, files: [] });
  }

  let total = 0;
  for (const file of files) {
    if (!allowedExt.includes(extensionOf(file.name))) {
      const list = allowedExt.map((ext) => ext.toUpperCase()).join(', ');
      return Promise.resolve({
        ok: false,
        error: `${file.name} is not a file type we can accept. Please upload a ${list} file.`,
        files: [],
      });
    }
    if (file.size >= INQUIRY_MAX_FILE_BYTES) {
      return Promise.resolve({
        ok: false,
        error: `${file.name} is ${mb(file.size)} MB. Each file must be under ${mb(INQUIRY_MAX_FILE_BYTES)} MB — please compress it or split it.`,
        files: [],
      });
    }
    total += file.size;
  }
  if (total > INQUIRY_MAX_TOTAL_BYTES) {
    return Promise.resolve({
      ok: false,
      error: `Your attachments add up to ${mb(total)} MB. The total must stay under ${mb(INQUIRY_MAX_TOTAL_BYTES)} MB — please remove one and try again.`,
      files: [],
    });
  }

  return Promise.all(
    files.map(
      (file) =>
        new Promise<InquiryFile>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () =>
            resolve({ name: file.name, type: file.type, base64: String(reader.result).split(',')[1] ?? '', category });
          reader.onerror = reject;
          reader.readAsDataURL(file);
        })
    )
  )
    .then((encoded) => ({ ok: true, error: '', files: encoded }))
    .catch(() => ({ ok: false, error: 'One of your files could not be read. Please try again.', files: [] }));
}

/**
 * POSTs one inquiry. Always resolves (never rejects), so callers handle network failures and
 * server-side rejections on one path. The caller resets the Turnstile token afterwards — tokens
 * are single-use, so a retry always needs a fresh one.
 */
export async function sendInquiry(
  payload: InquiryPayload,
  guard: { captchaToken: string; honeypot: string }
): Promise<InquiryResult> {
  if (!INQUIRY_ENDPOINT) {
    return {
      ok: false,
      message: `Our online form isn't connected yet. Please email ${contactData.directContact.emails[0]} and we'll reply within 24 hours.`,
    };
  }
  if (CAPTCHA_ENABLED && !guard.captchaToken) {
    return { ok: false, message: 'Please complete the verification challenge before submitting.' };
  }

  try {
    const response = await fetch(INQUIRY_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...payload, captchaToken: guard.captchaToken, website: guard.honeypot }),
    });
    let body: { message?: string } = {};
    try {
      body = await response.json();
    } catch {
      body = {};
    }
    // Only the kind of inquiry is recorded for the analytics dashboard, never what was typed.
    if (response.ok) trackConversion('Inquiry sent', payload.inquiryType);
    return {
      ok: response.ok,
      message: body.message || (response.ok ? 'Sent.' : 'Something went wrong. Please try again.'),
    };
  } catch {
    return { ok: false, message: 'Network error. Please check your connection and try again.' };
  }
}
