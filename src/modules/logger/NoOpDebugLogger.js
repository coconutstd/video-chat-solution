"use strict";
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
const LogLevel_1 = require("./LogLevel");
const NoOpLogger_1 = require("./NoOpLogger");
/**
 * [[NoOpDebugLogger]] does not log any message but does call
 * debug functions by default.
 */
class NoOpDebugLogger extends NoOpLogger_1.default {
    constructor() {
        super(LogLevel_1.default.DEBUG);
    }
}
exports.default = NoOpDebugLogger;
//# sourceMappingURL=NoOpDebugLogger.js.map