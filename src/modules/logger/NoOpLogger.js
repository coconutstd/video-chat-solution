"use strict";
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
const LogLevel_1 = require("./LogLevel");
/**
 * [[NoOpLogger]] does not log any message.
 */
class NoOpLogger {
    constructor(level = LogLevel_1.default.OFF) {
        this.level = level;
    }
    info(_msg) { }
    warn(_msg) { }
    error(_msg) { }
    debug(debugFunction) {
        if (LogLevel_1.default.DEBUG < this.level) {
            return;
        }
        if (typeof debugFunction !== 'string') {
            debugFunction();
        }
    }
    setLogLevel(level) {
        this.level = level;
    }
    getLogLevel() {
        return this.level;
    }
}
exports.default = NoOpLogger;
//# sourceMappingURL=NoOpLogger.js.map