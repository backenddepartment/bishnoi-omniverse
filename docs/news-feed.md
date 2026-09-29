# Running the Articles page from a news API

The cards on `/articles/` — **Global Medical Equipment & Procurement News** — are drawn from
`lib/data/newsData.json`, which is written from a news API each time the site is built.

## How it works

This site is a **static export** deployed to GitHub Pages: there is no server running, so nothing
can call the API when a visitor loads the page. That is also what keeps the API key safe — a key
used from the browser can be read by anyone who opens the page. Instead the news is read **once
per build**, the same way the catalog is read from its sheet:

```
News API  ──>  scripts/sync-news.mjs  ──>  lib/data/newsData.json  ──>  next build  ──>  GitHub Pages
```

**News goes live on the next rebuild, not instantly.** The deploy workflow rebuilds hourly, on
every push to `main`, and whenever you click **Run workflow** under Actions.

The key is read only by the script, on GitHub's build machine. It is never part of the published
site.

## Setup

### 1. Get an API key

The script speaks to three services. Pick one and sign up for a key.

| Service | `NEWS_API_PROVIDER` | Free plan | May the free plan run a live site? |
| --- | --- | --- | --- |
| [NewsData.io](https://newsdata.io) | `newsdata` (the default) | 200 credits a day, 10 articles each, 12-hour delay | Yes, by their own description — confirm in their terms |
| [GNews](https://gnews.io) | `gnews` | 100 requests a day, 12-hour delay | No — non-commercial and testing only. Paid from €49.99 a month |
| [NewsAPI.org](https://newsapi.org) | `newsapi` | 100 requests a day, 24-hour delay | No — development only. Paid from $449 a month |

Prices and terms are as published in September 2026; check them before you commit to one.

One build makes **four requests**. Hourly builds therefore use about 96 a day, inside NewsData.io's
free allowance of 200; on the other two, leave fewer entries in `QUERIES`.

### 2. Try it on your own computer

Add the key to `.env.local` in the project folder (the file is ignored by git, so the key is not
committed):

```
NEWS_API_KEY=your-key-here
NEWS_API_PROVIDER=newsdata
```

Then:

```
npm run news:sync
```

It prints how many articles it kept, and writes them to `lib/data/newsData.json`. Open
`http://localhost:3000/articles/` to see them.

**Do not give the key a `NEXT_PUBLIC_` prefix.** That prefix is what tells Next.js to publish a
value to the browser.

### 3. Add the key to GitHub

In the repository on GitHub: **Settings → Secrets and variables → Actions**.

- Under **Secrets**, add `NEWS_API_KEY` with the key as its value.
- Under **Variables**, add `NEWS_API_PROVIDER` — only if you are not using NewsData.io.

### 4. Publish

Push to `main`, or run the workflow by hand under **Actions → Deploy to GitHub Pages → Run
workflow**. The step **Sync news for the Articles page** shows what was fetched.

## What the script keeps

- **On topic only.** The APIs match loosely, so an article is kept only if its title or summary
  mentions medical equipment, devices, procurement, supply chains and the like. The words are the
  `RELEVANT` list at the top of `scripts/sync-news.mjs`.
- **One card per story.** The same article returned twice, or the same headline from two outlets,
  appears once.
- **The newest 45**, shown nine to a page. Change with `NEWS_MAX_ITEMS`.
- **With a photo.** An article with no photo of its own is left out.
- **No adverts.** Market-research press releases and articles marked as sponsored are left out.
- **A label for each.** Procurement, Supply Chain, Infrastructure, Regulation, Hospital Technology
  or Medical Devices, from the words in the article; otherwise Medical Equipment. The rules are
  the `CATEGORIES` list.

What to search for is the `QUERIES` list. Each entry is one request per build.

## Settings

| Variable | Default | What it does |
| --- | --- | --- |
| `NEWS_API_KEY` | — | The key. Unset, the script does nothing and the committed file is used. |
| `NEWS_API_PROVIDER` | `newsdata` | `newsdata`, `gnews` or `newsapi`. |
| `NEWS_MAX_ITEMS` | `45` | How many articles to keep. |
| `NEWS_MAX_AGE_DAYS` | `30` | Articles older than this are dropped. |
| `NEWS_DEBUG` | off | `1` lists every article that was left out, and why. |
| `NEWS_LANGUAGE` | `en` | Two-letter language code. |
| `NEWS_IMAGES` | on | `off` leaves out the photos; every card then shows a plain panel. |

## Photos

Every card shows the article's own photo. The script reads each article's page for the photo the
outlet itself puts forward when the page is shared, which is usually larger and sharper than the
thumbnail the API carries, and falls back to that thumbnail. The card shows the photo from the
outlet's own site; it is not copied into this one.

Some outlets refuse to serve their photos to other sites. Where a photo does not load for a
visitor, the card shows a plain panel with the outlet's name instead of a broken image.

Those photos belong to the outlets. Showing a thumbnail beside a headline that links to the
article is what news aggregators commonly do, but it is a decision for the business to take
rather than a technical one. Setting `NEWS_IMAGES=off` avoids the question.

## Adding an article by hand

Add an entry to `items` in `lib/data/articlesData.json`; the shape is described at the top of
`app/articles/page.tsx`. It appears among the synced news, in date order. The entries there
marked `"sample": true` are stand-ins that show only while there is no synced news; delete them
once the feed is live.

## When something goes wrong

The news is an extra, so a failure never stops a deploy. The script prints a warning and leaves
the file as it was.

| Message | Meaning |
| --- | --- |
| `NEWS_API_KEY not set` | No key was found. Locally, check `.env.local`; on GitHub, check the secret's name. |
| `HTTP 401` or `API key is invalid` | The key is wrong, or belongs to a different service than `NEWS_API_PROVIDER`. |
| `HTTP 429`, or a message about a limit or quota | The day's allowance is used up. It resets the next day. |
| `No usable articles came back` | The API answered, but nothing passed the on-topic check. Widen `QUERIES` or `RELEVANT`. |

On GitHub each build starts from the committed `newsData.json`. If a build's fetch fails, that
build shows the committed articles — none, unless you have committed some — until the next
hourly build succeeds. To keep a floor under the page, run `npm run news:sync` locally now and
then and commit the file.
