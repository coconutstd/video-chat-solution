"use strict";
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
class ConnectionHealthData {
    constructor() {
        this.connectionStartTimestampMs = 0;
        this.consecutiveStatsWithNoPackets = 0;
        this.lastPacketLossInboundTimestampMs = 0;
        this.lastGoodSignalTimestampMs = 0;
        this.lastWeakSignalTimestampMs = 0;
        this.lastNoSignalTimestampMs = 0;
        this.consecutiveMissedPongs = 0;
        this.packetsReceivedInLastMinute = [];
        this.fractionPacketsLostInboundInLastMinute = [];
        this.audioSpeakerDelayMs = 0;
        this.connectionStartTimestampMs = Date.now();
        this.lastGoodSignalTimestampMs = Date.now();
    }
    static isTimestampRecent(timestampMs, recentDurationMs) {
        return Date.now() < timestampMs + recentDurationMs;
    }
    setConnectionStartTime() {
        this.connectionStartTimestampMs = Date.now();
        this.lastGoodSignalTimestampMs = Date.now();
    }
    reset() {
        this.connectionStartTimestampMs = 0;
        this.consecutiveStatsWithNoPackets = 0;
        this.lastPacketLossInboundTimestampMs = 0;
        this.lastGoodSignalTimestampMs = 0;
        this.lastWeakSignalTimestampMs = 0;
        this.lastNoSignalTimestampMs = 0;
        this.consecutiveMissedPongs = 0;
        this.packetsReceivedInLastMinute = [];
        this.fractionPacketsLostInboundInLastMinute = [];
        this.audioSpeakerDelayMs = 0;
        this.connectionStartTimestampMs = Date.now();
        this.lastGoodSignalTimestampMs = Date.now();
    }
    isConnectionStartRecent(recentDurationMs) {
        return ConnectionHealthData.isTimestampRecent(this.connectionStartTimestampMs, recentDurationMs);
    }
    isLastPacketLossRecent(recentDurationMs) {
        return ConnectionHealthData.isTimestampRecent(this.lastPacketLossInboundTimestampMs, recentDurationMs);
    }
    isGoodSignalRecent(recentDurationMs) {
        return ConnectionHealthData.isTimestampRecent(this.lastGoodSignalTimestampMs, recentDurationMs);
    }
    isWeakSignalRecent(recentDurationMs) {
        return ConnectionHealthData.isTimestampRecent(this.lastWeakSignalTimestampMs, recentDurationMs);
    }
    isNoSignalRecent(recentDurationMs) {
        return ConnectionHealthData.isTimestampRecent(this.lastNoSignalTimestampMs, recentDurationMs);
    }
    clone() {
        const cloned = new ConnectionHealthData();
        cloned.connectionStartTimestampMs = this.connectionStartTimestampMs;
        cloned.consecutiveStatsWithNoPackets = this.consecutiveStatsWithNoPackets;
        cloned.lastPacketLossInboundTimestampMs = this.lastPacketLossInboundTimestampMs;
        cloned.lastGoodSignalTimestampMs = this.lastGoodSignalTimestampMs;
        cloned.lastWeakSignalTimestampMs = this.lastWeakSignalTimestampMs;
        cloned.lastNoSignalTimestampMs = this.lastNoSignalTimestampMs;
        cloned.consecutiveMissedPongs = this.consecutiveMissedPongs;
        cloned.packetsReceivedInLastMinute = this.packetsReceivedInLastMinute.slice(0);
        cloned.fractionPacketsLostInboundInLastMinute = this.fractionPacketsLostInboundInLastMinute.slice(0);
        cloned.audioSpeakerDelayMs = this.audioSpeakerDelayMs;
        return cloned;
    }
    setConsecutiveMissedPongs(pongs) {
        this.consecutiveMissedPongs = pongs;
    }
    setConsecutiveStatsWithNoPackets(stats) {
        this.consecutiveStatsWithNoPackets = stats;
    }
    setLastPacketLossInboundTimestampMs(timeStamp) {
        this.lastPacketLossInboundTimestampMs = timeStamp;
    }
    setLastNoSignalTimestampMs(timeStamp) {
        this.lastNoSignalTimestampMs = timeStamp;
    }
    setLastWeakSignalTimestampMs(timeStamp) {
        this.lastWeakSignalTimestampMs = timeStamp;
    }
    setLastGoodSignalTimestampMs(timeStamp) {
        this.lastGoodSignalTimestampMs = timeStamp;
    }
    setAudioSpeakerDelayMs(delayMs) {
        this.audioSpeakerDelayMs = delayMs;
    }
}
exports.default = ConnectionHealthData;
//# sourceMappingURL=ConnectionHealthData.js.map