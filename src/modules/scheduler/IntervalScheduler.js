"use strict";
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * [[IntervalScheduler]] calls the callback every intervalMs milliseconds.
 */
class IntervalScheduler {
    constructor(intervalMs) {
        this.intervalMs = intervalMs;
        // eslint-disable-next-line
        this.timer = null;
    }
    start(callback) {
        this.stop();
        this.timer = setInterval(callback, this.intervalMs);
    }
    stop() {
        if (this.timer !== null) {
            clearInterval(this.timer);
        }
    }
}
exports.default = IntervalScheduler;
//# sourceMappingURL=IntervalScheduler.js.map