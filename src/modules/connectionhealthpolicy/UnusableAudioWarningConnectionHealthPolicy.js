"use strict";
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
const BaseConnectionHealthPolicy_1 = require("./BaseConnectionHealthPolicy");
class UnusableAudioWarningConnectionHealthPolicy extends BaseConnectionHealthPolicy_1.default {
    constructor(configuration, data) {
        super(configuration, data);
        this.coolDownTimeMs = configuration.cooldownTimeMs;
        this.pastSamplesToConsider = configuration.pastSamplesToConsider;
        this.fractionalLoss = configuration.fractionalLoss;
        this.packetsExpected = configuration.packetsExpected;
        this.maximumTimesToWarn = configuration.maximumTimesToWarn;
        this.lastWarnTimestampMs = 0;
        this.warnCount = 0;
    }
    calculateFractionalLoss() {
        if (this.currentData.packetsReceivedInLastMinute.length < this.pastSamplesToConsider) {
            return 0;
        }
        const samplesToConsider = this.pastSamplesToConsider;
        const totalPacketsExpected = samplesToConsider * this.packetsExpected;
        let totalPacketsReceived = 0;
        for (let i = 0; i < samplesToConsider; i++) {
            totalPacketsReceived += this.currentData.packetsReceivedInLastMinute[i];
        }
        return Math.min(Math.max(1 - totalPacketsReceived / totalPacketsExpected, 0), 1);
    }
    health() {
        const warnedRecently = Date.now() - this.lastWarnTimestampMs < this.coolDownTimeMs;
        if (warnedRecently) {
            return this.currentHealth;
        }
        const hasHadHighPacketLoss = this.calculateFractionalLoss() >= this.fractionalLoss;
        if (hasHadHighPacketLoss) {
            if (this.currentHealth !== 0) {
                this.lastWarnTimestampMs = Date.now();
                this.warnCount++;
                if (this.warnCount > this.maximumTimesToWarn) {
                    return 1;
                }
            }
            return 0;
        }
        return 1;
    }
}
exports.default = UnusableAudioWarningConnectionHealthPolicy;
//# sourceMappingURL=UnusableAudioWarningConnectionHealthPolicy.js.map