import Logger from './Logger';
import LogLevel from './LogLevel';
/**
 * MultiLogger writes logs to multiple other loggers
 */
export default class MultiLogger implements Logger {
    private _loggers;
    constructor(...loggers: Logger[]);
    info(msg: string): void;
    warn(msg: string): void;
    error(msg: string): void;
    debug(debugFunction: string | (() => string)): void;
    setLogLevel(level: LogLevel): void;
    getLogLevel(): LogLevel;
}
