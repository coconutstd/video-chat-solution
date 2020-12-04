"use strict";
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
const TimeoutScheduler_1 = require("./TimeoutScheduler");
/**
 * [[AsyncScheduler]] enqueues the callback for the soonest available run of the
 * event loop.
 */
class AsyncScheduler extends TimeoutScheduler_1.default {
    constructor() {
        super(0);
    }
}
exports.default = AsyncScheduler;
//# sourceMappingURL=AsyncScheduler.js.map