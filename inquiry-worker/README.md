# bishnoi-inquiry (Cloudflare Worker)

Receives the website's inquiry forms and emails them through Brevo, and optionally records each one
in a Google Sheet (`google-sheets/Code.gs`). The website is a static
export on GitHub Pages, so this Worker plays the part `api/inquiry.php` plays on the Getmeds sites.

Full setup, testing and troubleshooting: [`../docs/inquiries.md`](../docs/inquiries.md).

```bash
cd inquiry-worker
npm install
npx wrangler login
npx wrangler secret put BREVO_API_KEY            # and the other secrets listed in the docs
npm run deploy                                    # prints the endpoint URL
npm run tail                                      # live logs: look for [bishnoi-inquiry] lines
```
