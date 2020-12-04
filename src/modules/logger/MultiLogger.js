"use strict";
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
const LogLevel_1 = require("./LogLevel");
/**
 * MultiLogger writes logs to multiple other loggers
 */
class MultiLogger {
    constructor(...loggers) {
        this._loggers = loggers;
    }
    info(msg) {
        for (const logger of this._loggers) {
            logger.info(msg);
        }
    }
    warn(msg) {
        for (const logger of this._loggers) {
            logger.warn(msg);
        }
    }
    error(msg) {
        for (const logger of this._loggers) {
            logger.error(msg);
        }
    }
    debug(debugFunction) {
        let message;
        const memoized = typeof debugFunction === 'string'
            ? debugFunction
            : () => {
                if (!message) {
                    message = debugFunction();
                }
                return message;
            };
        for (const logger of this._loggers) {
            logger.debug(memoized);
        }
    }
    setLogLevel(level) {
        for (const logger of this._loggers) {
            logger.setLogLevel(level);
        }
    }
    getLogLevel() {
        for (const logger of this._loggers) {
            return logger.getLogLevel();
        }
        return LogLevel_1.default.OFF;
    }
}
exports.default = MultiLogger;
//# sourceMappingURL=MultiLogger.js.map