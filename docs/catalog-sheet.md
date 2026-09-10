# Running the medical equipment catalog from a Google Sheet

The catalog — the grid at `/catalog/`, the header's Catalog mega-menu, and every
`/catalog/<id>/` product detail page — is generated from `lib/data/catalogData.json`, which is
in turn generated from a Google Sheet.

Source sheet: **Medical Equipment Catalog** — 306 products, 24 categories, 59 subcategories.

## How it works

This site is a **static export** deployed to GitHub Pages: there is no server running, so nothing
can query the sheet when a visitor loads a page. Instead the sheet is read **once per build**:

```
Google Sheet  ──(CSV export)──>  scripts/sync-catalog.mjs  ──>  lib/data/catalogData.json  ──>  next build  ──>  GitHub Pages
```

**Edits go live on the next rebuild, not instantly.** The deploy workflow rebuilds hourly, on
every push to `main`, and whenever you click **Run workflow** under Actions.

The upside is that every product gets a real pre-rendered HTML page at its own URL — fast,
shareable and indexable.

## Setup

### 1. Share the sheet

The spreadsheet must be readable without signing in: **Share → General access → Anyone with the
link → Viewer**.

### 2. Add the CSV URL to GitHub

Take the spreadsheet ID out of its URL:

```
https://docs.google.com/spreadsheets/d/<SPREADSHEET_ID>/edit
```

and build the CSV export URL:

```
https://docs.google.com/spreadsheets/d/<SPREADSHEET_ID>/export?format=csv
```

In the repository go to **Settings → Secrets and variables → Actions → New repository secret** and
add:

| Secret name | Value |
| --- | --- |
| `CATALOG_SHEET_CSV` | the CSV export URL above |

That's it. The next build picks up the sheet.

> `export?format=csv` with no `gid` returns the **first tab**, which is the catalog. If tabs are
> ever reordered, pin the tab explicitly by adding its `gid` from the sheet URL:
> `…/export?format=csv&gid=<GID>`.

## Column reference

Header names are matched case-insensitively and column order does not matter. Extra columns are
ignored, so working notes can live in the sheet.

| Column | Required | Used for |
| --- | --- | --- |
| `Category` | **yes** | Top level of the catalog rail and the mega-menu. |
| `Subcategory` | **yes** | Second level, shown nested under its category. |
| `Product` | **yes** | Product title, and the source of the page URL. |
| `Description` | | Shown under the title and in the Details tab. |
| `Specifications` | | Split on `;` into a spec table where clauses read as `Label: value`. |
| `Sterile / Non-Sterile` | | Attribute chip, card badge, and At-a-glance row. |
| `Disposable / Reusable` | | Attribute chip and At-a-glance row. |
| `Common Sizes / Capacity` | | Becomes the size selector when it is a short comma list; otherwise shown as a sentence. |
| `Typical Regulatory Class*` | | Shown beneath the title and in At-a-glance. |
| `Key Precautions / Warnings*` | | The Safety & Handling tab's callout. |
| `Typical Use Setting*` | | Use & Setting tab, At-a-glance. |
| `Primary End User*` | | Use & Setting tab, At-a-glance. |
| `Reference Image URL` | | **Not used** — see *Images* below. |
| `Image Source & License` | | **Not used** — see *Images* below. |

### The `*` columns

The sheet's own **Notes & Column Guide** tab states that starred columns are *"general reference
information compiled from common medical-device knowledge, written at the product-TYPE level (not
per exact SKU/brand)"*, and asks that regulatory or clinical content be verified before
publishing.

The site reflects that. Those values are never presented as claims about a specific SKU:

- the product page carries a permanent note in the **At a glance** panel,
- the Specifications, Safety & Handling and Use & Setting tabs each repeat it,
- the Safety tab adds that the precautions are not a complete list of contraindications,
- the catalog grid carries the same note beneath the results.

**Do not remove those notes** without a decision about regulatory exposure.

## Product URLs

The page URL is derived from the product name: *"Nitrile Examination Gloves"* becomes
`/catalog/nitrile-examination-gloves/`.

