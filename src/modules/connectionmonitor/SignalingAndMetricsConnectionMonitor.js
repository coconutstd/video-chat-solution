"use strict";
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
const Maybe_1 = require("../maybe/Maybe");
class SignalingAndMetricsConnectionMonitor {
    constructor(audioVideoController, realtimeController, videoTileController, connectionHealthData, pingPong, statsCollector) {
        this.audioVideoController = audioVideoController;
        this.realtimeController = realtimeController;
        this.videoTileController = videoTileController;
        this.connectionHealthData = connectionHealthData;
        this.pingPong = pingPong;
        this.statsCollector = statsCollector;
        this.isActive = false;
        this.hasSeenValidPacketMetricsBefore = false;
        this.lastAvailableSendBandwidthKbps = 0;
        this.lastAvailableRecvBandwidthKbps = 0;
        this.realtimeController.realtimeSubscribeToLocalSignalStrengthChange((signalStrength) => {
            if (this.isActive) {
                this.receiveSignalStrengthChange(signalStrength);
            }
        });
    }
    start() {
        this.isActive = true;
        this.pingPong.addObserver(this);
        this.pingPong.start();
        this.audioVideoController.addObserver(this);
    }
    stop() {
        this.isActive = false;
        this.pingPong.removeObserver(this);
        this.pingPong.stop();
        this.audioVideoController.removeObserver(this);
    }
    receiveSignalStrengthChange(signalStrength) {
        if (signalStrength === 0) {
            this.connectionHealthData.setLastNoSignalTimestampMs(Date.now());
        }
        else if (signalStrength <= 0.5) {
            this.connectionHealthData.setLastWeakSignalTimestampMs(Date.now());
        }
        else {
            this.connectionHealthData.setLastGoodSignalTimestampMs(Date.now());
        }
        this.updateConnectionHealth();
    }
    didReceivePong(_id, latencyMs, clockSkewMs) {
        this.connectionHealthData.setConsecutiveMissedPongs(0);
        this.statsCollector.logLatency('ping_pong', latencyMs);
        this.statsCollector.logLatency('ping_pong_clock_skew', clockSkewMs);
        this.updateConnectionHealth();
    }
    didMissPongs() {
        this.connectionHealthData.setConsecutiveMissedPongs(this.connectionHealthData.consecutiveMissedPongs + 1);
        this.updateConnectionHealth();
    }
    metricsDidReceive(clientMetricReport) {
        let packetsReceived = 0;
        let fractionPacketsLostInbound = 0;
        const metricReport = clientMetricReport.getObservableMetrics();
        const potentialPacketsReceived = metricReport.audioPacketsReceived;
        const potentialFractionPacketsLostInbound = metricReport.audioPacketsReceivedFractionLoss;
        let videoUpstreamBitrateKbps = 0;
        const videoUpstreamPacketPerSecond = metricReport.videoPacketSentPerSecond;
        const videoUpstreamBitrate = metricReport.videoUpstreamBitrate;
        const availableSendBandwidth = metricReport.availableSendBandwidth || metricReport.availableOutgoingBitrate;
        const availableRecvBandwidth = metricReport.availableReceiveBandwidth || metricReport.availableIncomingBitrate;
        const audioSpeakerDelayMs = metricReport.audioSpeakerDelayMs;
        const nackCountPerSecond = metricReport.nackCountReceivedPerSecond || metricReport.googNackCountReceivedPerSecond;
        // Firefox does not presently have aggregated bandwidth estimation
        if (typeof availableSendBandwidth === 'number' && !isNaN(availableSendBandwidth)) {
            this.updateAvailableSendBandwidth(availableSendBandwidth / 1000, nackCountPerSecond);
        }
        if (typeof availableRecvBandwidth === 'number' && !isNaN(availableRecvBandwidth)) {
            this.updateAvailableReceiveBandwidth(availableRecvBandwidth / 1000);
        }
        if (typeof videoUpstreamBitrate === 'number' && !isNaN(videoUpstreamBitrate)) {
            videoUpstreamBitrateKbps = videoUpstreamBitrate / 1000;
        }
        if (typeof audioSpeakerDelayMs === 'number' && !isNaN(audioSpeakerDelayMs)) {
            this.connectionHealthData.setAudioSpeakerDelayMs(audioSpeakerDelayMs);
        }
        this.monitorVideoUplinkHealth(videoUpstreamBitrateKbps, videoUpstreamPacketPerSecond);
        if (typeof potentialPacketsReceived === 'number' &&
            typeof potentialFractionPacketsLostInbound === 'number') {
            packetsReceived = potentialPacketsReceived;
            fractionPacketsLostInbound = potentialFractionPacketsLostInbound;
            if (packetsReceived < 0 || fractionPacketsLostInbound < 0) {
                // TODO: getting negative numbers on this metric after reconnect sometimes
                // For now, just skip the metric if it looks weird.
                return;
            }
        }
        else {
            return;
        }
        this.addToMinuteWindow(this.connectionHealthData.packetsReceivedInLastMinute, packetsReceived);
        this.addToMinuteWindow(this.connectionHealthData.fractionPacketsLostInboundInLastMinute, fractionPacketsLostInbound);
        if (packetsReceived > 0) {
            this.hasSeenValidPacketMetricsBefore = true;
            this.connectionHealthData.setConsecutiveStatsWithNoPackets(0);
        }
        else if (this.hasSeenValidPacketMetricsBefore) {
            this.connectionHealthData.setConsecutiveStatsWithNoPackets(this.connectionHealthData.consecutiveStatsWithNoPackets + 1);
        }
        if (packetsReceived === 0 || fractionPacketsLostInbound > 0) {
            this.connectionHealthData.setLastPacketLossInboundTimestampMs(Date.now());
        }
        this.updateConnectionHealth();
    }
    addToMinuteWindow(array, value) {
        array.unshift(value);
        if (array.length > 60) {
            array.pop();
        }
    }
    updateAvailableSendBandwidth(sendBandwidthKbps, nackCountPerSecond) {
        if (sendBandwidthKbps !== this.lastAvailableSendBandwidthKbps) {
            if (this.lastAvailableSendBandwidthKbps === 0) {
                this.lastAvailableSendBandwidthKbps = sendBandwidthKbps;
                return;
            }
            const prevSendBandwidthKbps = this.lastAvailableSendBandwidthKbps;
            this.lastAvailableSendBandwidthKbps = sendBandwidthKbps;
            this.audioVideoController.forEachObserver((observer) => {
                Maybe_1.default.of(observer.videoSendBandwidthDidChange).map(f => f.bind(observer)(sendBandwidthKbps, prevSendBandwidthKbps, nackCountPerSecond));
            });
        }
    }
    updateAvailableReceiveBandwidth(recvBandwidthKbps) {
        if (recvBandwidthKbps !== this.lastAvailableRecvBandwidthKbps) {
            if (this.lastAvailableRecvBandwidthKbps === 0) {
                this.lastAvailableRecvBandwidthKbps = recvBandwidthKbps;
                return;
            }
            const prevRecvBandwidthKbps = this.lastAvailableRecvBandwidthKbps;
            this.lastAvailableRecvBandwidthKbps = recvBandwidthKbps;
            this.audioVideoController.forEachObserver((observer) => {
                Maybe_1.default.of(observer.videoReceiveBandwidthDidChange).map(f => f.bind(observer)(recvBandwidthKbps, prevRecvBandwidthKbps));
            });
        }
    }
    updateConnectionHealth() {
        this.audioVideoController.forEachObserver((observer) => {
            Maybe_1.default.of(observer.connectionHealthDidChange).map(f => f.bind(observer)(this.connectionHealthData.clone()));
        });
    }
    monitorVideoUplinkHealth(videoUpstreamBitrateKbps, videoUpstreamPacketsPerSecond) {
        if (!this.videoTileController.hasStartedLocalVideoTile()) {
            return;
        }
        this.audioVideoController.forEachObserver((observer) => {
            Maybe_1.default.of(observer.videoSendHealthDidChange).map(f => f.bind(observer)(videoUpstreamBitrateKbps, videoUpstreamPacketsPerSecond));
        });
    }
}
exports.default = SignalingAndMetricsConnectionMonitor;
//# sourceMappingURL=SignalingAndMetricsConnectionMonitor.js.map