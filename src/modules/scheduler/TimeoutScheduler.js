"use strict";
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * [[TimeoutScheduler]] calls the callback once after timeoutMs milliseconds.
 */
class TimeoutScheduler {
    constructor(timeoutMs) {
        this.timeoutMs = timeoutMs;
        // eslint-disable-next-line
        this.timer = null;
    }
    start(callback) {
        this.stop();
        this.timer = setTimeout(() => {
            clearTimeout(this.timer);
            callback();
        }, this.timeoutMs);
    }
    stop() {
        if (this.timer !== null) {
            clearTimeout(this.timer);
            this.timer = null;
        }
    }
}
exports.default = TimeoutScheduler;
//# sourceMappingURL=TimeoutScheduler.js.map