**Renaming a product changes its URL and breaks any existing link to it.**

Twelve product names appear under more than one category. The first occurrence keeps the plain
slug and later ones get the category appended, so both stay reachable and readable:

```
/catalog/ventilators/                                    (Respiratory Care)
/catalog/ventilators-emergency-and-critical-care/         (Emergency & Critical Care)
```

That means **reordering rows can reassign which of a duplicated pair gets the short URL.** If
that matters, give the two entries distinct product names.

## Images

Products are illustrated with their **category's line icon**, not photographs.

The sheet's `Reference Image URL` column is deliberately ignored. Its values are links to
*web pages* on Pexels, Wikimedia Commons and Pixabay — not image files — so they cannot be
displayed directly, and the sheet's Notes tab is explicit:

> Never use these links as-is on a live commercial site without opening the page and confirming
> the license yourself — treat them as a research starting point, not a final asset.

125 of the 306 rows have no link at all.

### Adding a real photo to a product

Once a photo has been licensed and checked:

1. Commit the image file to `public/products/` (roughly 1000×1000px works well).
2. Add these four columns to the sheet and fill them in for that row:

| Column | Value |
| --- | --- |
| `Image File` | the filename, e.g. `nitrile-gloves.jpg` |
| `Image Alt` | description for screen readers |
| `Image Credit` | attribution text, if the licence requires it |
| `Image Source` | URL the credit links to |

The sync picks all four up automatically, and that product switches from the icon to the full
photo gallery — thumbnail rail, zoom and credit line included. Products without `Image File` keep
their icon, so this can be done one product at a time.

## Adding a product

Add a row. Category and Subcategory are matched by name — reusing an existing spelling files the
product under the existing branch, and a new spelling creates a new one. Then wait for the hourly
rebuild, or trigger one under **Actions → Deploy to GitHub Pages → Run workflow**.

New products appear in the grid, in the sidebar counts, in the mega-menu, in the sitemap, and get
their own detail page automatically.

## When something goes wrong

The sync **never writes a partial or empty catalog**. If the sheet cannot be read or a row is
invalid, the step fails, the build stops, and the previously deployed site stays live. Open the
failed run under **Actions** to see the offending rows:

```
[catalog] 2 problem(s) in the sheet — nothing was written:
  • Row 41: Category, Subcategory and Product are all required (got "Gloves" / "" / "Vinyl Gloves").
```

Row numbers match the sheet's left-hand gutter.

Common causes:

- **"got an HTML page instead of CSV"** — the sheet is no longer shared as *anyone with the link
  can view*, or the URL is the `/edit` link rather than the `/export?format=csv` one.
- **"The sheet has no … column"** — a header was renamed. The error lists the headers it found.
- **Edit not showing up** — Google caches the CSV export briefly, so a rebuild started seconds
  after an edit can read stale values. Re-run the workflow.

## Running it locally

```bash
# Preview what the sheet would produce
CATALOG_SHEET_CSV="https://docs.google.com/spreadsheets/d/<ID>/export?format=csv" npm run catalog:sync
git diff lib/data/catalogData.json

# Snapshot what the site currently serves, in the sheet's own column layout
npm run catalog:export      # -> catalog-export/catalog.csv
```

With `CATALOG_SHEET_CSV` unset, `npm run catalog:sync` does nothing and says it kept the committed
JSON — so `npm run build` works offline and on a fork.

## Notes

- The generated `catalogData.json` is **not** committed back by CI; it is rebuilt in the workflow
  each time. The committed copy is the seed and the offline fallback.
- The file also holds hand-edited page copy (`hero`, `trustBanner`, `rfqCheckout`) that the sheet
  does not own. The sync replaces only `categories`, `subcategories` and `products`.
- Category icons are mapped by category slug in `lib/catalogIcons.tsx`. Renaming a category in the
  sheet changes its slug, and it falls back to a generic icon until the new key is added there.
- GitHub disables scheduled workflows on repositories with no activity for 60 days. If the hourly
  rebuild silently stops, push any commit or click **Run workflow** to re-enable it.
