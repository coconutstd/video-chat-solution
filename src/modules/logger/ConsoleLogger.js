"use strict";
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
const LogLevel_1 = require("./LogLevel");
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
class ConsoleLogger {
    constructor(name, level = LogLevel_1.default.WARN) {
        this.name = name;
        this.level = level;
    }
    info(msg) {
        this.log(LogLevel_1.default.INFO, msg);
    }
    warn(msg) {
        this.log(LogLevel_1.default.WARN, msg);
    }
    error(msg) {
        this.log(LogLevel_1.default.ERROR, msg);
    }
    debug(debugFunction) {
        if (LogLevel_1.default.DEBUG < this.level) {
            return;
        }
        this.log(LogLevel_1.default.DEBUG, typeof debugFunction === 'string' ? debugFunction : debugFunction());
    }
    setLogLevel(level) {
        this.level = level;
    }
    getLogLevel() {
        return this.level;
    }
    log(type, msg) {
        if (type < this.level) {
            return;
        }
        const timestamp = new Date().toISOString();
        const logMessage = `${timestamp} [${LogLevel_1.default[type]}] ${this.name} - ${msg}`;
        switch (type) {
            case LogLevel_1.default.ERROR:
                console.error(logMessage);
                break;
            case LogLevel_1.default.WARN:
                console.warn(logMessage);
                break;
            case LogLevel_1.default.DEBUG:
                console.debug(logMessage.replace(/\\r\\n/g, '\n'));
                break;
            case LogLevel_1.default.INFO:
                console.info(logMessage);
                break;
        }
    }
}
exports.default = ConsoleLogger;
//# sourceMappingURL=ConsoleLogger.js.map