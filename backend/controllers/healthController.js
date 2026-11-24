import { isDatabaseConnected } from '../config/db.js';

export function getHealth(_req, res) {
  const databaseUp = isDatabaseConnected();

  res.status(databaseUp ? 200 : 503).json({
    success: databaseUp,
    data: {
      status: databaseUp ? 'ok' : 'degraded',
      database: databaseUp ? 'connected' : 'disconnected',
      uptime: Math.round(process.uptime()),
      timestamp: new Date().toISOString(),
    },
  });
}
