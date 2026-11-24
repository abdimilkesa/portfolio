/**
 * Runs a real MongoDB server locally without installing MongoDB system-wide.
 * The binary is downloaded once by mongodb-memory-server, and data is kept
 * in `<repo>/.mongo-data` so it survives restarts.
 *
 *   npm run db:local
 */
import fs from 'node:fs';
import path from 'node:path';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { paths } from '../config/env.js';

const port = Number(process.env.LOCAL_DB_PORT) || 27017;
const dbPath = path.join(paths.root, '.mongo-data');
fs.mkdirSync(dbPath, { recursive: true });

console.log('Starting local MongoDB (the first run downloads the MongoDB binary and may take a few minutes)...');

let server;
try {
  server = await MongoMemoryServer.create({
    instance: { port, ip: '127.0.0.1', dbPath, storageEngine: 'wiredTiger' },
  });
} catch (error) {
  console.error(`\nCould not start MongoDB on port ${port}: ${error.message}`);
  console.error('If another MongoDB is already running there, set LOCAL_DB_PORT to a free port.');
  process.exit(1);
}

console.log(`
  Local MongoDB is running at mongodb://127.0.0.1:${port}
  Data directory: ${dbPath}

  Put this in your .env:
    MONGODB_URI=mongodb://127.0.0.1:${port}/portfolio

  Press Ctrl+C to stop.
`);

let stopping = false;
async function stop() {
  if (stopping) return;
  stopping = true;
  await server.stop({ doCleanup: false }).catch(() => {});
  process.exit(0);
}

process.on('SIGINT', stop);
process.on('SIGTERM', stop);
