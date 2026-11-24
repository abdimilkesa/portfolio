const LEVELS = { error: 0, warn: 1, info: 2, debug: 3 };

const configuredLevel =
  process.env.LOG_LEVEL || (process.env.NODE_ENV === 'test' ? 'silent' : 'info');

function write(level, args) {
  if (configuredLevel === 'silent') return;
  if (LEVELS[level] > (LEVELS[configuredLevel] ?? LEVELS.info)) return;

  const prefix = `[${new Date().toISOString()}] ${level.toUpperCase()}`;
  const sink = level === 'error' ? console.error : level === 'warn' ? console.warn : console.log;
  sink(prefix, ...args);
}

export const logger = Object.freeze({
  error: (...args) => write('error', args),
  warn: (...args) => write('warn', args),
  info: (...args) => write('info', args),
  debug: (...args) => write('debug', args),
});
