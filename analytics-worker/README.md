# bishnoi-analytics (Cloudflare Worker + D1)

Collects the website's page views, clicks, time on page and conversions, and serves the numbers
to the signed-in dashboard at `/admin/`. The website is a static export on GitHub Pages, so this
Worker is its analytics backend.

Full setup, what is tracked and troubleshooting: [`../docs/analytics.md`](../docs/analytics.md).

```bash
cd analytics-worker
npm install
npx wrangler login
npx wrangler d1 create bishnoi-analytics     # paste the database_id into wrangler.toml
npm run db:migrate
npx wrangler secret put ADMIN_PASSWORD
npx wrangler secret put SESSION_SECRET
npm run deploy                                # prints the endpoint URL
npm run tail                                  # live logs: look for [bishnoi-analytics] lines
```
