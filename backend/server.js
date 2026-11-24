import { assertRuntimeConfig, env } from './config/env.js';
import { connectDatabase, disconnectDatabase } from './config/db.js';
import { createApp } from './app.js';
import { logger } from './utils/logger.js';

const SHUTDOWN_TIMEOUT_MS = 10_000;

async function start() {
  assertRuntimeConfig();

  try {
    await connectDatabase(env.mongoUri);
  } catch (error) {
    error.message = `Could not connect to MongoDB (${error.message}). Is it running? For local development you can start one with \`npm run db:local\`.`;
    throw error;
  }

  const app = createApp();
  const server = app.listen(env.port, () => {
    logger.info(`API ready on http://localhost:${env.port} (${env.nodeEnv})`);
  });

  let shuttingDown = false;
  const shutdown = (signal) => {
    if (shuttingDown) return;
    shuttingDown = true;
    logger.info(`${signal} received: closing the server...`);

    setTimeout(() => process.exit(1), SHUTDOWN_TIMEOUT_MS).unref();
    server.close(async () => {
      await disconnectDatabase().catch(() => {});
      process.exit(0);
    });
  };

  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
}

process.on('unhandledRejection', (reason) => {
  logger.error('Unhandled promise rejection:', reason);
});

start().catch((error) => {
  logger.error(error.code === 'INVALID_CONFIG' ? error.message : error.message || error);
  process.exit(1);
});
