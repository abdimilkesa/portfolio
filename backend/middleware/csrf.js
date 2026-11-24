import { isAllowedOrigin } from '../config/cors.js';
import { ApiError } from '../utils/ApiError.js';

const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);

function isSameOrigin(origin, req) {
  try {
    return new URL(origin).host === req.get('host');
  } catch {
    return false;
  }
}

/**
 * CSRF defence for cookie-authenticated requests. Browsers cannot attach a
 * custom header to cross-site form posts, and cross-origin scripts that try
 * are stopped by the CORS preflight. Requests that do send an Origin must
 * come from the site itself or an allow-listed frontend.
 */
export function requireAjaxHeader(req, _res, next) {
  if (SAFE_METHODS.has(req.method)) return next();

  if (req.get('X-Requested-With') !== 'XMLHttpRequest') {
    return next(ApiError.forbidden('Request rejected: missing X-Requested-With header.'));
  }

  const origin = req.get('Origin');
  if (origin && !isAllowedOrigin(origin) && !isSameOrigin(origin, req)) {
    return next(ApiError.forbidden('Request rejected: cross-site requests are not allowed.'));
  }

  return next();
}
