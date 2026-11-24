import mongoose from 'mongoose';
import { logger } from '../utils/logger.js';

mongoose.set('strictQuery', true);

let listenersAttached = false;

function attachConnectionListeners() {
  if (listenersAttached) return;
  listenersAttached = true;

  mongoose.connection.on('disconnected', () => logger.warn('MongoDB disconnected'));
  mongoose.connection.on('reconnected', () => logger.info('MongoDB reconnected'));
  mongoose.connection.on('error', (error) => logger.error('MongoDB error:', error.message));
}

export async function connectDatabase(uri) {
  attachConnectionListeners();
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 10_000 });

  // Log host and database name only: the URI may contain credentials.
  const { host, port, name } = mongoose.connection;
  logger.info(`MongoDB connected → ${host}${port ? `:${port}` : ''}/${name}`);
  return mongoose.connection;
}

export async function disconnectDatabase() {
  await mongoose.disconnect();
}

export function isDatabaseConnected() {
  return mongoose.connection.readyState === 1;
}
