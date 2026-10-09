# Site analytics and the /admin/ dashboard

The website records its own traffic and shows it at **`/admin/`** (e.g.
`https://bishnoiomniverse.com/admin/`), behind a username and password.

The site is a static export on GitHub Pages, so it has no server of its own. Like the inquiry
forms, the analytics run on Cloudflare: a Worker (`analytics-worker/`) receives the events and
stores them in a Cloudflare D1 database (SQLite). The dashboard page signs in to that Worker and
reads the numbers from it. Cloudflare's free plan covers a site of this size comfortably (D1 free:
5 GB, 100,000 writes a day).

```
visitor's browser ── lib/analytics.ts ──POST /collect──▶ analytics Worker ──▶ D1 database
/admin/ dashboard ──POST /admin/login, GET /admin/stats──▶ analytics Worker
```

## What is tracked

| Event | When | What is stored |
|---|---|---|
| Page view | every page, including in-site navigation | path, page title, referring site, UTM tags |
| Click | every link and button | its text, where it leads, and its type: internal, external, email, phone, WhatsApp, download, button |
| Engagement | when the visitor leaves a page | seconds on the page (visible time only) and how far it was scrolled |
| Conversion | an inquiry is sent; a product is added to the quote list | "Inquiry sent" + inquiry type; "Added to quote" + product id |
| Presence | every 30 s while a tab is open and visible; a goodbye when it closes | who is on the site right now and the page they are reading |

Each event also stores the country, region and city (Cloudflare's approximate lookup from the connection, never more exact than a city), device type, browser family and OS. Because the IP lookup places the connection's exit point — mobile carriers and VPNs often surface in another country — the tracker also sends the device's time zone, and when the zone's country disagrees with the IP's, the zone's country is stored instead (with no region/city, since the IP-derived ones would describe the wrong place).

**Live:** the dashboard asks who is online every 4 seconds. A visitor appears within a few seconds of opening the site, follows them from page to page, and disappears a few seconds after they close the tab (or within about a minute of switching to another tab). Visits to `localhost` are not counted.

**What is not stored:** IP addresses, names, emails, phone numbers or anything typed into a form. A
visitor is a random id kept in the browser's localStorage, and a visit (session) ends after 30
minutes of inactivity. Crawlers and headless browsers are dropped. Events older than 400 days are
deleted automatically (`RETENTION_DAYS`).

Every browser is counted, the team's own included (each Chrome profile is a separate visitor). Only
the `/admin/` dashboard itself is not tracked. The dashboard refreshes itself every 15 seconds.

### The dashboard

- **Headline numbers:** visitors (and how many are returning), page views, average time on page,
  bounce rate, clicks and conversions, each compared with the previous period of the same length.
- **Traffic over time:** page views and visitors by day (by hour for "Today").
- **Top pages:** views, visitors, average time and scroll depth per page.
- **Traffic sources, landing pages and campaigns** (links tagged with `utm_source`, `utm_medium` or
  `utm_campaign`, e.g. `https://bishnoiomniverse.com/?utm_source=linkedin&utm_campaign=cphi`).
- **Most clicked:** every link and button, and clicks grouped by type.
- **Conversions:** inquiries sent and products added to a quote, plus the most-quoted products.
- **Countries:** an interactive D3 globe (drag to turn it, hover or click a country) shaded by
  visitors, page views, clicks or conversions, with a live dot where someone is on the site now,
  and a table of every country's visitors, views, clicks, conversions and time on page. Countries
  too small for the map (Singapore, Hong Kong…) show as dots.
- **Audience:** new and returning visitors, visits by hour and weekday, devices, browsers and
  operating systems.
- **Recent activity:** a live feed of the latest events, plus an "online now" count (last 5 minutes).
- **Export CSV:** every raw event in the selected date range.

To give a link or button a clearer name on the dashboard, add `data-track="Name"` to it. To leave
an element out of click tracking, put `data-track-ignore` on it or on a parent.

## One-time setup

You need the Cloudflare account that already runs the inquiry Worker.

```bash
cd analytics-worker
npm install
npx wrangler login

# 1. Create the database. Copy the database_id it prints into wrangler.toml.
npx wrangler d1 create bishnoi-analytics

# 2. Create the tables.
npm run db:migrate

# 3. The dashboard login. ADMIN_USERNAME is in wrangler.toml ([vars], default "admin").
npx wrangler secret put ADMIN_PASSWORD     # choose a long password (12+ characters)
npx wrangler secret put SESSION_SECRET     # paste 64 random hex characters, e.g. from:
                                           #   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# 4. Deploy. It prints the Worker's address, e.g. https://bishnoi-analytics.<you>.workers.dev
npm run deploy
```

Then connect the website. The live Worker is `https://bishnoi-analytics.getmedsitdepartment.workers.dev`
and `.github/workflows/deploy.yml` builds the site with that address by default. To point the site
at a different Worker, set the repository variable `ANALYTICS_ENDPOINT` (GitHub → **Settings →
Secrets and variables → Actions → Variables**), then re-run the **Deploy to GitHub Pages** workflow.
Open `https://bishnoiomniverse.com/admin/` and sign in.

If the site moves to another domain, add it to `ALLOWED_ORIGINS` in `analytics-worker/wrangler.toml`
and run `npm run deploy` again. Events from any other origin are refused.

## Everyday tasks

| Task | How |
|---|---|
| Change the password | `npx wrangler secret put ADMIN_PASSWORD` (in `analytics-worker/`) |
| Sign everyone out | `npx wrangler secret put SESSION_SECRET` with a new random value |
| Change the username | edit `ADMIN_USERNAME` in `wrangler.toml`, then `npm run deploy` |
| Watch live logs | `npm run tail`, look for `[bishnoi-analytics]` lines |
| Query the data directly | `npx wrangler d1 execute bishnoi-analytics --remote --command "SELECT ..."` |

A sign-in lasts 12 hours, or until the browser tab is closed. After 5 wrong passwords from the same
network, sign-in is blocked for 15 minutes.

## Local development

```bash
# terminal 1: the Worker, with a local database
cd analytics-worker
cp .dev.vars.example .dev.vars        # set ADMIN_PASSWORD and SESSION_SECRET in it
npm run db:migrate:local
npm run dev                           # http://localhost:8787

# terminal 2: the website, with NEXT_PUBLIC_ANALYTICS_ENDPOINT=http://localhost:8787 in .env.local
npm run dev                           # then open http://localhost:3000/admin/
```

With `NEXT_PUBLIC_ANALYTICS_ENDPOINT` blank, nothing is tracked, and `/admin/` says analytics is
not connected.

## Troubleshooting

| Symptom | Cause |
|---|---|
| `/admin/` says "Analytics is not connected" | `ANALYTICS_ENDPOINT` repository variable is missing, or the site was not rebuilt after adding it |
| "The dashboard login has not been set up yet" | `ADMIN_PASSWORD` or `SESSION_SECRET` (32+ characters) is not set on the Worker |
| "Could not reach the analytics service" | wrong `ANALYTICS_ENDPOINT`, or the site's domain is not in `ALLOWED_ORIGINS` |
| Dashboard works but shows no visits | ad blockers and Brave's shields block some trackers. `npm run tail` shows incoming requests |
