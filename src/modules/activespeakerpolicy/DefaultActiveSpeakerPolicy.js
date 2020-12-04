"use strict";
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
class DefaultActiveSpeakerPolicy {
    /** Creates active speaker policy with speakerWeight, cutoffThreshold, silenceThreshold, and takeoverRate.
     *
     * @param speakerWeight
     * The number used to calculate new active speaker score for current attendee
     * ```js
     * Formula:
     * updatedCurrentAttendeeScore = currentAttendeeExistingScore * speakerWeight + currentReceivedVolume * (1 - speakerWeight)
     * ```
     *
     * @param cutoffThreshold
     * The threshold number compared with updated active speaker score.
     * If the updated active speaker score is less than this threshold value,
     * the updated score is returned as 0, else the updated score is returned.
     *
     * @param silenceThreshold
     * The threshold number compared with current received volume.
     * While calculating the new active speaker score, if the current received
     * volume is less than this threshold value, the current received volume is considered as 0,
     * else 1.
     *
     * @param takeoverRate
     * The number used to calculate other attendee's active speaker score, other than the current attendee.
     * ```js
     * Formula:
     *  updatedOtherAttendeeActiveSpeakerScore = Math.max(
     *    existingOtherAttendeeActiveSpeakerScore - takeoverRate * currentReceivedVolume,
     *    0
     *  );
     * ```
     */
    constructor(speakerWeight = 0.9, cutoffThreshold = 0.01, silenceThreshold = 0.2, takeoverRate = 0.2) {
        this.speakerWeight = speakerWeight;
        this.cutoffThreshold = cutoffThreshold;
        this.silenceThreshold = silenceThreshold;
        this.takeoverRate = takeoverRate;
        /**
         * The map of attendeeIds to their active speaker score values
         */
        this.volumes = {};
    }
    calculateScore(attendeeId, volume, muted) {
        if (muted || volume === null) {
            volume = 0;
        }
        if (!this.volumes.hasOwnProperty(attendeeId)) {
            this.volumes[attendeeId] = 0;
        }
        if (volume > this.silenceThreshold) {
            volume = 1.0;
        }
        else {
            volume = 0.0;
        }
        const score = this.volumes[attendeeId] * this.speakerWeight + volume * (1 - this.speakerWeight);
        this.volumes[attendeeId] = score;
        for (const otherAttendeeId in this.volumes) {
            if (otherAttendeeId !== attendeeId) {
                this.volumes[otherAttendeeId] = Math.max(this.volumes[otherAttendeeId] - this.takeoverRate * volume, 0);
            }
        }
        if (score < this.cutoffThreshold) {
            return 0;
        }
        return score;
    }
    prioritizeVideoSendBandwidthForActiveSpeaker() {
        return true;
    }
}
exports.default = DefaultActiveSpeakerPolicy;
//# sourceMappingURL=DefaultActiveSpeakerPolicy.js.map