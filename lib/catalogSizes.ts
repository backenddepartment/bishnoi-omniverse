/**
 * "XS, S, M, L, XL" -> a list of size options. The sheet's Common Sizes / Capacity column is prose
 * as often as it is a list, so anything that does not split into short comma-separated values
 * returns an empty list and is left to render as a sentence instead.
 */
export function parseSizes(sizes: string): string[] {
  if (!sizes) return [];
  // A semicolon joins statements rather than options — "One size (adult); paediatric available"
  // is a sentence, not two sizes to pick between.
  if (sizes.includes(';')) return [];
  const parts = sizes
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean);
  if (parts.length < 2) return [];
  // Long fragments mean it is a description, not a size list.
  if (parts.some((part) => part.length > 24)) return [];
  return parts.slice(0, 12);
}
