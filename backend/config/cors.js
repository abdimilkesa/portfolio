import { env } from './env.js';

export function isAllowedOrigin(origin) {
  return env.clientUrls.includes(origin);
}

export const corsOptions = {
  origin(origin, callback) {
    // Same-origin requests and server-to-server calls carry no Origin header.
    // Unknown origins get no CORS headers, so the browser blocks the response.
    callback(null, !origin || isAllowedOrigin(origin));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'X-Requested-With'],
  maxAge: 600,
};
