"use strict";
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
const BaseConnectionHealthPolicy_1 = require("./BaseConnectionHealthPolicy");
class ReconnectionHealthPolicy extends BaseConnectionHealthPolicy_1.default {
    constructor(logger, configuration, data) {
        super(configuration, data);
        this.logger = logger;
        this.audioDelayPointsOverMaximum = 0;
        ReconnectionHealthPolicy.CONNECTION_UNHEALTHY_THRESHOLD =
            configuration.connectionUnhealthyThreshold;
        ReconnectionHealthPolicy.CONNECTION_WAIT_TIME_MS = configuration.connectionWaitTimeMs;
        ReconnectionHealthPolicy.MISSED_PONGS_THRESHOLD = configuration.missedPongsUpperThreshold;
        ReconnectionHealthPolicy.MAXIMUM_AUDIO_DELAY_MS = configuration.maximumAudioDelayMs;
        ReconnectionHealthPolicy.MAXIMUM_AUDIO_DELAY_DATA_POINTS =
            configuration.maximumAudioDelayDataPoints;
    }
    health() {
        const connectionStartedRecently = this.currentData.isConnectionStartRecent(ReconnectionHealthPolicy.CONNECTION_WAIT_TIME_MS);
        if (connectionStartedRecently) {
            return 1;
        }
        const noPacketsReceivedRecently = this.currentData.consecutiveStatsWithNoPackets >=
            ReconnectionHealthPolicy.CONNECTION_UNHEALTHY_THRESHOLD;
        const missedPongsRecently = this.currentData.consecutiveMissedPongs >= ReconnectionHealthPolicy.MISSED_PONGS_THRESHOLD;
        if (this.currentData.audioSpeakerDelayMs > ReconnectionHealthPolicy.MAXIMUM_AUDIO_DELAY_MS) {
            this.audioDelayPointsOverMaximum += 1;
        }
        else {
            this.audioDelayPointsOverMaximum = 0;
        }
        const hasBadAudioDelay = this.audioDelayPointsOverMaximum > ReconnectionHealthPolicy.MAXIMUM_AUDIO_DELAY_DATA_POINTS;
        if (hasBadAudioDelay) {
            this.audioDelayPointsOverMaximum = 0;
        }
        const needsReconnect = noPacketsReceivedRecently || missedPongsRecently || hasBadAudioDelay;
        if (needsReconnect) {
            this.logger.warn(`reconnection recommended due to: no packets received: ${noPacketsReceivedRecently}, missed pongs: ${missedPongsRecently}, bad audio delay: ${hasBadAudioDelay}`);
            return 0;
        }
        return 1;
    }
}
exports.default = ReconnectionHealthPolicy;
//# sourceMappingURL=ReconnectionHealthPolicy.js.map