"use strict";
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
class Log {
    constructor(sequenceNumber, message, timestampMs, logLevel) {
        this.sequenceNumber = sequenceNumber;
        this.message = message;
        this.timestampMs = timestampMs;
        this.logLevel = logLevel;
    }
}
exports.default = Log;
//# sourceMappingURL=Log.js.map