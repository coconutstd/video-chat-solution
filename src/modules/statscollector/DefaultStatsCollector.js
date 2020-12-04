"use strict";
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
const ClientMetricReportDirection_1 = require("../clientmetricreport/ClientMetricReportDirection");
const ClientMetricReportMediaType_1 = require("../clientmetricreport/ClientMetricReportMediaType");
const DefaultClientMetricReport_1 = require("../clientmetricreport/DefaultClientMetricReport");
const StreamMetricReport_1 = require("../clientmetricreport/StreamMetricReport");
const Maybe_1 = require("../maybe/Maybe");
const MeetingSessionLifecycleEvent_1 = require("../meetingsession/MeetingSessionLifecycleEvent");
const MeetingSessionLifecycleEventCondition_1 = require("../meetingsession/MeetingSessionLifecycleEventCondition");
const IntervalScheduler_1 = require("../scheduler/IntervalScheduler");
const SignalingProtocol_js_1 = require("../signalingprotocol/SignalingProtocol.js");
const AudioLogEvent_1 = require("./AudioLogEvent");
const VideoLogEvent_1 = require("./VideoLogEvent");
class DefaultStatsCollector {
    constructor(audioVideoController, logger, browserBehavior, interval = DefaultStatsCollector.INTERVAL_MS) {
        this.audioVideoController = audioVideoController;
        this.logger = logger;
        this.browserBehavior = browserBehavior;
        this.interval = interval;
        this.intervalScheduler = null;
        // TODO: Implement metricsAddTime() and metricsLogEvent().
        this.metricsAddTime = (_name, _duration, _attributes) => { };
        this.metricsLogEvent = (_name, _attributes) => { };
    }
    // TODO: Update toAttribute() and toSuffix() methods to convert raw data to a required type.
    toAttribute(str) {
        return this.toSuffix(str).substring(1);
    }
    toSuffix(str) {
        if (str.toLowerCase() === str) {
            // e.g. lower_case -> _lower_case
            return `_${str}`;
        }
        else if (str.toUpperCase() === str) {
            // e.g. UPPER_CASE -> _upper_case
            return `_${str.toLowerCase()}`;
        }
        else {
            // e.g. CamelCaseWithCAPS -> _camel_case_with_caps
            return str
                .replace(/([A-Z][a-z]+)/g, function ($1) {
                return `_${$1}`;
            })
                .replace(/([A-Z][A-Z]+)/g, function ($1) {
                return `_${$1}`;
            })
                .toLowerCase();
        }
    }
    logLatency(eventName, timeMs, attributes) {
        const event = this.toSuffix(eventName);
        this.logEventTime('meeting' + event, timeMs, attributes);
    }
    logStateTimeout(stateName, attributes) {
        const state = this.toSuffix(stateName);
        this.logEvent('meeting_session_state_timeout', Object.assign(Object.assign({}, attributes), { state: `state${state}` }));
    }
    logAudioEvent(eventName, attributes) {
        const event = 'audio' + this.toSuffix(AudioLogEvent_1.default[eventName]);
        this.logEvent(event, attributes);
    }
    logVideoEvent(eventName, attributes) {
        const event = 'video' + this.toSuffix(VideoLogEvent_1.default[eventName]);
        this.logEvent(event, attributes);
    }
    logEventTime(eventName, timeMs, attributes = {}) {
        const finalAttributes = Object.assign(Object.assign({}, attributes), { call_id: this.audioVideoController.configuration.meetingId, client_type: DefaultStatsCollector.CLIENT_TYPE, metric_type: 'latency' });
        this.logger.debug(() => {
            return `[DefaultStatsCollector] ${eventName}: ${JSON.stringify(finalAttributes)}`;
        });
        this.metricsAddTime(eventName, timeMs, finalAttributes);
    }
    logMeetingSessionStatus(status) {
        // TODO: Generate the status event name given the status code.
        const statusEventName = `${status.statusCode()}`;
        this.logEvent(statusEventName);
        const statusAttribute = {
            status: statusEventName,
            status_code: `${status.statusCode()}`,
        };
        this.logEvent('meeting_session_status', statusAttribute);
        if (status.isTerminal()) {
            this.logEvent('meeting_session_stopped', statusAttribute);
        }
        if (status.isAudioConnectionFailure()) {
            this.logEvent('meeting_session_audio_failed', statusAttribute);
        }
        if (status.isFailure()) {
            this.logEvent('meeting_session_failed', statusAttribute);
        }
    }
    logLifecycleEvent(lifecycleEvent, condition) {
        const attributes = {
            lifecycle_event: `lifecycle${this.toSuffix(MeetingSessionLifecycleEvent_1.default[lifecycleEvent])}`,
            lifecycle_event_code: `${lifecycleEvent}`,
            lifecycle_event_condition: `condition${this.toSuffix(MeetingSessionLifecycleEventCondition_1.default[condition])}`,
            lifecycle_event_condition_code: `${condition}`,
        };
        this.logEvent('meeting_session_lifecycle', attributes);
    }
    logEvent(eventName, attributes = {}) {
        const finalAttributes = Object.assign(Object.assign({}, attributes), { call_id: this.audioVideoController.configuration.meetingId, client_type: DefaultStatsCollector.CLIENT_TYPE });
        this.logger.debug(() => {
            return `[DefaultStatsCollector] ${eventName}: ${JSON.stringify(finalAttributes)}`;
        });
        this.metricsLogEvent(eventName, finalAttributes);
    }
    /**
     * WEBRTC METRICS COLLECTION.
     */
    start(signalingClient, videoStreamIndex, clientMetricReport) {
        if (this.intervalScheduler) {
            return false;
        }
        this.logger.info('Starting DefaultStatsCollector');
        this.signalingClient = signalingClient;
        this.videoStreamIndex = videoStreamIndex;
        if (clientMetricReport) {
            this.clientMetricReport = clientMetricReport;
        }
        else {
            this.clientMetricReport = new DefaultClientMetricReport_1.default(this.logger);
        }
        this.intervalScheduler = new IntervalScheduler_1.default(this.interval);
        this.intervalScheduler.start(() => {
            this.getStatsWrapper();
        });
        return true;
    }
    stop() {
        this.logger.info('Stopping DefaultStatsCollector');
        if (this.intervalScheduler) {
            this.intervalScheduler.stop();
        }
        this.intervalScheduler = null;
    }
    /**
     * Convert raw metrics to client metric report.
     */
    updateMetricValues(rawMetricReport, isStream) {
        const metricReport = isStream
            ? this.clientMetricReport.streamMetricReports[Number(rawMetricReport.ssrc)]
            : this.clientMetricReport.globalMetricReport;
        let metricMap;
        if (isStream) {
            metricMap = this.clientMetricReport.getMetricMap(metricReport.mediaType, metricReport.direction);
        }
        else {
            metricMap = this.clientMetricReport.getMetricMap();
        }
        for (const rawMetric in rawMetricReport) {
            if (rawMetric in metricMap) {
                metricReport.previousMetrics[rawMetric] = metricReport.currentMetrics[rawMetric];
                metricReport.currentMetrics[rawMetric] = rawMetricReport[rawMetric];
            }
        }
    }
    processRawMetricReports(rawMetricReports) {
        this.clientMetricReport.currentSsrcs = {};
        const timeStamp = Date.now();
        for (const rawMetricReport of rawMetricReports) {
            const isStream = this.isStreamRawMetricReport(rawMetricReport.type);
            if (isStream) {
                if (!this.clientMetricReport.streamMetricReports[Number(rawMetricReport.ssrc)]) {
                    const streamMetricReport = new StreamMetricReport_1.default();
                    streamMetricReport.mediaType = this.getMediaType(rawMetricReport);
                    streamMetricReport.direction = this.getDirectionType(rawMetricReport);
                    if (!this.videoStreamIndex.allStreams().empty()) {
                        streamMetricReport.streamId = this.videoStreamIndex.streamIdForSSRC(Number(rawMetricReport.ssrc));
                    }
                    this.clientMetricReport.streamMetricReports[Number(rawMetricReport.ssrc)] = streamMetricReport;
                }
                this.clientMetricReport.currentSsrcs[Number(rawMetricReport.ssrc)] = 1;
            }
            this.updateMetricValues(rawMetricReport, isStream);
        }
        this.clientMetricReport.removeDestroyedSsrcs();
        this.clientMetricReport.previousTimestampMs = this.clientMetricReport.currentTimestampMs;
        this.clientMetricReport.currentTimestampMs = timeStamp;
        this.clientMetricReport.print();
    }
    /**
     * Protobuf packaging.
     */
    addMetricFrame(metricName, clientMetricFrame, metricSpec, ssrc) {
        const type = metricSpec.type;
        const transform = metricSpec.transform;
        const sourceMetric = metricSpec.source;
        const streamMetricFramesLength = clientMetricFrame.streamMetricFrames.length;
        const latestStreamMetricFrame = clientMetricFrame.streamMetricFrames[streamMetricFramesLength - 1];
        if (type) {
            const metricFrame = SignalingProtocol_js_1.SdkMetric.create();
            metricFrame.type = type;
            metricFrame.value = sourceMetric
                ? transform(sourceMetric, ssrc)
                : transform(metricName, ssrc);
            ssrc
                ? latestStreamMetricFrame.metrics.push(metricFrame)
                : clientMetricFrame.globalMetrics.push(metricFrame);
        }
    }
    addGlobalMetricsToProtobuf(clientMetricFrame) {
        const metricMap = this.clientMetricReport.getMetricMap();
        for (const metricName in this.clientMetricReport.globalMetricReport.currentMetrics) {
            this.addMetricFrame(metricName, clientMetricFrame, metricMap[metricName]);
        }
    }
    addStreamMetricsToProtobuf(clientMetricFrame) {
        for (const ssrc in this.clientMetricReport.streamMetricReports) {
            const streamMetricReport = this.clientMetricReport.streamMetricReports[ssrc];
            const streamMetricFrame = SignalingProtocol_js_1.SdkStreamMetricFrame.create();
            streamMetricFrame.streamId = streamMetricReport.streamId;
            streamMetricFrame.metrics = [];
            clientMetricFrame.streamMetricFrames.push(streamMetricFrame);
            const metricMap = this.clientMetricReport.getMetricMap(streamMetricReport.mediaType, streamMetricReport.direction);
            for (const metricName in streamMetricReport.currentMetrics) {
                this.addMetricFrame(metricName, clientMetricFrame, metricMap[metricName], Number(ssrc));
            }
        }
    }
    makeClientMetricProtobuf() {
        const clientMetricFrame = SignalingProtocol_js_1.SdkClientMetricFrame.create();
        clientMetricFrame.globalMetrics = [];
        clientMetricFrame.streamMetricFrames = [];
        this.addGlobalMetricsToProtobuf(clientMetricFrame);
        this.addStreamMetricsToProtobuf(clientMetricFrame);
        return clientMetricFrame;
    }
    sendClientMetricProtobuf(clientMetricFrame) {
        this.signalingClient.sendClientMetrics(clientMetricFrame);
    }
    /**
     * Helper functions.
     */
    isStreamRawMetricReport(type) {
        return type === 'ssrc' || type === 'inbound-rtp' || type === 'outbound-rtp';
    }
    getMediaType(rawMetricReport) {
        return rawMetricReport.mediaType === 'audio' ? ClientMetricReportMediaType_1.default.AUDIO : ClientMetricReportMediaType_1.default.VIDEO;
    }
    getDirectionType(rawMetricReport) {
        return rawMetricReport.id.toLowerCase().indexOf('send') !== -1 ||
            rawMetricReport.id.toLowerCase().indexOf('outbound') !== -1
            ? ClientMetricReportDirection_1.default.UPSTREAM
            : ClientMetricReportDirection_1.default.DOWNSTREAM;
    }
    /**
     * Metric report filter.
     */
    isValidChromeRawMetric(rawMetricReport) {
        return (this.browserBehavior.hasChromiumWebRTC() &&
            (rawMetricReport.type === 'ssrc' ||
                rawMetricReport.type === 'VideoBwe' ||
                (rawMetricReport.type === 'googCandidatePair' &&
                    rawMetricReport.googWritable === 'true' &&
                    rawMetricReport.googReadable === 'true')));
    }
    isValidStandardRawMetric(rawMetricReport) {
        const valid = rawMetricReport.type === 'inbound-rtp' ||
            rawMetricReport.type === 'outbound-rtp' ||
            (rawMetricReport.type === 'candidate-pair' && rawMetricReport.state === 'succeeded');
        if (this.browserBehavior.hasFirefoxWebRTC()) {
            if (this.compareMajorVersion(DefaultStatsCollector.FIREFOX_UPDATED_GET_STATS_VERSION) === -1) {
                return valid;
            }
            else {
                return valid && rawMetricReport.isRemote === false;
            }
        }
        return valid;
    }
    isValidSsrc(rawMetricReport) {
        let validSsrc = true;
        if (this.isStreamRawMetricReport(rawMetricReport.type) &&
            this.getDirectionType(rawMetricReport) === ClientMetricReportDirection_1.default.DOWNSTREAM &&
            this.getMediaType(rawMetricReport) === ClientMetricReportMediaType_1.default.VIDEO) {
            validSsrc = this.videoStreamIndex.streamIdForSSRC(Number(rawMetricReport.ssrc)) > 0;
        }
        return validSsrc;
    }
    isValidRawMetricReport(rawMetricReport) {
        return ((this.isValidChromeRawMetric(rawMetricReport) ||
            this.isValidStandardRawMetric(rawMetricReport)) &&
            this.isValidSsrc(rawMetricReport));
    }
    filterRawMetricReports(rawMetricReports) {
        const filteredRawMetricReports = [];
        for (const rawMetricReport of rawMetricReports) {
            if (this.isValidRawMetricReport(rawMetricReport)) {
                filteredRawMetricReports.push(rawMetricReport);
            }
        }
        return filteredRawMetricReports;
    }
    handleRawMetricReports(rawMetricReports) {
        const filteredRawMetricReports = this.filterRawMetricReports(rawMetricReports);
        this.logger.debug(() => {
            return `Filtered raw metrics : ${JSON.stringify(filteredRawMetricReports)}`;
        });
        this.processRawMetricReports(filteredRawMetricReports);
        const clientMetricFrame = this.makeClientMetricProtobuf();
        this.sendClientMetricProtobuf(clientMetricFrame);
        this.audioVideoController.forEachObserver(observer => {
            Maybe_1.default.of(observer.metricsDidReceive).map(f => f.bind(observer)(this.clientMetricReport.clone()));
        });
    }
    /**
     * Get raw webrtc metrics.
     */
    getStatsWrapper() {
        if (!this.audioVideoController.rtcPeerConnection) {
            return;
        }
        const rawMetricReports = [];
        if (!this.browserBehavior.requiresPromiseBasedWebRTCGetStats()) {
            // @ts-ignore
            this.audioVideoController.rtcPeerConnection.getStats(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (res) => {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                res.result().forEach((report) => {
                    const item = {};
                    report.names().forEach((name) => {
                        item[name] = report.stat(name);
                    });
                    item.id = report.id;
                    item.type = report.type;
                    item.timestamp = report.timestamp;
                    rawMetricReports.push(item);
                });
                this.handleRawMetricReports(rawMetricReports);
            }, 
            // @ts-ignore
            (error) => {
                this.logger.error(error.message);
            });
        }
        else {
            // @ts-ignore
            this.audioVideoController.rtcPeerConnection
                .getStats()
                .then((report) => {
                report.forEach((item) => {
                    rawMetricReports.push(item);
                });
                this.handleRawMetricReports(rawMetricReports);
            })
                .catch((error) => {
                this.logger.error(error.message);
            });
        }
    }
    compareMajorVersion(version) {
        const currentMajorVersion = parseInt(this.browserBehavior.version().split('.')[0]);
        const expectedMajorVersion = parseInt(version.split('.')[0]);
        if (expectedMajorVersion === currentMajorVersion) {
            return 0;
        }
        if (expectedMajorVersion > currentMajorVersion) {
            return 1;
        }
        return -1;
    }
}
exports.default = DefaultStatsCollector;
DefaultStatsCollector.INTERVAL_MS = 1000;
DefaultStatsCollector.FIREFOX_UPDATED_GET_STATS_VERSION = '66.0.0';
DefaultStatsCollector.CLIENT_TYPE = 'amazon-chime-sdk-js';
//# sourceMappingURL=DefaultStatsCollector.js.map