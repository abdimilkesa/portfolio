import { env } from '../config/env.js';
import { Admin } from '../models/index.js';
import { ApiError } from '../utils/ApiError.js';
import { readSession } from '../utils/session.js';

export async function requireAuth(req, _res, next) {
  const token = req.cookies?.[env.cookie.name];
  if (!token) return next(ApiError.unauthorized());

  try {
    const payload = readSession(token);
    const admin = await Admin.findById(payload.sub);
    if (!admin || admin.role !== 'admin' || payload.role !== 'admin') {
      return next(ApiError.unauthorized());
    }
    req.admin = admin;
    return next();
  } catch {
    return next(ApiError.unauthorized('Your session has expired. Please sign in again.'));
  }
}
