"use strict";
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
const Maybe_1 = require("../maybe/Maybe");
const AsyncScheduler_1 = require("../scheduler/AsyncScheduler");
const SimulcastLayers_1 = require("../simulcastlayers/SimulcastLayers");
const SimulcastTransceiverController_1 = require("../transceivercontroller/SimulcastTransceiverController");
const DefaultVideoCaptureAndEncodeParameter_1 = require("../videocaptureandencodeparameter/DefaultVideoCaptureAndEncodeParameter");
const BitrateParameters_1 = require("./BitrateParameters");
/**
 * [[DefaultSimulcastUplinkPolicy]] determines capture and encode
 *  parameters that reacts to estimated uplink bandwidth
 */
class DefaultSimulcastUplinkPolicy {
    constructor(selfAttendeeId, logger) {
        this.selfAttendeeId = selfAttendeeId;
        this.logger = logger;
        this.numSenders = 0;
        this.numParticipants = -1;
        this.newQualityMap = new Map();
        this.currentQualityMap = new Map();
        this.newActiveStreams = 1 /* kHiAndLow */;
        this.currentActiveStreams = 1 /* kHiAndLow */;
        this.lastUplinkBandwidthKbps = DefaultSimulcastUplinkPolicy.defaultUplinkBandwidthKbps;
        this.startTimeMs = 0;
        this.lastUpdatedMs = Date.now();
        this.videoIndex = null;
        this.currLocalDescriptions = [];
        this.nextLocalDescriptions = [];
        this.observerQueue = new Set();
        this.optimalParameters = new DefaultVideoCaptureAndEncodeParameter_1.default(0, 0, 0, 0, true);
        this.parametersInEffect = new DefaultVideoCaptureAndEncodeParameter_1.default(0, 0, 0, 0, true);
        this.lastUplinkBandwidthKbps = DefaultSimulcastUplinkPolicy.defaultUplinkBandwidthKbps;
        this.currentQualityMap = this.fillEncodingParamWithBitrates([300, 0, 1200]);
        this.newQualityMap = this.fillEncodingParamWithBitrates([300, 0, 1200]);
    }
    updateConnectionMetric({ uplinkKbps = 0 }) {
        if (isNaN(uplinkKbps)) {
            return;
        }
        // Check if startup period in order to ignore estimate when video first enabled.
        // If only audio was active then the estimate will be very low
        if (this.startTimeMs === 0) {
            this.startTimeMs = Date.now();
        }
        if (Date.now() - this.startTimeMs < DefaultSimulcastUplinkPolicy.startupDurationMs) {
            this.lastUplinkBandwidthKbps = DefaultSimulcastUplinkPolicy.defaultUplinkBandwidthKbps;
        }
        else {
            this.lastUplinkBandwidthKbps = uplinkKbps;
        }
        this.logger.debug(() => {
            return `simulcast: uplink policy update metrics ${this.lastUplinkBandwidthKbps}`;
        });
        let holdTime = DefaultSimulcastUplinkPolicy.holdDownDurationMs;
        if (this.currentActiveStreams === 3 /* kLow */) {
            holdTime = DefaultSimulcastUplinkPolicy.holdDownDurationMs * 2;
        }
        else if ((this.currentActiveStreams === 2 /* kMidAndLow */ &&
            uplinkKbps <= DefaultSimulcastUplinkPolicy.kMidDisabledRate) ||
            (this.currentActiveStreams === 1 /* kHiAndLow */ &&
                uplinkKbps <= DefaultSimulcastUplinkPolicy.kHiDisabledRate)) {
            holdTime = DefaultSimulcastUplinkPolicy.holdDownDurationMs / 2;
        }
        if (Date.now() < this.lastUpdatedMs + holdTime) {
            return;
        }
        this.newQualityMap = this.calculateEncodingParameters(false);
    }
    calculateEncodingParameters(numSendersChanged) {
        // bitrates parameter min is not used for now
        const newBitrates = [
            new BitrateParameters_1.default(),
            new BitrateParameters_1.default(),
            new BitrateParameters_1.default(),
        ];
        let hysteresisIncrease = 0, hysteresisDecrease = 0;
        if (this.currentActiveStreams === 0 /* kHi */) {
            // Don't trigger redetermination based on rate if only one simulcast stream
            hysteresisIncrease = this.lastUplinkBandwidthKbps + 1;
            hysteresisDecrease = 0;
        }
        else if (this.currentActiveStreams === 1 /* kHiAndLow */) {
            hysteresisIncrease = 2400;
            hysteresisDecrease = DefaultSimulcastUplinkPolicy.kHiDisabledRate;
        }
        else if (this.currentActiveStreams === 2 /* kMidAndLow */) {
            hysteresisIncrease = 1000;
            hysteresisDecrease = DefaultSimulcastUplinkPolicy.kMidDisabledRate;
        }
        else {
            hysteresisIncrease = 300;
            hysteresisDecrease = 0;
        }
        if (numSendersChanged ||
            this.lastUplinkBandwidthKbps >= hysteresisIncrease ||
            this.lastUplinkBandwidthKbps <= hysteresisDecrease) {
            if (this.numParticipants >= 0 && this.numParticipants <= 2) {
                // Simulcast disabled
                this.newActiveStreams = 0 /* kHi */;
                newBitrates[0].maxBitrateKbps = 0;
                newBitrates[1].maxBitrateKbps = 0;
                newBitrates[2].maxBitrateKbps = 1200;
            }
            else if (this.numSenders <= 4 &&
                this.lastUplinkBandwidthKbps >= DefaultSimulcastUplinkPolicy.kHiDisabledRate) {
                // 320x192+ (640x384)  + 1280x768
                this.newActiveStreams = 1 /* kHiAndLow */;
                newBitrates[0].maxBitrateKbps = 300;
                newBitrates[1].maxBitrateKbps = 0;
                newBitrates[2].maxBitrateKbps = 1200;
            }
            else if (this.lastUplinkBandwidthKbps >= DefaultSimulcastUplinkPolicy.kMidDisabledRate) {
                // 320x192 + 640x384 + (1280x768)
                this.newActiveStreams = 2 /* kMidAndLow */;
                newBitrates[0].maxBitrateKbps = this.lastUplinkBandwidthKbps >= 350 ? 200 : 150;
                newBitrates[1].maxBitrateKbps = this.numSenders <= 6 ? 600 : 350;
                newBitrates[2].maxBitrateKbps = 0;
            }
            else {
                // 320x192 + 640x384 + (1280x768)
                this.newActiveStreams = 3 /* kLow */;
                newBitrates[0].maxBitrateKbps = 300;
                newBitrates[1].maxBitrateKbps = 0;
                newBitrates[2].maxBitrateKbps = 0;
            }
            const bitrates = newBitrates.map((v, _i, _a) => {
                return v.maxBitrateKbps;
            });
            this.newQualityMap = this.fillEncodingParamWithBitrates(bitrates);
            if (!this.encodingParametersEqual()) {
                this.logger.info(`simulcast: policy:calculateEncodingParameters bw:${this.lastUplinkBandwidthKbps} numSources:${this.numSenders} numClients:${this.numParticipants} newQualityMap: ${this.getQualityMapString(this.newQualityMap)}`);
            }
        }
        return this.newQualityMap;
    }
    chooseMediaTrackConstraints() {
        // Changing MediaTrackConstraints causes a restart of video input and possible small
        // scaling changes.  Always use 720p for now
        const trackConstraint = {
            width: { ideal: 1280 },
            height: { ideal: 768 },
            frameRate: { ideal: 15 },
        };
        return trackConstraint;
    }
    chooseEncodingParameters() {
        this.currentQualityMap = this.newQualityMap;
        this.currentActiveStreams = this.newActiveStreams;
        if (this.activeStreamsToPublish !== this.newActiveStreams) {
            this.activeStreamsToPublish = this.newActiveStreams;
            this.publishEncodingSimulcastLayer();
        }
        return this.currentQualityMap;
    }
    updateIndex(videoIndex) {
        // the +1 for self is assuming that we intend to send video, since
        // the context here is VideoUplinkBandwidthPolicy
        const numSenders = videoIndex.numberOfVideoPublishingParticipantsExcludingSelf(this.selfAttendeeId) + 1;
        const numParticipants = videoIndex.numberOfParticipants();
        const numSendersChanged = numSenders !== this.numSenders;
        const numParticipantsChanged = (numParticipants > 2 && this.numParticipants <= 2) ||
            (numParticipants <= 2 && this.numParticipants > 2);
        this.numSenders = numSenders;
        this.numParticipants = numParticipants;
        this.optimalParameters = new DefaultVideoCaptureAndEncodeParameter_1.default(this.captureWidth(), this.captureHeight(), this.captureFrameRate(), this.maxBandwidthKbps(), false);
        this.videoIndex = videoIndex;
        this.newQualityMap = this.calculateEncodingParameters(numSendersChanged || numParticipantsChanged);
    }
    wantsResubscribe() {
        let constraintDiff = !this.encodingParametersEqual();
        this.nextLocalDescriptions = this.videoIndex.localStreamDescriptions();
        for (let i = 0; i < this.nextLocalDescriptions.length; i++) {
            const streamId = this.nextLocalDescriptions[i].streamId;
            if (streamId !== 0 && !!streamId) {
                const prevIndex = this.currLocalDescriptions.findIndex(val => {
                    return val.streamId === streamId;
                });
                if (prevIndex !== -1) {
                    if (this.nextLocalDescriptions[i].disabledByWebRTC !==
                        this.currLocalDescriptions[prevIndex].disabledByWebRTC) {
                        constraintDiff = true;
                    }
                }
            }
        }
        if (constraintDiff) {
            this.lastUpdatedMs = Date.now();
        }
        this.currLocalDescriptions = this.nextLocalDescriptions;
        return constraintDiff;
    }
    compareEncodingParameter(encoding1, encoding2) {
        return JSON.stringify(encoding1) === JSON.stringify(encoding2);
    }
    encodingParametersEqual() {
        let different = false;
        for (const ridName of SimulcastTransceiverController_1.default.NAME_ARR_ASCENDING) {
            different =
                different ||
                    !this.compareEncodingParameter(this.newQualityMap.get(ridName), this.currentQualityMap.get(ridName));
            if (different) {
                break;
            }
        }
        return !different;
    }
    chooseCaptureAndEncodeParameters() {
        // should deprecate in this policy
        this.parametersInEffect = this.optimalParameters.clone();
        return this.parametersInEffect.clone();
    }
    captureWidth() {
        // should deprecate in this policy
        const width = 1280;
        return width;
    }
    captureHeight() {
        // should deprecate in this policy
        const height = 768;
        return height;
    }
    captureFrameRate() {
        // should deprecate in this policy
        return 15;
    }
    maxBandwidthKbps() {
        // should deprecate in this policy
        return 1400;
    }
    setIdealMaxBandwidthKbps(_idealMaxBandwidthKbps) {
        // should deprecate in this policy
    }
    setHasBandwidthPriority(_hasBandwidthPriority) {
        // should deprecate in this policy
    }
    fillEncodingParamWithBitrates(bitratesKbps) {
        const newMap = new Map();
        const toBps = 1000;
        const nameArr = SimulcastTransceiverController_1.default.NAME_ARR_ASCENDING;
        const bitrateArr = bitratesKbps;
        let scale = 4;
        for (let i = 0; i < nameArr.length; i++) {
            const ridName = nameArr[i];
            newMap.set(ridName, {
                rid: ridName,
                active: bitrateArr[i] > 0 ? true : false,
                scaleResolutionDownBy: scale,
                maxBitrate: bitrateArr[i] * toBps,
            });
            scale = scale / 2;
        }
        return newMap;
    }
    getQualityMapString(params) {
        let qualityString = '';
        const localDescriptions = this.videoIndex.localStreamDescriptions();
        if (localDescriptions.length === 3) {
            params.forEach((value) => {
                let disabledByWebRTC = false;
                if (value.rid === 'low')
                    disabledByWebRTC = localDescriptions[0].disabledByWebRTC;
                else if (value.rid === 'mid')
                    disabledByWebRTC = localDescriptions[1].disabledByWebRTC;
                else
                    disabledByWebRTC = localDescriptions[2].disabledByWebRTC;
                qualityString += `{ rid: ${value.rid} active:${value.active} disabledByWebRTC: ${disabledByWebRTC} maxBitrate:${value.maxBitrate}}`;
            });
        }
        return qualityString;
    }
    getEncodingSimulcastLayer(activeStreams) {
        switch (activeStreams) {
            case 0 /* kHi */:
                return SimulcastLayers_1.default.High;
            case 1 /* kHiAndLow */:
                return SimulcastLayers_1.default.LowAndHigh;
            case 2 /* kMidAndLow */:
                return SimulcastLayers_1.default.LowAndMedium;
            case 3 /* kLow */:
                return SimulcastLayers_1.default.Low;
        }
    }
    publishEncodingSimulcastLayer() {
        const simulcastLayers = this.getEncodingSimulcastLayer(this.activeStreamsToPublish);
        this.forEachObserver(observer => {
            Maybe_1.default.of(observer.encodingSimulcastLayersDidChange).map(f => f.bind(observer)(simulcastLayers));
        });
    }
    addObserver(observer) {
        this.logger.info('adding simulcast uplink observer');
        this.observerQueue.add(observer);
    }
    removeObserver(observer) {
        this.logger.info('removing simulcast uplink observer');
        this.observerQueue.delete(observer);
    }
    forEachObserver(observerFunc) {
        for (const observer of this.observerQueue) {
            new AsyncScheduler_1.default().start(() => {
                if (this.observerQueue.has(observer)) {
                    observerFunc(observer);
                }
            });
        }
    }
}
exports.default = DefaultSimulcastUplinkPolicy;
DefaultSimulcastUplinkPolicy.defaultUplinkBandwidthKbps = 1200;
DefaultSimulcastUplinkPolicy.startupDurationMs = 6000;
DefaultSimulcastUplinkPolicy.holdDownDurationMs = 4000;
DefaultSimulcastUplinkPolicy.defaultMaxFrameRate = 15;
// Current rough estimates where webrtc disables streams
DefaultSimulcastUplinkPolicy.kHiDisabledRate = 700;
DefaultSimulcastUplinkPolicy.kMidDisabledRate = 240;
//# sourceMappingURL=DefaultSimulcastUplinkPolicy.js.map