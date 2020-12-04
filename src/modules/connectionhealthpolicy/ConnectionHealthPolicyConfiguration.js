"use strict";
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
class ConnectionHealthPolicyConfiguration {
    constructor() {
        this.minHealth = 0;
        this.maxHealth = 1;
        this.initialHealth = 1;
        this.connectionUnhealthyThreshold = 25;
        this.noSignalThresholdTimeMs = 10000;
        this.connectionWaitTimeMs = 10000;
        this.zeroBarsNoSignalTimeMs = 5000;
        this.oneBarWeakSignalTimeMs = 5000;
        this.twoBarsTimeMs = 5000;
        this.threeBarsTimeMs = 10000;
        this.fourBarsTimeMs = 20000;
        this.fiveBarsTimeMs = 60000;
        this.cooldownTimeMs = 60000;
        this.pastSamplesToConsider = 15;
        this.goodSignalTimeMs = 15000;
        this.fractionalLoss = 0.5;
        this.packetsExpected = 50;
        this.maximumTimesToWarn = 2;
        this.missedPongsLowerThreshold = 1;
        this.missedPongsUpperThreshold = 4;
        this.maximumAudioDelayMs = 60000;
        this.maximumAudioDelayDataPoints = 10;
    }
}
exports.default = ConnectionHealthPolicyConfiguration;
//# sourceMappingURL=ConnectionHealthPolicyConfiguration.js.map