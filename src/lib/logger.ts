type Level = 'debug' | 'info' | 'warn' | 'error';

function log(level: Level, message: string, meta?: Record<string, unknown>) {
  const entry = { level, message, timestamp: new Date().toISOString(), ...meta };
  if (process.env.NODE_ENV === 'production') {
    console[level === 'debug' ? 'log' : level](JSON.stringify(entry));
  } else {
    const colors: Record<Level, string> = {
      debug: '\x1b[37m',
      info: '\x1b[36m',
      warn: '\x1b[33m',
      error: '\x1b[31m',
    };
    console[level === 'debug' ? 'log' : level](
      `${colors[level]}[${level.toUpperCase()}]\x1b[0m ${message}`,
      meta ?? '',
    );
  }
}

export const logger = {
  debug: (msg: string, meta?: Record<string, unknown>) => log('debug', msg, meta),
  info: (msg: string, meta?: Record<string, unknown>) => log('info', msg, meta),
  warn: (msg: string, meta?: Record<string, unknown>) => log('warn', msg, meta),
  error: (msg: string, meta?: Record<string, unknown>) => log('error', msg, meta),
};
