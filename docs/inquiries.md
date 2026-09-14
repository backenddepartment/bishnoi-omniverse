# Inquiry forms: how they send, and how to set them up

Every inquiry form on the site — the catalog's **Submit Hospital Requisition List** pop-up and the
four forms on the **Contact** page — sends through one pipeline, ported from the Getmeds sites.

## How an inquiry travels

```
Visitor fills a form (catalog requisition pop-up / contact page)
  │  honeypot field "website" (hidden) + Cloudflare Turnstile "Verify you are human"
  ▼
lib/inquiry.ts      collectFiles()  checks & base64-encodes attachments
                    sendInquiry()   adds captchaToken + honeypot, POSTs JSON
  ▼
inquiry-worker/     Cloudflare Worker (this site has no server — GitHub Pages only serves files)
                      0. origin allowed? body under the size limit?
                      1. honeypot filled?   → pretend success, drop it (bot)
                      2. Turnstile token    → asks Cloudflare; fails closed
                      3. validate fields    → name + valid email required (+ phone for equipment)
                      4. pick recipient     → from the Worker's secrets
                      5. build the email    → HTML + plain text, items linked to their pages
  ▼
Brevo API           api.brevo.com/v3/smtp/email
  ▼
Recipient inbox     Reply-To = the visitor, so "Reply" answers them
```

| Form | formType | Recipient |
| --- | --- | --- |
| Catalog "Submit Hospital Requisition List" | `product` | `PRODUCT_INQUIRY_RECIPIENT_EMAIL`, or `CONTACT_RECIPIENT_EMAIL` if blank |
| Contact page — Hospitals & Procurement (where product pages send buyers) | `product` | same |
| Contact page — Clinicians, Patients, Trade Partners | `contact` | `CONTACT_RECIPIENT_EMAIL` |

Limits (same as Getmeds): each file under 4 MB, at most 10 MB and 6 files per inquiry. The forms
accept PDF, DOCX and XLSX.

**Until the endpoint is configured, the forms do not pretend to send**: they tell the visitor to
email `contact@bishnoi.ai` instead.

## Setup

### 1. Brevo (email sending) — a separate account for this site

Use a new Brevo account for Bishnoi Omniverse, not the Getmeds one. The free plan allows about
300 emails a day **per account**, shared by every site using that account's key — a separate
account gives this site its own quota.

1. Sign up at brevo.com with the email address that will own this site's sending.
2. **Senders, Domains & Dedicated IPs → Domains**: add the site's domain and add the SPF, DKIM and
   DMARC records Brevo gives you at your DNS host. Wait until Brevo shows them verified. This is
   what keeps inquiries out of spam.
   - The site still lives on `backenddepartment.github.io`, which you cannot add DNS records to.
     Use the company's own domain (e.g. `bishnoi.ai`) for the sender. A Gmail sender works but
     often lands in spam.
3. **Senders**: add a sender on that domain, e.g. `no-reply@bishnoi.ai`.
4. **SMTP & API → API Keys**: create a key and copy it.
5. **Security → Authorised IPs**: turn IP blocking off. The Worker sends from changing Cloudflare
   addresses; with blocking on, Brevo refuses every message (`Provider brevo failed: HTTP 401`).

**No domain yet? Skip steps 2–3 for now.** The website can stay on GitHub Pages — only the "From"
address of the notification emails is affected:

- **Senders → Add a sender**, with a mailbox you can open (a dedicated Gmail is fine). Brevo emails
  it a confirmation code; enter the code and the sender is verified. Use that address for
  `BREVO_SENDER_EMAIL`.
- Unauthenticated senders — free-mail addresses especially — are more likely to land in spam, and
  Brevo may rewrite a free-mail "From". The emails only go to your own inbox, so mark the first one
  **Not spam** and add a filter that never sends `[Bishnoi Omniverse` subjects to spam.
- When the domain is ready, authenticate it, add the domain sender, and replace the
  `BREVO_SENDER_EMAIL` secret. No code changes.

### 2. Cloudflare Turnstile (spam protection)

1. Cloudflare dashboard → **Turnstile → Add widget**. Hostnames: `backenddepartment.github.io`
   (and your own domain later), plus `localhost` for local testing.
2. Copy the **site key** (public) and **secret key** (private).

### 3. Deploy the Worker

Needs a free Cloudflare account (the same one as Turnstile is simplest) and Node 18+.

```bash
cd inquiry-worker
npm install
npx wrangler login                                     # opens the browser once

npx wrangler secret put BREVO_API_KEY                  # paste the Brevo key
npx wrangler secret put BREVO_SENDER_EMAIL             # e.g. no-reply@bishnoi.ai
npx wrangler secret put CONTACT_RECIPIENT_EMAIL        # inbox for contact-page inquiries
npx wrangler secret put PRODUCT_INQUIRY_RECIPIENT_EMAIL  # optional: equipment inquiries inbox
npx wrangler secret put TURNSTILE_SECRET_KEY           # skip for the very first test only

npm run deploy
```

`npm run deploy` prints the endpoint, e.g. `https://bishnoi-inquiry.<your-subdomain>.workers.dev`.

The pages allowed to submit are listed in `ALLOWED_ORIGINS` in `inquiry-worker/wrangler.toml`.
When the site moves to its own domain, add it there and run `npm run deploy` again.

### 4. Point the website at the Worker

These two values are public — they end up in the browser — so they are repository **variables**,
not secrets.

GitHub → the repository → **Settings → Secrets and variables → Actions → Variables** tab →
**New repository variable**:

| Name | Value |
| --- | --- |
| `INQUIRY_ENDPOINT` | the Worker URL from step 3 |
| `TURNSTILE_SITE_KEY` | the Turnstile **site** key |

Then **Actions → Deploy to GitHub Pages → Run workflow**. The build bakes both in.

For local development, copy `.env.example` to `.env.local`, fill in the same two values and
restart `npm run dev`.

## Test before going live

1. **First test without Turnstile**: leave `TURNSTILE_SECRET_KEY` unset on the Worker and
   `TURNSTILE_SITE_KEY` empty on the site. Submit a requisition and a contact-page form; check the
   recipient inbox and its spam folder.
2. **Then arm Turnstile**: set both keys and redeploy the Worker and the site. The submit button
   stays disabled until "Verify you are human" passes.
3. **Brevo → Transactional → Logs** shows each message as delivered.
4. If something fails, run `npm run tail` in `inquiry-worker/` while submitting. Lines start with
   `[bishnoi-inquiry]` and name the problem, e.g. `Provider brevo failed: HTTP 401 …` or
   `No valid recipient configured for form type product`.

## Where the code is

| File | Role |
| --- | --- |
| `inquiry-worker/src/index.js` | The endpoint: honeypot, Turnstile, validation, email, Brevo |
| `inquiry-worker/wrangler.toml` | Worker name and non-secret settings |
| `lib/inquiry.ts` | Browser helper: file checks, sending, limits |
| `components/InquiryGuard.tsx` | Honeypot + Turnstile widget for each form |
| `app/catalog/page.tsx` | Requisition pop-up |
| `app/contact/page.tsx`, `lib/data/contactData.json` | Contact page forms and their fields |
