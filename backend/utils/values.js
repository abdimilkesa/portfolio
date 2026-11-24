export function slugify(value) {
  const slug = String(value || '')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 140);
  return slug || 'project';
}

export function asBoolean(value) {
  if (typeof value === 'boolean') return value;
  return ['true', '1', 'on', 'yes'].includes(String(value).toLowerCase());
}

export function asList(value) {
  const source = Array.isArray(value) ? value : String(value || '').split(',');
  const seen = new Set();
  const list = [];
  for (const item of source) {
    const text = String(item).trim().slice(0, 40);
    const key = text.toLowerCase();
    if (!text || seen.has(key)) continue;
    seen.add(key);
    list.push(text);
    if (list.length === 16) break;
  }
  return list;
}

export function emptyToNull(value) {
  if (value === undefined || value === null || value === '') return null;
  return value;
}
