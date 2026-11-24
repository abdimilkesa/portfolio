import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

function cookieMaxAge(value) {
  const match = /^(\d+)([smhd])$/.exec(String(value || ''));
  if (!match) return 24 * 60 * 60 * 1000;
  const amount = Number(match[1]);
  const unit = { s: 1000, m: 60_000, h: 3_600_000, d: 86_400_000 }[match[2]];
  return amount * unit;
}

function cookieOptions() {
  return {
    httpOnly: true,
    secure: env.cookie.secure,
    sameSite: env.cookie.sameSite,
    path: '/',
    maxAge: cookieMaxAge(env.jwtExpiresIn),
  };
}

export function signSession(admin) {
  return jwt.sign({ sub: String(admin._id), role: admin.role }, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn,
  });
}

export function readSession(token) {
  return jwt.verify(token, env.jwtSecret);
}

export function setSessionCookie(res, token) {
  res.cookie(env.cookie.name, token, cookieOptions());
}

export function clearSessionCookie(res) {
  res.clearCookie(env.cookie.name, {
    httpOnly: true,
    secure: env.cookie.secure,
    sameSite: env.cookie.sameSite,
    path: '/',
  });
}
