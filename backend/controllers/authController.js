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

export async function updateAccount(req, res, next) {
  const currentPassword = String(req.body.currentPassword || '');
  const email = String(req.body.email || '').toLowerCase().trim();
  const newPassword = String(req.body.newPassword || '');
  const admin = await Admin.findById(req.admin._id).select('+password');
  if (!admin) return next(ApiError.unauthorized());

  const matches = await bcrypt.compare(currentPassword, admin.password);
  if (!matches) return next(ApiError.unauthorized('The current password is incorrect.'));

  if (email !== admin.email) {
    const taken = await Admin.exists({ email });
    if (taken) return next(ApiError.conflict('That email is already used.'));
    admin.email = email;
  }
  if (newPassword) admin.password = await bcrypt.hash(newPassword, 12);
  await admin.save();
  setSessionCookie(res, signSession(admin));
  res.json({ success: true, data: publicAdmin(admin) });
}
