"use strict";
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
const DefaultVideoStreamIdSet_1 = require("../videostreamidset/DefaultVideoStreamIdSet");
class NoVideoDownlinkBandwidthPolicy {
    reset() { }
    updateIndex(_videoIndex) { }
    updateMetrics(_clientMetricReport) { }
    wantsResubscribe() {
        return false;
    }
    chooseSubscriptions() {
        return new DefaultVideoStreamIdSet_1.default();
    }
}
exports.default = NoVideoDownlinkBandwidthPolicy;
//# sourceMappingURL=NoVideoDownlinkBandwidthPolicy.js.map