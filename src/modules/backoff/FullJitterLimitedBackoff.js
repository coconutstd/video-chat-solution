"use strict";
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
const FullJitterBackoff_1 = require("./FullJitterBackoff");
class FullJitterLimitedBackoff extends FullJitterBackoff_1.default {
    constructor(fixedWaitMs, shortBackoffMs, longBackoffMs, limit) {
        super(fixedWaitMs, shortBackoffMs, longBackoffMs);
        this.limit = limit;
        this.attempts = 0;
    }
    nextBackoffAmountMs() {
        this.attempts++;
        if (this.attempts > this.limit) {
            throw new Error('retry limit exceeded');
        }
        return super.nextBackoffAmountMs();
    }
}
exports.default = FullJitterLimitedBackoff;
//# sourceMappingURL=FullJitterLimitedBackoff.js.map