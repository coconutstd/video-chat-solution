"use strict";
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
const DefaultVideoCaptureAndEncodeParameter_1 = require("../videocaptureandencodeparameter/DefaultVideoCaptureAndEncodeParameter");
/** NScaleVideoUplinkBandwidthPolicy implements capture and encode
 *  parameters that are nearly equivalent to those chosen by the
 *  traditional native clients, except for a modification to
 *  maxBandwidthKbps described below. */
class NScaleVideoUplinkBandwidthPolicy {
    constructor(selfAttendeeId) {
        this.selfAttendeeId = selfAttendeeId;
        this.numParticipants = 0;
        this.idealMaxBandwidthKbps = 1400;
        this.hasBandwidthPriority = false;
        this.optimalParameters = new DefaultVideoCaptureAndEncodeParameter_1.default(0, 0, 0, 0, false);
        this.parametersInEffect = new DefaultVideoCaptureAndEncodeParameter_1.default(0, 0, 0, 0, false);
    }
    updateConnectionMetric(_metrics) {
        return;
    }
    chooseMediaTrackConstraints() {
        return {};
    }
    chooseEncodingParameters() {
        return new Map();
    }
    updateIndex(videoIndex) {
        // the +1 for self is assuming that we intend to send video, since
        // the context here is VideoUplinkBandwidthPolicy
        this.numParticipants =
            videoIndex.numberOfVideoPublishingParticipantsExcludingSelf(this.selfAttendeeId) + 1;
        this.optimalParameters = new DefaultVideoCaptureAndEncodeParameter_1.default(this.captureWidth(), this.captureHeight(), this.captureFrameRate(), this.maxBandwidthKbps(), false);
    }
    wantsResubscribe() {
        return !this.parametersInEffect.equal(this.optimalParameters);
    }
    chooseCaptureAndEncodeParameters() {
        this.parametersInEffect = this.optimalParameters.clone();
        return this.parametersInEffect.clone();
    }
    captureWidth() {
        let width = 640;
        if (this.numParticipants > 4) {
            width = 320;
        }
        return width;
    }
    captureHeight() {
        let height = 384;
        if (this.numParticipants > 4) {
            height = 192;
        }
        return height;
    }
    captureFrameRate() {
        return 15;
    }
    maxBandwidthKbps() {
        if (this.hasBandwidthPriority) {
            return Math.trunc(this.idealMaxBandwidthKbps);
        }
        let rate = 0;
        if (this.numParticipants <= 2) {
            rate = this.idealMaxBandwidthKbps;
        }
        else if (this.numParticipants <= 4) {
            rate = (this.idealMaxBandwidthKbps * 2) / 3;
        }
        else {
            rate = ((544 / 11 + 14880 / (11 * this.numParticipants)) / 600) * this.idealMaxBandwidthKbps;
        }
        return Math.trunc(rate);
    }
    setIdealMaxBandwidthKbps(idealMaxBandwidthKbps) {
        this.idealMaxBandwidthKbps = idealMaxBandwidthKbps;
    }
    setHasBandwidthPriority(hasBandwidthPriority) {
        this.hasBandwidthPriority = hasBandwidthPriority;
    }
}
exports.default = NScaleVideoUplinkBandwidthPolicy;
//# sourceMappingURL=NScaleVideoUplinkBandwidthPolicy.js.map