"use strict";
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
const SignalingProtocol_js_1 = require("../signalingprotocol/SignalingProtocol.js");
const ClientMetricReportDirection_1 = require("./ClientMetricReportDirection");
const ClientMetricReportMediaType_1 = require("./ClientMetricReportMediaType");
const GlobalMetricReport_1 = require("./GlobalMetricReport");
class DefaultClientMetricReport {
    constructor(logger) {
        this.logger = logger;
        this.globalMetricReport = new GlobalMetricReport_1.default();
        this.streamMetricReports = {};
        this.currentTimestampMs = 0;
        this.previousTimestampMs = 0;
        this.currentSsrcs = {};
        /**
         *  Metric transform functions
         */
        this.identityValue = (metricName, ssrc) => {
            const metricReport = ssrc ? this.streamMetricReports[ssrc] : this.globalMetricReport;
            return Number(metricReport.currentMetrics[metricName]);
        };
        this.decoderLossPercent = (metricName, ssrc) => {
            const metricReport = ssrc ? this.streamMetricReports[ssrc] : this.globalMetricReport;
            const decoderNormal = metricReport.currentMetrics['googDecodingNormal'] -
                (metricReport.previousMetrics['googDecodingNormal'] || 0);
            const decoderCalls = metricReport.currentMetrics['googDecodingCTN'] -
                (metricReport.previousMetrics['googDecodingCTN'] || 0);
            if (decoderCalls <= 0) {
                return 0;
            }
            const decoderAbnormal = decoderCalls - decoderNormal;
            if (decoderAbnormal <= 0) {
                return 0;
            }
            return (decoderAbnormal * 100) / decoderCalls;
        };
        this.packetLossPercent = (sourceMetricName, ssrc) => {
            const metricReport = ssrc ? this.streamMetricReports[ssrc] : this.globalMetricReport;
            const sentOrReceived = metricReport.currentMetrics[sourceMetricName] -
                (metricReport.previousMetrics[sourceMetricName] || 0);
            const lost = metricReport.currentMetrics['packetsLost'] -
                (metricReport.previousMetrics['packetsLost'] || 0);
            const total = sentOrReceived + lost;
            if (total <= 0 || lost <= 0) {
                return 0;
            }
            return (lost * 100) / total;
        };
        this.countPerSecond = (metricName, ssrc) => {
            const metricReport = ssrc ? this.streamMetricReports[ssrc] : this.globalMetricReport;
            let intervalSeconds = (this.currentTimestampMs - this.previousTimestampMs) / 1000;
            if (intervalSeconds <= 0) {
                return 0;
            }
            if (this.previousTimestampMs <= 0) {
                intervalSeconds = 1;
            }
            const diff = metricReport.currentMetrics[metricName] - (metricReport.previousMetrics[metricName] || 0);
            if (diff <= 0) {
                return 0;
            }
            return Math.trunc(diff / intervalSeconds);
        };
        this.bitsPerSecond = (metricName, ssrc) => {
            const metricReport = ssrc ? this.streamMetricReports[ssrc] : this.globalMetricReport;
            let intervalSeconds = (this.currentTimestampMs - this.previousTimestampMs) / 1000;
            if (intervalSeconds <= 0) {
                return 0;
            }
            if (this.previousTimestampMs <= 0) {
                intervalSeconds = 1;
            }
            const diff = (metricReport.currentMetrics[metricName] - (metricReport.previousMetrics[metricName] || 0)) *
                8;
            if (diff <= 0) {
                return 0;
            }
            return Math.trunc(diff / intervalSeconds);
        };
        this.secondsToMilliseconds = (metricName, ssrc) => {
            const metricReport = ssrc ? this.streamMetricReports[ssrc] : this.globalMetricReport;
            return Number(metricReport.currentMetrics[metricName] * 1000);
        };
        /**
         *  Canonical and derived metric maps
         */
        this.globalMetricMap = {
            googActualEncBitrate: {
                transform: this.identityValue,
                type: SignalingProtocol_js_1.SdkMetric.Type.VIDEO_ACTUAL_ENCODER_BITRATE,
            },
            googAvailableSendBandwidth: {
                transform: this.identityValue,
                type: SignalingProtocol_js_1.SdkMetric.Type.VIDEO_AVAILABLE_SEND_BANDWIDTH,
            },
            googRetransmitBitrate: {
                transform: this.identityValue,
                type: SignalingProtocol_js_1.SdkMetric.Type.VIDEO_RETRANSMIT_BITRATE,
            },
            googAvailableReceiveBandwidth: {
                transform: this.identityValue,
                type: SignalingProtocol_js_1.SdkMetric.Type.VIDEO_AVAILABLE_RECEIVE_BANDWIDTH,
            },
            googTargetEncBitrate: {
                transform: this.identityValue,
                type: SignalingProtocol_js_1.SdkMetric.Type.VIDEO_TARGET_ENCODER_BITRATE,
            },
            googBucketDelay: { transform: this.identityValue, type: SignalingProtocol_js_1.SdkMetric.Type.VIDEO_BUCKET_DELAY_MS },
            googRtt: { transform: this.identityValue, type: SignalingProtocol_js_1.SdkMetric.Type.STUN_RTT_MS },
            packetsDiscardedOnSend: {
                transform: this.countPerSecond,
                type: SignalingProtocol_js_1.SdkMetric.Type.SOCKET_DISCARDED_PPS,
            },
            availableIncomingBitrate: {
                transform: this.identityValue,
                type: SignalingProtocol_js_1.SdkMetric.Type.VIDEO_AVAILABLE_RECEIVE_BANDWIDTH,
            },
            availableOutgoingBitrate: {
                transform: this.identityValue,
                type: SignalingProtocol_js_1.SdkMetric.Type.VIDEO_AVAILABLE_SEND_BANDWIDTH,
            },
            currentRoundTripTime: { transform: this.identityValue, type: SignalingProtocol_js_1.SdkMetric.Type.STUN_RTT_MS },
        };
        this.audioUpstreamMetricMap = {
            googJitterReceived: { transform: this.identityValue, type: SignalingProtocol_js_1.SdkMetric.Type.RTC_MIC_JITTER_MS },
            jitter: { transform: this.secondsToMilliseconds, type: SignalingProtocol_js_1.SdkMetric.Type.RTC_MIC_JITTER_MS },
            packetsSent: { transform: this.countPerSecond, type: SignalingProtocol_js_1.SdkMetric.Type.RTC_MIC_PPS },
            bytesSent: { transform: this.bitsPerSecond, type: SignalingProtocol_js_1.SdkMetric.Type.RTC_MIC_BITRATE },
            googRtt: { transform: this.identityValue, type: SignalingProtocol_js_1.SdkMetric.Type.RTC_MIC_RTT_MS },
            packetsLost: {
                transform: this.packetLossPercent,
                type: SignalingProtocol_js_1.SdkMetric.Type.RTC_MIC_FRACTION_PACKET_LOST_PERCENT,
                source: 'packetsSent',
            },
        };
        this.audioDownstreamMetricMap = {
            packetsReceived: { transform: this.countPerSecond, type: SignalingProtocol_js_1.SdkMetric.Type.RTC_SPK_PPS },
            packetsLost: {
                transform: this.packetLossPercent,
                type: SignalingProtocol_js_1.SdkMetric.Type.RTC_SPK_FRACTION_PACKET_LOST_PERCENT,
                source: 'packetsReceived',
            },
            googJitterReceived: { transform: this.identityValue, type: SignalingProtocol_js_1.SdkMetric.Type.RTC_SPK_JITTER_MS },
            jitter: { transform: this.secondsToMilliseconds, type: SignalingProtocol_js_1.SdkMetric.Type.RTC_SPK_JITTER_MS },
            googDecodingCTN: { transform: this.countPerSecond },
            googDecodingNormal: {
                transform: this.decoderLossPercent,
                type: SignalingProtocol_js_1.SdkMetric.Type.RTC_SPK_FRACTION_DECODER_LOSS_PERCENT,
                source: 'googDecodingCTN',
            },
            bytesReceived: { transform: this.bitsPerSecond, type: SignalingProtocol_js_1.SdkMetric.Type.RTC_SPK_BITRATE },
            googCurrentDelayMs: {
                transform: this.identityValue,
                type: SignalingProtocol_js_1.SdkMetric.Type.RTC_SPK_CURRENT_DELAY_MS,
            },
            googJitterBufferMs: {
                transform: this.identityValue,
                type: SignalingProtocol_js_1.SdkMetric.Type.RTC_SPK_JITTER_BUFFER_MS,
            },
        };
        this.videoUpstreamMetricMap = {
            googRtt: { transform: this.identityValue, type: SignalingProtocol_js_1.SdkMetric.Type.VIDEO_SENT_RTT_MS },
            googEncodeUsagePercent: {
                transform: this.identityValue,
                type: SignalingProtocol_js_1.SdkMetric.Type.VIDEO_ENCODE_USAGE_PERCENT,
            },
            googNacksReceived: {
                transform: this.countPerSecond,
                type: SignalingProtocol_js_1.SdkMetric.Type.VIDEO_NACKS_RECEIVED,
            },
            nackCount: { transform: this.countPerSecond, type: SignalingProtocol_js_1.SdkMetric.Type.VIDEO_NACKS_RECEIVED },
            googPlisReceived: { transform: this.countPerSecond, type: SignalingProtocol_js_1.SdkMetric.Type.VIDEO_PLIS_RECEIVED },
            pliCount: { transform: this.countPerSecond, type: SignalingProtocol_js_1.SdkMetric.Type.VIDEO_PLIS_RECEIVED },
            googFirsReceived: { transform: this.countPerSecond, type: SignalingProtocol_js_1.SdkMetric.Type.VIDEO_FIRS_RECEIVED },
            firCount: { transform: this.countPerSecond, type: SignalingProtocol_js_1.SdkMetric.Type.VIDEO_FIRS_RECEIVED },
            googAvgEncodeMs: {
                transform: this.identityValue,
                type: SignalingProtocol_js_1.SdkMetric.Type.VIDEO_AVERAGE_ENCODE_MS,
            },
            googFrameRateInput: { transform: this.identityValue, type: SignalingProtocol_js_1.SdkMetric.Type.VIDEO_INPUT_FPS },
            framesEncoded: { transform: this.countPerSecond, type: SignalingProtocol_js_1.SdkMetric.Type.VIDEO_ENCODE_FPS },
            googFrameRateSent: { transform: this.identityValue, type: SignalingProtocol_js_1.SdkMetric.Type.VIDEO_SENT_FPS },
            framerateMean: { transform: this.identityValue, type: SignalingProtocol_js_1.SdkMetric.Type.VIDEO_SENT_FPS },
            packetsSent: { transform: this.countPerSecond, type: SignalingProtocol_js_1.SdkMetric.Type.VIDEO_SENT_PPS },
            packetsLost: {
                transform: this.packetLossPercent,
                type: SignalingProtocol_js_1.SdkMetric.Type.VIDEO_SENT_FRACTION_PACKET_LOST_PERCENT,
                source: 'packetsSent',
            },
            bytesSent: { transform: this.bitsPerSecond, type: SignalingProtocol_js_1.SdkMetric.Type.VIDEO_SENT_BITRATE },
            droppedFrames: { transform: this.countPerSecond, type: SignalingProtocol_js_1.SdkMetric.Type.VIDEO_DROPPED_FPS },
        };
        this.videoDownstreamMetricMap = {
            googTargetDelayMs: {
                transform: this.identityValue,
                type: SignalingProtocol_js_1.SdkMetric.Type.VIDEO_TARGET_DELAY_MS,
            },
            googDecodeMs: { transform: this.identityValue, type: SignalingProtocol_js_1.SdkMetric.Type.VIDEO_DECODE_MS },
            googFrameRateOutput: { transform: this.identityValue, type: SignalingProtocol_js_1.SdkMetric.Type.VIDEO_OUTPUT_FPS },
            packetsReceived: { transform: this.countPerSecond, type: SignalingProtocol_js_1.SdkMetric.Type.VIDEO_RECEIVED_PPS },
            packetsLost: {
                transform: this.packetLossPercent,
                type: SignalingProtocol_js_1.SdkMetric.Type.VIDEO_RECEIVED_FRACTION_PACKET_LOST_PERCENT,
                source: 'packetsReceived',
            },
            googRenderDelayMs: {
                transform: this.identityValue,
                type: SignalingProtocol_js_1.SdkMetric.Type.VIDEO_RENDER_DELAY_MS,
            },
            googFrameRateReceived: {
                transform: this.identityValue,
                type: SignalingProtocol_js_1.SdkMetric.Type.VIDEO_RECEIVED_FPS,
            },
            framerateMean: { transform: this.identityValue, type: SignalingProtocol_js_1.SdkMetric.Type.VIDEO_RECEIVED_FPS },
            framesDecoded: { transform: this.countPerSecond, type: SignalingProtocol_js_1.SdkMetric.Type.VIDEO_DECODE_FPS },
            googNacksSent: { transform: this.countPerSecond, type: SignalingProtocol_js_1.SdkMetric.Type.VIDEO_NACKS_SENT },
            nackCount: { transform: this.countPerSecond, type: SignalingProtocol_js_1.SdkMetric.Type.VIDEO_NACKS_SENT },
            googFirsSent: { transform: this.countPerSecond, type: SignalingProtocol_js_1.SdkMetric.Type.VIDEO_FIRS_SENT },
            firCount: { transform: this.countPerSecond, type: SignalingProtocol_js_1.SdkMetric.Type.VIDEO_FIRS_SENT },
            googPlisSent: { transform: this.countPerSecond, type: SignalingProtocol_js_1.SdkMetric.Type.VIDEO_PLIS_SENT },
            pliCount: { transform: this.countPerSecond, type: SignalingProtocol_js_1.SdkMetric.Type.VIDEO_PLIS_SENT },
            bytesReceived: { transform: this.bitsPerSecond, type: SignalingProtocol_js_1.SdkMetric.Type.VIDEO_RECEIVED_BITRATE },
            googCurrentDelayMs: {
                transform: this.identityValue,
                type: SignalingProtocol_js_1.SdkMetric.Type.VIDEO_CURRENT_DELAY_MS,
            },
            googJitterBufferMs: {
                transform: this.identityValue,
                type: SignalingProtocol_js_1.SdkMetric.Type.VIDEO_JITTER_BUFFER_MS,
            },
            discardedPackets: { transform: this.countPerSecond, type: SignalingProtocol_js_1.SdkMetric.Type.VIDEO_DISCARDED_PPS },
            googJitterReceived: {
                transform: this.identityValue,
                type: SignalingProtocol_js_1.SdkMetric.Type.VIDEO_RECEIVED_JITTER_MS,
            },
            jitter: {
                transform: this.secondsToMilliseconds,
                type: SignalingProtocol_js_1.SdkMetric.Type.VIDEO_RECEIVED_JITTER_MS,
            },
        };
        /**
         * Observable metrics and related APIs
         */
        this.observableMetricSpec = {
            audioPacketsReceived: {
                source: 'packetsReceived',
                media: ClientMetricReportMediaType_1.default.AUDIO,
                dir: ClientMetricReportDirection_1.default.DOWNSTREAM,
            },
            audioPacketsReceivedFractionLoss: {
                source: 'packetsLost',
                media: ClientMetricReportMediaType_1.default.AUDIO,
                dir: ClientMetricReportDirection_1.default.DOWNSTREAM,
            },
            audioDecoderLoss: {
                source: 'googDecodingNormal',
                media: ClientMetricReportMediaType_1.default.AUDIO,
                dir: ClientMetricReportDirection_1.default.DOWNSTREAM,
            },
            videoUpstreamBitrate: { source: 'bytesSent', media: ClientMetricReportMediaType_1.default.VIDEO, dir: ClientMetricReportDirection_1.default.UPSTREAM },
            videoPacketSentPerSecond: {
                source: 'packetsSent',
                media: ClientMetricReportMediaType_1.default.VIDEO,
                dir: ClientMetricReportDirection_1.default.UPSTREAM,
            },
            availableSendBandwidth: { source: 'googAvailableSendBandwidth' },
            availableReceiveBandwidth: { source: 'googAvailableReceiveBandwidth' },
            audioSpeakerDelayMs: {
                source: 'googCurrentDelayMs',
                media: ClientMetricReportMediaType_1.default.AUDIO,
                dir: ClientMetricReportDirection_1.default.DOWNSTREAM,
            },
            // new getStats() API
            availableIncomingBitrate: { source: 'availableIncomingBitrate' },
            availableOutgoingBitrate: { source: 'availableOutgoingBitrate' },
            nackCountReceivedPerSecond: {
                source: 'nackCount',
                media: ClientMetricReportMediaType_1.default.VIDEO,
                dir: ClientMetricReportDirection_1.default.UPSTREAM,
            },
            googNackCountReceivedPerSecond: {
                source: 'googNacksReceived',
                media: ClientMetricReportMediaType_1.default.VIDEO,
                dir: ClientMetricReportDirection_1.default.UPSTREAM,
            },
        };
    }
    getMetricMap(mediaType, direction) {
        switch (mediaType) {
            case ClientMetricReportMediaType_1.default.AUDIO:
                switch (direction) {
                    case ClientMetricReportDirection_1.default.UPSTREAM:
                        return this.audioUpstreamMetricMap;
                    case ClientMetricReportDirection_1.default.DOWNSTREAM:
                        return this.audioDownstreamMetricMap;
                }
            case ClientMetricReportMediaType_1.default.VIDEO:
                switch (direction) {
                    case ClientMetricReportDirection_1.default.UPSTREAM:
                        return this.videoUpstreamMetricMap;
                    case ClientMetricReportDirection_1.default.DOWNSTREAM:
                        return this.videoDownstreamMetricMap;
                }
            default:
                return this.globalMetricMap;
        }
    }
    getObservableMetricValue(metricName) {
        const observableMetricSpec = this.observableMetricSpec[metricName];
        const metricMap = this.getMetricMap(observableMetricSpec.media, observableMetricSpec.dir);
        const metricSpec = metricMap[observableMetricSpec.source];
        const transform = metricSpec.transform;
        const source = metricSpec.source;
        if (observableMetricSpec.hasOwnProperty('media')) {
            for (const ssrc in this.streamMetricReports) {
                const streamMetricReport = this.streamMetricReports[ssrc];
                if (observableMetricSpec.source in streamMetricReport.currentMetrics &&
                    streamMetricReport.direction === observableMetricSpec.dir &&
                    streamMetricReport.mediaType === observableMetricSpec.media) {
                    return source
                        ? transform(source, Number(ssrc))
                        : transform(observableMetricSpec.source, Number(ssrc));
                }
            }
        }
        else {
            return source ? transform(source) : transform(observableMetricSpec.source);
        }
        return 0;
    }
    getObservableMetrics() {
        const metric = {};
        for (const metricName in this.observableMetricSpec) {
            metric[metricName] = this.getObservableMetricValue(metricName);
        }
        return metric;
    }
    /**
     * Utilities
     */
    clone() {
        const cloned = new DefaultClientMetricReport(this.logger);
        cloned.globalMetricReport = this.globalMetricReport;
        cloned.streamMetricReports = this.streamMetricReports;
        cloned.currentTimestampMs = this.currentTimestampMs;
        cloned.previousTimestampMs = this.previousTimestampMs;
        return cloned;
    }
    print() {
        const clientMetricReport = {
            globalMetricReport: this.globalMetricReport,
            streamMetricReports: this.streamMetricReports,
            currentTimestampMs: this.currentTimestampMs,
            previousTimestampMs: this.previousTimestampMs,
        };
        this.logger.debug(() => {
            return `Client Metric Report: ${JSON.stringify(clientMetricReport)}`;
        });
    }
    removeDestroyedSsrcs() {
        for (const ssrc in this.streamMetricReports) {
            if (!this.currentSsrcs[ssrc]) {
                delete this.streamMetricReports[ssrc];
            }
        }
    }
}
exports.default = DefaultClientMetricReport;
//# sourceMappingURL=DefaultClientMetricReport.js.map