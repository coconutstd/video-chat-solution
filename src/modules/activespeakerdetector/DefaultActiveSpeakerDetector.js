"use strict";
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
const IntervalScheduler_1 = require("../scheduler/IntervalScheduler");
class DefaultActiveSpeakerDetector {
    constructor(realtimeController, selfAttendeeId, hasBandwidthPriorityCallback, waitIntervalMs = 1000, updateIntervalMs = 200) {
        this.realtimeController = realtimeController;
        this.selfAttendeeId = selfAttendeeId;
        this.hasBandwidthPriorityCallback = hasBandwidthPriorityCallback;
        this.waitIntervalMs = waitIntervalMs;
        this.updateIntervalMs = updateIntervalMs;
        this.speakerScores = {};
        this.speakerMuteState = {};
        this.detectorCallbackToHandler = new Map();
        this.detectorCallbackToScoresTimer = new Map();
        this.detectorCallbackToActivityTimer = new Map();
        this.hasBandwidthPriority = false;
        this.mostRecentUpdateTimestamp = {};
    }
    needUpdate(attendeeId) {
        if (!this.activeSpeakers) {
            return true;
        }
        return ((this.speakerScores[attendeeId] === 0 && this.activeSpeakers.includes(attendeeId)) ||
            (this.speakerScores[attendeeId] > 0 && !this.activeSpeakers.includes(attendeeId)));
    }
    updateActiveSpeakers(policy, callback, attendeeId) {
        if (!this.needUpdate(attendeeId)) {
            return;
        }
        const sortedSpeakers = [];
        const attendeeIds = Object.keys(this.speakerScores);
        for (let i = 0; i < attendeeIds.length; i++) {
            const attendeeId = attendeeIds[i];
            sortedSpeakers.push({ attendeeId: attendeeId, activeScore: this.speakerScores[attendeeId] });
        }
        const sortedAttendeeIds = sortedSpeakers
            .sort((s1, s2) => s2.activeScore - s1.activeScore)
            .filter(function (s) {
            return s.activeScore > 0;
        })
            .map(function (s) {
            return s.attendeeId;
        });
        this.activeSpeakers = sortedAttendeeIds;
        callback(sortedAttendeeIds);
        const selfIsActive = sortedAttendeeIds.length > 0 && sortedAttendeeIds[0] === this.selfAttendeeId;
        const hasBandwidthPriority = selfIsActive && policy.prioritizeVideoSendBandwidthForActiveSpeaker();
        const hasBandwidthPriorityDidChange = this.hasBandwidthPriority !== hasBandwidthPriority;
        if (hasBandwidthPriorityDidChange) {
            this.hasBandwidthPriority = hasBandwidthPriority;
            this.hasBandwidthPriorityCallback(hasBandwidthPriority);
        }
    }
    updateScore(policy, callback, attendeeId, volume, muted) {
        const activeScore = policy.calculateScore(attendeeId, volume, muted);
        if (this.speakerScores[attendeeId] !== activeScore) {
            this.speakerScores[attendeeId] = activeScore;
            this.mostRecentUpdateTimestamp[attendeeId] = Date.now();
            this.updateActiveSpeakers(policy, callback, attendeeId);
        }
    }
    subscribe(policy, callback, scoresCallback, scoresCallbackIntervalMs) {
        const handler = (attendeeId, present) => {
            if (!present) {
                this.speakerScores[attendeeId] = 0;
                this.mostRecentUpdateTimestamp[attendeeId] = Date.now();
                this.updateActiveSpeakers(policy, callback, attendeeId);
                return;
            }
            this.realtimeController.realtimeSubscribeToVolumeIndicator(attendeeId, (attendeeId, volume, muted, _signalStrength) => {
                this.mostRecentUpdateTimestamp[attendeeId] = Date.now();
                if (muted !== null) {
                    this.speakerMuteState[attendeeId] = muted;
                }
                this.updateScore(policy, callback, attendeeId, volume, muted);
            });
        };
        this.detectorCallbackToHandler.set(callback, handler);
        const activityTimer = new IntervalScheduler_1.default(this.updateIntervalMs);
        activityTimer.start(() => {
            for (const attendeeId in this.speakerScores) {
                if (Date.now() - this.mostRecentUpdateTimestamp[attendeeId] > this.waitIntervalMs) {
                    this.updateScore(policy, callback, attendeeId, 0, this.speakerMuteState[attendeeId]);
                }
            }
        });
        this.detectorCallbackToActivityTimer.set(callback, activityTimer);
        if (scoresCallback && scoresCallbackIntervalMs) {
            const scoresTimer = new IntervalScheduler_1.default(scoresCallbackIntervalMs);
            scoresTimer.start(() => {
                scoresCallback(this.speakerScores);
            });
            this.detectorCallbackToScoresTimer.set(callback, scoresTimer);
        }
        this.realtimeController.realtimeSubscribeToAttendeeIdPresence(handler);
    }
    unsubscribe(callback) {
        const handler = this.detectorCallbackToHandler.get(callback);
        this.detectorCallbackToHandler.delete(callback);
        if (handler) {
            this.realtimeController.realtimeUnsubscribeToAttendeeIdPresence(handler);
        }
        const activityTimer = this.detectorCallbackToActivityTimer.get(callback);
        if (activityTimer) {
            activityTimer.stop();
            this.detectorCallbackToActivityTimer.delete(callback);
        }
        const scoresTimer = this.detectorCallbackToScoresTimer.get(callback);
        if (scoresTimer) {
            scoresTimer.stop();
            this.detectorCallbackToHandler.delete(callback);
        }
    }
}
exports.default = DefaultActiveSpeakerDetector;
//# sourceMappingURL=DefaultActiveSpeakerDetector.js.map