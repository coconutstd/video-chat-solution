"use strict";
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
const TimeoutScheduler_1 = require("../scheduler/TimeoutScheduler");
class DefaultReconnectController {
    constructor(reconnectTimeoutMs, backoffPolicy) {
        this.reconnectTimeoutMs = reconnectTimeoutMs;
        this.backoffPolicy = backoffPolicy;
        this.shouldReconnect = true;
        this.onlyRestartPeerConnection = false;
        this.firstConnectionAttempted = false;
        this.firstConnectionAttemptTimestampMs = 0;
        this.lastActiveTimestampMs = Infinity;
        this._isFirstConnection = true;
        this.backoffTimer = null;
        this.backoffCancel = null;
        this.reset();
    }
    timeSpentReconnectingMs() {
        if (!this.firstConnectionAttempted) {
            return 0;
        }
        return Date.now() - this.firstConnectionAttemptTimestampMs;
    }
    hasPastReconnectDeadline() {
        if (Date.now() - this.lastActiveTimestampMs >= this.reconnectTimeoutMs) {
            return true;
        }
        return this.timeSpentReconnectingMs() >= this.reconnectTimeoutMs;
    }
    reset() {
        this.cancel();
        this.shouldReconnect = true;
        this.onlyRestartPeerConnection = false;
        this.firstConnectionAttempted = false;
        this.firstConnectionAttemptTimestampMs = 0;
        this.lastActiveTimestampMs = Infinity;
        this.backoffPolicy.reset();
    }
    startedConnectionAttempt(isFirstConnection) {
        this._isFirstConnection = isFirstConnection;
        if (!this.firstConnectionAttempted) {
            this.firstConnectionAttempted = true;
            this.firstConnectionAttemptTimestampMs = Date.now();
        }
    }
    hasStartedConnectionAttempt() {
        return this.firstConnectionAttempted;
    }
    isFirstConnection() {
        return this._isFirstConnection;
    }
    disableReconnect() {
        this.shouldReconnect = false;
    }
    enableRestartPeerConnection() {
        this.onlyRestartPeerConnection = true;
    }
    cancel() {
        this.disableReconnect();
        if (this.backoffTimer) {
            this.backoffTimer.stop();
            if (this.backoffCancel) {
                this.backoffCancel();
                this.backoffCancel = null;
            }
        }
    }
    retryWithBackoff(retryFunc, cancelFunc) {
        const willRetry = this.shouldReconnect && !this.hasPastReconnectDeadline();
        if (willRetry) {
            this.backoffCancel = cancelFunc;
            this.backoffTimer = new TimeoutScheduler_1.default(this.backoffPolicy.nextBackoffAmountMs());
            this.backoffTimer.start(() => {
                this.backoffCancel = null;
                retryFunc();
            });
        }
        return willRetry;
    }
    shouldOnlyRestartPeerConnection() {
        return this.onlyRestartPeerConnection;
    }
    clone() {
        return new DefaultReconnectController(this.reconnectTimeoutMs, this.backoffPolicy);
    }
    setLastActiveTimestampMs(timestampMs) {
        this.lastActiveTimestampMs = timestampMs;
    }
}
exports.default = DefaultReconnectController;
//# sourceMappingURL=DefaultReconnectController.js.map