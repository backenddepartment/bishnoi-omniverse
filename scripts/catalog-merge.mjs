/**
 * One page per product. The sheet lists some products under more than one category (Ventilators
 * under Respiratory Care and under Emergency & Critical Care) and a few products twice under two
 * names that mean the same thing (3-Ply Medical Masks and Surgical Masks). Publishing each row as
 * its own page gave Google two or three near-identical pages with the same title, description and
 * H1, which compete with each other and are often left unindexed.
 *
 * So rows that are the same product are merged into one record:
 *   - the record keeps the row from its owning category (PRIMARY_CATEGORY) and the clean URL
 *     /medical-equipment/<category>/<product-slug>/;
 *   - every other category it was listed in goes into `alsoListedIn`, so those category pages
 *     still show the product (linking to the one page);
 *   - each id that no longer has a page of its own is recorded in `aliases` (old id -> new id),
 *     for saved quote lists and the redirect stubs (scripts/write-redirects.mjs).
 *
 * Applied by scripts/sync-catalog.mjs on every sync, and to the committed JSON when no sheet is
 * configured, so the merge holds however the sheet's rows are ordered. Idempotent.
 */

/** "Fluid & IV Therapy" -> "fluid-and-iv-therapy". Same rules as the sync's product slugs. */
export function slugify(value) {
  return String(value)
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Product (slug of its name) -> the category whose page owns it: the most specific place a buyer
 * looks for it. A product listed under several categories with no entry here is owned by its
 * first row in the sheet.
 */
export const PRIMARY_CATEGORY = {
  'suction-machines': 'respiratory-care',
  ventilators: 'respiratory-care',
  'infusion-pumps': 'infusion-and-injection',
  'syringe-pumps': 'infusion-and-injection',
  'infant-warmers': 'neonatal-and-pediatric',
  'fetal-monitors': 'obstetrics-and-gynecology',
  'pediatric-bp-monitors': 'diagnostic-equipment',
  gauze: 'wound-care',
  'emergency-stretchers': 'emergency-and-critical-care',
  'bedside-lockers': 'medical-furniture',
  'overbed-tables': 'medical-furniture',
  crutches: 'physiotherapy-and-rehabilitation',
};

/**
 * Products sold under two names that are the same item (slug of the name -> slug of the name to
 * keep). The kept product records the other name in `alsoKnownAs`, so site search still finds it.
 */
export const SAME_PRODUCT = {
  '3-ply-medical-masks': 'surgical-masks',
  // Three rows for one product; the kept row has the specific description.
  'iv-cannulas': 'iv-cannulas-iv-catheters',
  'iv-catheters': 'iv-cannulas-iv-catheters',
  'foley-catheters': 'foley-catheters-indwelling-urinary-catheters',
};

/**
 * @param {object[]} products  catalog products, in sheet order (ids may carry category suffixes)
 * @param {Record<string,string>} [previousAliases]  aliases already published, kept so old ids
 *        stay resolvable
 * @returns {{ products: object[], aliases: Record<string,string> }}
 */
export function mergeProducts(products, previousAliases = {}) {
  const groups = new Map();
  for (const product of products) {
    const nameSlug = slugify(product.name);
    const key = SAME_PRODUCT[nameSlug] ?? nameSlug;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(product);
  }

  const aliases = {};
  const merged = [];
  const emitted = new Set();

  for (const product of products) {
    const nameSlug = slugify(product.name);
    const key = SAME_PRODUCT[nameSlug] ?? nameSlug;
    if (emitted.has(key)) continue;
    emitted.add(key);

    const rows = groups.get(key);
    // The owner: the row in the owning category, else the row whose name is the one kept, else
    // the first row.
    const owner =
      rows.find((r) => r.categoryId === PRIMARY_CATEGORY[key] && slugify(r.name) === key) ??
      rows.find((r) => r.categoryId === PRIMARY_CATEGORY[key]) ??
      rows.find((r) => slugify(r.name) === key) ??
      rows[0];

    const record = { ...owner, id: key };
    const listed = new Map(
      (owner.alsoListedIn ?? []).map((l) => [l.categoryId, l])
    );
    const knownAs = new Set(owner.alsoKnownAs ?? []);

    for (const row of rows) {
      if (row.id !== key) aliases[row.id] = key;
      if (row === owner) continue;
      if (row.categoryId !== owner.categoryId && !listed.has(row.categoryId)) {
        listed.set(row.categoryId, { categoryId: row.categoryId, subcategoryId: row.subcategoryId });
      }
      for (const l of row.alsoListedIn ?? []) {
        if (l.categoryId !== owner.categoryId && !listed.has(l.categoryId)) listed.set(l.categoryId, l);
      }
      if (row.name !== owner.name) knownAs.add(row.name);
      for (const n of row.alsoKnownAs ?? []) knownAs.add(n);
    }

    delete record.alsoListedIn;
    delete record.alsoKnownAs;
    if (listed.size) record.alsoListedIn = [...listed.values()];
    if (knownAs.size) record.alsoKnownAs = [...knownAs];
    merged.push(record);
  }

  // Earlier aliases stay valid; any that pointed at an id which is itself now an alias follow it.
  const ids = new Set(merged.map((p) => p.id));
  const all = { ...previousAliases, ...aliases };
  const resolve = (id, seen = new Set()) => {
    if (ids.has(id) || seen.has(id) || !(id in all)) return id;
    seen.add(id);
    return resolve(all[id], seen);
  };
  const finalAliases = {};
  for (const from of Object.keys(all).sort()) {
    if (ids.has(from)) continue; // has a page of its own again
    const to = resolve(from);
    if (ids.has(to)) finalAliases[from] = to;
  }

  return { products: merged, aliases: finalAliases };
}
