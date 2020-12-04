"use strict";
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
const DefaultVideoStreamIdSet_1 = require("../videostreamidset/DefaultVideoStreamIdSet");
/**
 * [[AllHighestVideoBandwidthPolicy]] implements is a rudimentary policy that simply
 * always subscribes to the highest quality video stream available
 * for all non-self participants.
 */
class AllHighestVideoBandwidthPolicy {
    constructor(selfAttendeeId) {
        this.selfAttendeeId = selfAttendeeId;
        this.reset();
    }
    reset() {
        this.optimalReceiveSet = new DefaultVideoStreamIdSet_1.default();
        this.subscribedReceiveSet = new DefaultVideoStreamIdSet_1.default();
    }
    updateIndex(videoIndex) {
        this.optimalReceiveSet = this.calculateOptimalReceiveSet(videoIndex);
    }
    updateMetrics(_clientMetricReport) { }
    wantsResubscribe() {
        return !this.subscribedReceiveSet.equal(this.optimalReceiveSet);
    }
    chooseSubscriptions() {
        this.subscribedReceiveSet = this.optimalReceiveSet.clone();
        return this.subscribedReceiveSet.clone();
    }
    calculateOptimalReceiveSet(videoIndex) {
        return videoIndex.highestQualityStreamFromEachGroupExcludingSelf(this.selfAttendeeId);
    }
}
exports.default = AllHighestVideoBandwidthPolicy;
//# sourceMappingURL=AllHighestVideoBandwidthPolicy.js.map