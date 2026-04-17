export type LogLevel = 'DEBUG' | 'INFO' | 'WARN' | 'ERROR';

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  module: string;
  event: string;
  input?: any;
  output?: any;
  error?: string;
  correlation_id?: string;
}

class StructuredLogger {
  private baseModule: string;

  constructor(module: string) {
    this.baseModule = module;
  }

  private dispatch(level: LogLevel, event: string, params: Omit<Partial<LogEntry>, 'timestamp' | 'level' | 'module' | 'event'>) {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      module: this.baseModule,
      event,
      ...params,
    };

    const payload = JSON.stringify(entry);

    switch (level) {
      case 'DEBUG':
        console.debug(payload);
        break;
      case 'INFO':
        console.info(payload);
        break;
      case 'WARN':
        console.warn(payload);
        break;
      case 'ERROR':
        console.error(payload);
        break;
    }
  }

  debug(event: string, params?: Omit<Partial<LogEntry>, 'timestamp' | 'level' | 'module' | 'event'>) {
    this.dispatch('DEBUG', event, params || {});
  }

  info(event: string, params?: Omit<Partial<LogEntry>, 'timestamp' | 'level' | 'module' | 'event'>) {
    this.dispatch('INFO', event, params || {});
  }

  warn(event: string, params?: Omit<Partial<LogEntry>, 'timestamp' | 'level' | 'module' | 'event'>) {
    this.dispatch('WARN', event, params || {});
  }

  error(event: string, params?: Omit<Partial<LogEntry>, 'timestamp' | 'level' | 'module' | 'event'>) {
    this.dispatch('ERROR', event, params || {});
  }
}

export const createLogger = (module: string) => new StructuredLogger(module);
