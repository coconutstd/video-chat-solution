"use strict";
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
const FullJitterBackoff_1 = require("./FullJitterBackoff");
const FullJitterLimitedBackoff_1 = require("./FullJitterLimitedBackoff");
class FullJitterBackoffFactory {
    constructor(fixedWaitMs, shortBackoffMs, longBackoffMs) {
        this.fixedWaitMs = fixedWaitMs;
        this.shortBackoffMs = shortBackoffMs;
        this.longBackoffMs = longBackoffMs;
    }
    create() {
        return new FullJitterBackoff_1.default(this.fixedWaitMs, this.shortBackoffMs, this.longBackoffMs);
    }
    createWithLimit(limit) {
        return new FullJitterLimitedBackoff_1.default(this.fixedWaitMs, this.shortBackoffMs, this.longBackoffMs, limit);
    }
}
exports.default = FullJitterBackoffFactory;
//# sourceMappingURL=FullJitterBackoffFactory.js.map