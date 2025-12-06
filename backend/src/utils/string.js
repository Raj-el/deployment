/**
 * Convert arbitrary text into a predictable lowercase slug.
 * Falls back to the provided default if the result would be empty.
 */
export function slugify(value, fallback = 'value') {
  if (value === undefined || value === null) return fallback;
  const slug = String(value)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  return slug || fallback;
}
