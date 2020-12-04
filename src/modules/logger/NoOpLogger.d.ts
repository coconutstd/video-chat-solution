import Logger from './Logger';
import LogLevel from './LogLevel';
/**
 * [[NoOpLogger]] does not log any message.
 */
export default class NoOpLogger implements Logger {
    level: LogLevel;
    constructor(level?: LogLevel);
    info(_msg: string): void;
    warn(_msg: string): void;
    error(_msg: string): void;
    debug(debugFunction: string | (() => string)): void;
    setLogLevel(level: LogLevel): void;
    getLogLevel(): LogLevel;
}
