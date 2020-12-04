import Logger from './Logger';
import LogLevel from './LogLevel';
/**
 * ConsoleLogger writes logs with console
 *
 * ```typescript
 *   // working with the ConsoleLogger
 *   const logger = new ConsoleLogger('demo'); //default level is LogLevel.WARN
 *   logger.info('info');
 *   logger.debug('debug');
 *   logger.warn('warn');
 *   logger.error('error');
 *
 *   // setting logging levels
 *   const logger = new ConsoleLogger('demo', LogLevel.INFO)
 *   logger.debug(debugFunc()); // this will not show up
 *   logger.setLogLevel(LogLevel.DEBUG)
 *   logger.debug(debugFunc()); // this will show up
 *
 * ```
 */
export default class ConsoleLogger implements Logger {
    name: string;
    level: LogLevel;
    constructor(name: string, level?: LogLevel);
    info(msg: string): void;
    warn(msg: string): void;
    error(msg: string): void;
    debug(debugFunction: string | (() => string)): void;
    setLogLevel(level: LogLevel): void;
    getLogLevel(): LogLevel;
    private log;
}
