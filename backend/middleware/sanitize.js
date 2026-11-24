const FORBIDDEN_KEYS = new Set(['__proto__', 'constructor', 'prototype']);
const MAX_DEPTH = 10;

/**
 * Removes MongoDB operator keys (`$gt`, `$where`, ...), dotted paths and
 * prototype-pollution keys from user input, in place.
 */
function scrub(value, depth = 0) {
  if (value === null || typeof value !== 'object' || depth > MAX_DEPTH) return value;

  if (Array.isArray(value)) {
    for (let index = 0; index < value.length; index += 1) {
      value[index] = scrub(value[index], depth + 1);
    }
    return value;
  }

  for (const key of Object.keys(value)) {
    if (key.startsWith('$') || key.includes('.') || FORBIDDEN_KEYS.has(key)) {
      delete value[key];
    } else {
      value[key] = scrub(value[key], depth + 1);
    }
  }
  return value;
}

export function sanitizeRequest(req, _res, next) {
  if (req.body && typeof req.body === 'object') scrub(req.body);
  next();
}

export { scrub as sanitizeValue };
