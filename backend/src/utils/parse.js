// Small parsing utilities used by models/controllers

export function toNumber(v) {
  if (v === null || v === undefined) return null;
  if (typeof v === 'number') return v;
  const cleaned = String(v).replace(/[$,%\s]/g, '').replace(/--/g, '');
  const n = Number(cleaned);
  return Number.isNaN(n) ? null : n;
}

export function toDate(v) {
  if (!v) return null;
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? null : d;
}
