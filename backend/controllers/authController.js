import bcrypt from 'bcrypt';
import { Admin } from '../models/index.js';
import { ApiError } from '../utils/ApiError.js';
import { clearSessionCookie, setSessionCookie, signSession } from '../utils/session.js';

function publicAdmin(admin) {
  return { id: admin._id, name: admin.name, email: admin.email, role: admin.role };
}

export async function login(req, res, next) {
  const email = String(req.body.email || '').toLowerCase().trim();
  const password = String(req.body.password || '');
  const admin = await Admin.findOne({ email }).select('+password');

  const matches = admin ? await bcrypt.compare(password, admin.password) : false;
  if (!admin || !matches) {
    return next(ApiError.unauthorized('The email or password is incorrect.'));
  }

  setSessionCookie(res, signSession(admin));
  res.json({ success: true, data: publicAdmin(admin) });
}

export function logout(_req, res) {
  clearSessionCookie(res);
  res.json({ success: true, data: { signedOut: true } });
}

export function me(req, res) {
  res.json({ success: true, data: publicAdmin(req.admin) });
}
