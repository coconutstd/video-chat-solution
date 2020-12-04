"use strict";
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
const DefaultVideoCaptureAndEncodeParameter_1 = require("../videocaptureandencodeparameter/DefaultVideoCaptureAndEncodeParameter");
class NoVideoUplinkBandwidthPolicy {
    constructor() { }
    updateConnectionMetric(_metrics) { }
    chooseMediaTrackConstraints() {
        return {};
    }
    chooseEncodingParameters() {
        return new Map();
    }
    updateIndex(_videoIndex) { }
    wantsResubscribe() {
        return false;
    }
    chooseCaptureAndEncodeParameters() {
        return new DefaultVideoCaptureAndEncodeParameter_1.default(0, 0, 0, 0, false);
    }
    maxBandwidthKbps() {
        return 0;
    }
    setIdealMaxBandwidthKbps(_idealMaxBandwidthKbps) { }
    setHasBandwidthPriority(_hasBandwidthPriority) { }
}
exports.default = NoVideoUplinkBandwidthPolicy;
//# sourceMappingURL=NoVideoUplinkBandwidthPolicy.js.map