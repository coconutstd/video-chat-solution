"use strict";
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var StreamDirection;
(function (StreamDirection) {
    StreamDirection["Downstream"] = "Downstream";
    StreamDirection["Upstream"] = "Upstream";
})(StreamDirection || (StreamDirection = {}));
;
const getCurrentUpstreamMetrics = (report, timestamp) => {
    const currentMetrics = {};
    const { frameHeight, frameWidth, bytesSent, packetsSent, framesEncoded } = report;
    currentMetrics['frameHeight'] = frameHeight;
    currentMetrics['frameWidth'] = frameWidth;
    currentMetrics['framesEncoded'] = framesEncoded;
    currentMetrics['bytesSent'] = bytesSent;
    currentMetrics['packetsSent'] = packetsSent;
    currentMetrics['timestamp'] = timestamp;
    return currentMetrics;
};
const getCurrentDownstreamMetrics = (report, timestamp) => {
    const currentMetrics = {};
    const { bytesReceived, packetsLost, packetsReceived, framesDecoded } = report;
    currentMetrics['bytesReceived'] = bytesReceived;
    currentMetrics['packetsLost'] = packetsLost;
    currentMetrics['packetsReceived'] = packetsReceived;
    currentMetrics['framesDecoded'] = framesDecoded;
    const totalPackets = packetsReceived + packetsLost;
    currentMetrics['packetLossPercent'] = totalPackets ? Math.trunc(packetsLost * 100 / (packetsReceived + packetsLost)) : 0;
    currentMetrics['timestamp'] = timestamp;
    return currentMetrics;
};
const bitsPerSecond = (metricName, metricMap) => {
    const previousTimestamp = metricMap.previous.timestamp;
    if (!previousTimestamp) {
        return 0;
    }
    const currentTimestamp = metricMap.current.timestamp;
    let intervalSeconds = (currentTimestamp - previousTimestamp) / 1000;
    if (intervalSeconds <= 0) {
        return 0;
    }
    const diff = (metricMap.current[metricName] - (metricMap.previous[metricName] || 0)) *
        8;
    if (diff <= 0) {
        return 0;
    }
    return Math.trunc((diff / intervalSeconds) / 1000);
};
const countPerSecond = (metricName, metricMap) => {
    const previousTimestamp = metricMap.previous.timestamp;
    if (!previousTimestamp) {
        return 0;
    }
    const currentTimestamp = metricMap.current.timestamp;
    let intervalSeconds = (currentTimestamp - previousTimestamp) / 1000;
    if (intervalSeconds <= 0) {
        return 0;
    }
    const diff = metricMap.current[metricName] - (metricMap.previous[metricName] || 0);
    if (diff <= 0) {
        return 0;
    }
    return Math.trunc(diff / intervalSeconds);
};
class WebRTCStatsCollector {
    constructor() {
        // Map SSRC to WebRTC metrics.
        this.upstreamMetrics = {};
        this.downstreamTileIndexToTrackId = {};
        // Map tile index to SSRC to WebRTC metrics.
        this.downstreamMetrics = {};
        this.cleanUpStaleUpstreamMetricsData = () => {
            const timestamp = Date.now();
            const ssrcsToRemove = [];
            for (const ssrc of Object.keys(this.upstreamMetrics)) {
                if ((timestamp - this.upstreamMetrics[ssrc].current.timestamp) >= WebRTCStatsCollector.CLEANUP_INTERVAL) {
                    ssrcsToRemove.push(ssrc);
                }
            }
            ssrcsToRemove.forEach((ssrc) => delete this.upstreamMetrics[ssrc]);
        };
        this.processWebRTCStatReportForTileIndex = (rtcStatsReport, tileIndex) => {
            this.cleanUpStaleUpstreamMetricsData();
            const timestamp = Date.now();
            let ssrcNum = 0;
            rtcStatsReport.forEach((report) => {
                if (report.ssrc) {
                    ssrcNum = Number(report.ssrc);
                }
                if (report.kind && report.kind === 'video') {
                    if (report.type === 'outbound-rtp' &&
                        report.bytesSent &&
                        report.frameHeight &&
                        report.frameWidth) {
                        // Collect and process upstream stats.
                        if (!this.upstreamMetrics.hasOwnProperty(ssrcNum)) {
                            if (Object.keys(this.upstreamMetrics).length === WebRTCStatsCollector.MAX_UPSTREAMS_COUNT) {
                                this.upstreamMetrics = {};
                            }
                            this.upstreamMetrics[ssrcNum] = {
                                current: {},
                                previous: {}
                            };
                        }
                        else {
                            this.upstreamMetrics[ssrcNum].previous = this.upstreamMetrics[ssrcNum].current;
                        }
                        this.upstreamMetrics[ssrcNum].current = getCurrentUpstreamMetrics(report, timestamp);
                        this.upstreamMetrics[ssrcNum].current['framesEncodedPerSecond'] = countPerSecond('framesEncoded', this.upstreamMetrics[ssrcNum]);
                        this.upstreamMetrics[ssrcNum].current['bitrate'] = bitsPerSecond('bytesSent', this.upstreamMetrics[ssrcNum]);
                    }
                    else {
                        if (report.type === 'inbound-rtp' && report.bytesReceived) {
                            // Collect and process downstream stats.
                            const { trackId } = report;
                            if (!this.downstreamMetrics.hasOwnProperty(tileIndex)) {
                                this.downstreamMetrics[tileIndex] = {};
                            }
                            if (!this.downstreamMetrics[tileIndex].hasOwnProperty(ssrcNum)) {
                                if (Object.keys(this.downstreamMetrics[tileIndex]).length === WebRTCStatsCollector.MAX_DOWNSTREAMS_COUNT) {
                                    this.downstreamMetrics[tileIndex] = {};
                                }
                                this.downstreamMetrics[tileIndex][ssrcNum] = {
                                    current: {},
                                    previous: {}
                                };
                                // Store trackId to later map frameHeight and frameWidth when WebRTC 'track' report is received for downstream videos.
                                this.downstreamTileIndexToTrackId[tileIndex] = trackId;
                            }
                            else {
                                this.downstreamMetrics[tileIndex][ssrcNum].previous = this.downstreamMetrics[tileIndex][ssrcNum].current;
                            }
                            this.downstreamMetrics[tileIndex][ssrcNum].current = getCurrentDownstreamMetrics(report, timestamp);
                            this.downstreamMetrics[tileIndex][ssrcNum].current['bitrate'] = bitsPerSecond('bytesReceived', this.downstreamMetrics[tileIndex][ssrcNum]);
                            this.downstreamMetrics[tileIndex][ssrcNum].current['framesDecodedPerSecond'] = countPerSecond('framesDecoded', this.downstreamMetrics[tileIndex][ssrcNum]);
                        }
                        else if (report.type === 'track' && this.downstreamTileIndexToTrackId[tileIndex] && this.downstreamTileIndexToTrackId[tileIndex] === report.id) {
                            // Collect and process frame height and width stats for downstream.
                            // Process frameHeight and frameWidth separately from track report as we do not have these stats in WebRTC 'inbound-rtp' report.
                            const { frameHeight, frameWidth } = report;
                            this.downstreamMetrics[tileIndex][ssrcNum].current.frameHeight = frameHeight;
                            this.downstreamMetrics[tileIndex][ssrcNum].current.frameWidth = frameWidth;
                        }
                    }
                }
            });
        };
        this.resetStats = () => {
            this.upstreamMetrics = {};
            this.downstreamMetrics = {};
            this.downstreamTileIndexToTrackId = {};
        };
        this.showStats = (tileIndex, streamDirection, keyStatstoShow, metricsData) => {
            const streams = Object.keys(metricsData);
            if (streams.length === 0) {
                return;
            }
            let statsInfo = document.getElementById(`stats-info-${tileIndex}`);
            if (!statsInfo) {
                statsInfo = document.createElement('div');
                statsInfo.setAttribute('id', `stats-info-${tileIndex}`);
                statsInfo.setAttribute('class', `stats-info`);
            }
            const statsInfoTableId = `stats-table-${tileIndex}`;
            let statsInfoTable = document.getElementById(statsInfoTableId);
            if (statsInfoTable) {
                statsInfo.removeChild(statsInfoTable);
            }
            statsInfoTable = document.createElement('table');
            statsInfoTable.setAttribute('id', statsInfoTableId);
            statsInfoTable.setAttribute('class', 'stats-table');
            statsInfo.appendChild(statsInfoTable);
            const videoEl = document.getElementById(`video-${tileIndex}`);
            videoEl.insertAdjacentElement('afterend', statsInfo);
            const header = statsInfoTable.insertRow(-1);
            let cell = header.insertCell(-1);
            cell.innerHTML = 'Video Metrics';
            for (let cnt = 0; cnt < streams.length; cnt++) {
                cell = header.insertCell(-1);
                cell.innerHTML = `${streamDirection} ${cnt + 1}`;
            }
            for (const [key, value] of Object.entries(keyStatstoShow)) {
                const row = statsInfoTable.insertRow(-1);
                row.setAttribute('id', `${streamDirection}-${key}-${tileIndex}`);
                cell = row.insertCell(-1);
                cell.innerHTML = value;
            }
            for (const ssrc of streams) {
                const _a = metricsData[ssrc].current, { frameHeight, frameWidth } = _a, restStatsToShow = __rest(_a, ["frameHeight", "frameWidth"]);
                if (frameHeight && frameWidth) {
                    const row = document.getElementById(`${streamDirection}-resolution-${tileIndex}`);
                    cell = row.insertCell(-1);
                    cell.innerHTML = `${frameWidth} &#x2715; ${frameHeight}`;
                }
                for (const [metricName, value] of Object.entries(restStatsToShow)) {
                    if (keyStatstoShow[metricName]) {
                        const row = document.getElementById(`${streamDirection}-${metricName}-${tileIndex}`);
                        cell = row.insertCell(-1);
                        cell.innerHTML = `${value}`;
                    }
                }
            }
        };
    }
    showUpstreamStats(tileIndex) {
        this.showStats(tileIndex, StreamDirection.Upstream, WebRTCStatsCollector.upstreamMetricsKeyStatsToShow, this.upstreamMetrics);
    }
    showDownstreamStats(tileIndex) {
        this.showStats(tileIndex, StreamDirection.Downstream, WebRTCStatsCollector.downstreamMetricsKeyStatsToShow, this.downstreamMetrics[tileIndex]);
    }
}
exports.default = WebRTCStatsCollector;
WebRTCStatsCollector.MAX_UPSTREAMS_COUNT = 2;
WebRTCStatsCollector.MAX_DOWNSTREAMS_COUNT = 1;
WebRTCStatsCollector.CLEANUP_INTERVAL = 1500; // In milliseconds.
WebRTCStatsCollector.upstreamMetricsKeyStatsToShow = {
    'resolution': 'Resolution',
    'bitrate': 'Bitrate (kbps)',
    'packetsSent': 'Packets Sent',
    'framesEncodedPerSecond': 'Frame Rate',
};
WebRTCStatsCollector.downstreamMetricsKeyStatsToShow = {
    'resolution': 'Resolution',
    'bitrate': 'Bitrate (kbps)',
    'packetLossPercent': 'Packet Loss (%)',
    'framesDecodedPerSecond': 'Frame Rate',
};
//# sourceMappingURL=WebRTCStatsCollector.js.map