import { injectable } from 'inversify';
import Pino from 'pino';
import { PrettyOptions } from 'pino-pretty';

@injectable()
export class LoggerService {
  private readonly _logger: Pino.Logger;

  constructor() {
    this._logger = Pino({
      level: process.env.SOLUTION_ENVIRONMENT == 'development' ? 'trace' : 'info',
      transport: {
        target: 'pino-pretty',
        options: {
          ignore: 'pid,hostname',
          translateTime: 'SYS:yyyy-mm-dd HH:MM:ss',
        } as PrettyOptions,
      },
    });
  }

  trace(data: any, message?: string, ...args: any[]) {
    this._logger.trace(data, message, ...args);
  }

  debug(data: any, message?: string, ...args: any[]) {
    this._logger.debug(data, message, ...args);
  }

  info(data: any, message?: string, ...args: any[]) {
    this._logger.info(data, message, ...args);
  }

  warn(data: any, message?: string, ...args: any[]) {
    this._logger.warn(data, message, ...args);
  }

  error(data: any, message?: string, ...args: any[]) {
    this._logger.error(data, message, ...args);
  }

  fatal(data: any, message?: string, ...args: any[]) {
    this._logger.fatal(data, message, ...args);
  }
}
