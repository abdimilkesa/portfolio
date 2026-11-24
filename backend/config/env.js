import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';

const backendDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

export const paths = Object.freeze({
  backend: backendDir,
  root: path.resolve(backendDir, '..'),
  frontendDist: path.resolve(backendDir, '..', 'frontend', 'dist'),
});

// `backend/.env` wins over the shared root `.env`; real environment variables win over both.
dotenv.config({
  path: [path.join(paths.backend, '.env'), path.join(paths.root, '.env')],
  quiet: true,
});

const nodeEnv = process.env.NODE_ENV || 'development';
const isProduction = nodeEnv === 'production';
const isTest = nodeEnv === 'test';

const toList = (value) =>
  String(value || '')
    .split(',')
    .map((item) => item.trim().replace(/\/+$/, ''))
    .filter(Boolean);

const toPositiveNumber = (value, fallback) => {
  const number = Number(value);
  return Number.isFinite(number) && number > 0 ? number : fallback;
};

const toBoolean = (value, fallback) => {
  if (value === undefined || value === '') return fallback;
  return ['1', 'true', 'yes', 'on'].includes(String(value).toLowerCase());
};

function parseTrustProxy(value) {
  if (value === undefined || value === '') return isProduction ? 1 : false;
  if (value === 'true') return true;
  if (value === 'false') return false;
  const hops = Number(value);
  return Number.isInteger(hops) ? hops : value;
}

const clientUrls = toList(process.env.CLIENT_URL);
if (clientUrls.length === 0) clientUrls.push('http://localhost:5173');

const sameSite = String(process.env.COOKIE_SAME_SITE || 'lax').toLowerCase();
const cookieSameSite = ['lax', 'strict', 'none'].includes(sameSite) ? sameSite : 'lax';

export const env = Object.freeze({
  nodeEnv,
  isProduction,
  isTest,
  port: toPositiveNumber(process.env.PORT, 5000),
  mongoUri: process.env.MONGODB_URI || '',
  jwtSecret: process.env.JWT_SECRET || '',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1d',
  cookie: Object.freeze({
    name: 'am_session',
    sameSite: cookieSameSite,
    secure: toBoolean(process.env.COOKIE_SECURE, isProduction || cookieSameSite === 'none'),
  }),
  clientUrls: Object.freeze(clientUrls),
  siteUrl: (process.env.SITE_URL || clientUrls[0]).replace(/\/+$/, ''),
  trustProxy: parseTrustProxy(process.env.TRUST_PROXY),
  serveFrontend: toBoolean(process.env.SERVE_FRONTEND, false),
  uploads: Object.freeze({
    maxImageBytes: toPositiveNumber(process.env.MAX_IMAGE_SIZE_MB, 5) * 1024 * 1024,
    maxDocumentBytes: toPositiveNumber(process.env.MAX_DOCUMENT_SIZE_MB, 10) * 1024 * 1024,
  }),
  smtp: Object.freeze({
    host: process.env.SMTP_HOST || '',
    port: toPositiveNumber(process.env.SMTP_PORT, 587),
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
    from: process.env.SMTP_FROM || '',
    notifyTo: process.env.CONTACT_NOTIFY_EMAIL || '',
  }),
});

const PLACEHOLDER_SECRET = /replace-with|change-me|your-secret/i;

/**
 * Fails fast with a readable message when the server or a script is started
 * without the configuration it needs.
 */
export function assertRuntimeConfig({ requireDatabase = true } = {}) {
  const problems = [];

  if (requireDatabase && !env.mongoUri) {
    problems.push('MONGODB_URI is required (e.g. mongodb://127.0.0.1:27017/portfolio).');
  }
  if (env.jwtSecret.length < 32) {
    problems.push('JWT_SECRET must be at least 32 characters. Run `npm run setup:env` to generate one.');
  } else if (isProduction && PLACEHOLDER_SECRET.test(env.jwtSecret)) {
    problems.push('JWT_SECRET still contains the placeholder value from .env.example.');
  }
  if (env.cookie.sameSite === 'none' && !env.cookie.secure) {
    problems.push('COOKIE_SAME_SITE=none requires COOKIE_SECURE=true (HTTPS only).');
  }

  if (problems.length > 0) {
    const error = new Error(`Invalid configuration:\n  - ${problems.join('\n  - ')}`);
    error.code = 'INVALID_CONFIG';
    throw error;
  }
}
