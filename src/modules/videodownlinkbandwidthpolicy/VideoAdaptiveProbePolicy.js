"use strict";
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
const ClientMetricReportDirection_1 = require("../clientmetricreport/ClientMetricReportDirection");
const ContentShareConstants_1 = require("../contentsharecontroller/ContentShareConstants");
const DefaultVideoStreamIdSet_1 = require("../videostreamidset/DefaultVideoStreamIdSet");
class LinkMediaStats {
    constructor() {
        this.bandwidthEstimateKbps = 0;
        this.usedBandwidthKbps = 0;
        this.packetsLost = 0;
        this.nackCount = 0;
        this.rttMs = 0;
    }
}
class VideoAdaptiveProbePolicy {
    constructor(logger, tileController) {
        this.logger = logger;
        this.tileController = tileController;
        this.reset();
    }
    reset() {
        this.optimalReceiveSet = new DefaultVideoStreamIdSet_1.default();
        this.subscribedReceiveSet = new DefaultVideoStreamIdSet_1.default();
        this.logCount = 0;
        this.startupPeriod = true;
        this.usingPrevTargetRate = false;
        this.rateProbeState = "Not Probing" /* kNotProbing */;
        this.timeFirstEstimate = 0;
        this.lastUpgradeRateKbps = 0;
        this.timeBeforeAllowSubscribeMs = VideoAdaptiveProbePolicy.MIN_TIME_BETWEEN_SUBSCRIBE;
        this.timeLastProbe = Date.now();
        this.timeBeforeAllowProbeMs = VideoAdaptiveProbePolicy.MIN_TIME_BETWEEN_PROBE;
        this.downlinkStats = new LinkMediaStats();
        this.prevDownlinkStats = new LinkMediaStats();
    }
    updateIndex(videoIndex) {
        this.videoIndex = videoIndex;
    }
    updateMetrics(clientMetricReport) {
        if (this.videoIndex.allStreams().empty()) {
            return;
        }
        this.prevDownlinkStats = this.downlinkStats;
        this.downlinkStats = new LinkMediaStats();
        const metricReport = clientMetricReport.getObservableMetrics();
        this.downlinkStats.bandwidthEstimateKbps = metricReport.availableReceiveBandwidth / 1000;
        for (const ssrcStr in clientMetricReport.streamMetricReports) {
            const ssrc = Number(ssrcStr);
            if (clientMetricReport.streamMetricReports[ssrc].direction === ClientMetricReportDirection_1.default.DOWNSTREAM) {
                // Only use video stream metrics
                if (clientMetricReport.streamMetricReports[ssrc].currentMetrics.hasOwnProperty('googNacksSent') &&
                    clientMetricReport.streamMetricReports[ssrc].currentMetrics.hasOwnProperty('googFrameRateReceived')) {
                    this.downlinkStats.nackCount += clientMetricReport.countPerSecond('googNacksSent', ssrc);
                }
                if (clientMetricReport.streamMetricReports[ssrc].currentMetrics.hasOwnProperty('packetsLost') &&
                    clientMetricReport.streamMetricReports[ssrc].currentMetrics.hasOwnProperty('googFrameRateReceived')) {
                    this.downlinkStats.packetsLost += clientMetricReport.countPerSecond('packetsLost', ssrc);
                }
                if (clientMetricReport.streamMetricReports[ssrc].currentMetrics.hasOwnProperty('bytesReceived')) {
                    this.downlinkStats.usedBandwidthKbps +=
                        clientMetricReport.bitsPerSecond('bytesReceived', ssrc) / 1000;
                }
            }
        }
    }
    wantsResubscribe() {
        this.optimalReceiveSet = this.calculateOptimalReceiveSet();
        return !this.subscribedReceiveSet.equal(this.optimalReceiveSet);
    }
    chooseSubscriptions() {
        if (!this.subscribedReceiveSet.equal(this.optimalReceiveSet)) {
            this.timeLastSubscribe = Date.now();
        }
        this.subscribedReceiveSet = this.optimalReceiveSet.clone();
        this.logger.info('bwe: chooseSubscriptions ' + JSON.stringify(this.subscribedReceiveSet));
        return this.subscribedReceiveSet.clone();
    }
    calculateOptimalReceiveSet() {
        const streamSelectionSet = new DefaultVideoStreamIdSet_1.default();
        const lastProbeState = this.rateProbeState;
        const remoteInfos = this.videoIndex.remoteStreamDescriptions();
        if (remoteInfos.length === 0) {
            return streamSelectionSet;
        }
        const pausedStreamIds = new DefaultVideoStreamIdSet_1.default();
        this.handlePausedStreams(streamSelectionSet, pausedStreamIds, remoteInfos);
        const sameStreamChoices = this.availStreamsSameAsLast(remoteInfos);
        // If no major changes then don't allow subscribes for the allowed amount of time
        if (!this.startupPeriod &&
            sameStreamChoices &&
            Date.now() - this.timeLastSubscribe < this.timeBeforeAllowSubscribeMs) {
            return this.optimalReceiveSet;
        }
        // reset time before allow subscribe to default
        this.timeBeforeAllowSubscribeMs = VideoAdaptiveProbePolicy.MIN_TIME_BETWEEN_SUBSCRIBE;
        const chosenStreams = [];
        // Sort streams by bitrate asceending.
        remoteInfos.sort((a, b) => {
            if (a.maxBitrateKbps === b.maxBitrateKbps) {
                return a.streamId - b.streamId;
            }
            return a.maxBitrateKbps - b.maxBitrateKbps;
        });
        // Convert 0 avg bitrates to max and handle special cases
        for (const info of remoteInfos) {
            if (info.avgBitrateKbps === 0 || info.avgBitrateKbps > info.maxBitrateKbps) {
                // Content can be a special case
                if (info.attendeeId.endsWith(ContentShareConstants_1.default.Modality) && info.maxBitrateKbps < 100) {
                    info.maxBitrateKbps = info.avgBitrateKbps;
                }
                else {
                    info.avgBitrateKbps = info.maxBitrateKbps;
                }
            }
        }
        const targetDownlinkBitrate = this.determineTargetRate(remoteInfos);
        let deltaToNextUpgrade = 0;
        let chosenTotalBitrate = 0;
        let upgradeStream;
        // If screen share is available, then subscribe to that first before anything else
        chosenTotalBitrate += this.chooseContent(chosenStreams, remoteInfos);
        // Try to have at least one stream from every group first
        // Since the streams are sorted this will pick the lowest bitrates first
        for (const info of remoteInfos) {
            if (info.avgBitrateKbps === 0) {
                continue;
            }
            if (chosenStreams.findIndex(stream => stream.groupId === info.groupId) === -1) {
                if (chosenTotalBitrate + info.avgBitrateKbps <= targetDownlinkBitrate) {
                    chosenStreams.push(info);
                    chosenTotalBitrate += info.avgBitrateKbps;
                }
                else if (deltaToNextUpgrade === 0) {
                    // Keep track of step to next upgrade
                    deltaToNextUpgrade = info.avgBitrateKbps;
                    upgradeStream = info;
                }
            }
        }
        // Look for upgrades until we run out of bandwidth
        let lookForUpgrades = true;
        while (lookForUpgrades) {
            // We will set this to true if we find any new upgrades during the loop over the
            // chosen streams (i.e. when we do a full loop without an upgrade we will give up)
            lookForUpgrades = false;
            chosenStreams.forEach((chosenStream, index) => {
                for (const info of remoteInfos) {
                    if (info.groupId === chosenStream.groupId &&
                        info.streamId !== chosenStream.streamId &&
                        info.avgBitrateKbps > chosenStream.avgBitrateKbps) {
                        const increaseKbps = info.avgBitrateKbps - chosenStream.avgBitrateKbps;
                        if (chosenTotalBitrate + increaseKbps <= targetDownlinkBitrate) {
                            chosenTotalBitrate += increaseKbps;
                            chosenStreams[index] = info;
                            lookForUpgrades = true;
                        }
                        else if (deltaToNextUpgrade === 0) {
                            // Keep track of step to next upgrade
                            deltaToNextUpgrade = increaseKbps;
                            upgradeStream = info;
                        }
                    }
                }
            });
        }
        let subscriptionChoice = 0 /* kNewOptimal */;
        // Look for probing or override opportunities
        if (!this.startupPeriod && sameStreamChoices && deltaToNextUpgrade !== 0) {
            if (this.rateProbeState === "Probing" /* kProbing */) {
                subscriptionChoice = this.handleProbe(chosenStreams, pausedStreamIds, targetDownlinkBitrate, remoteInfos);
            }
            else {
                subscriptionChoice = this.maybeOverrideOrProbe(chosenStreams, pausedStreamIds, targetDownlinkBitrate, chosenTotalBitrate, deltaToNextUpgrade, upgradeStream);
            }
        }
        else {
            // If there was a change in streams to choose from, then cancel any probing or upgrades
            this.setProbeState("Not Probing" /* kNotProbing */);
            this.lastUpgradeRateKbps = 0;
        }
        let decisionLogStr = this.policyStateLogStr(remoteInfos, targetDownlinkBitrate);
        if (this.logCount % 15 === 0 || this.rateProbeState !== lastProbeState) {
            this.logger.info(decisionLogStr);
            this.logCount = 0;
            decisionLogStr = '';
        }
        this.logCount++;
        this.prevTargetRateKbps = targetDownlinkBitrate;
        this.prevRemoteInfos = remoteInfos;
        if (subscriptionChoice === 1 /* kPreviousOptimal */) {
            this.logger.info('bwe: keepSameSubscriptions');
            if (decisionLogStr.length > 0) {
                this.logger.info(decisionLogStr);
            }
            return this.optimalReceiveSet;
        }
        else if (subscriptionChoice === 2 /* kPreProbe */) {
            const subscribedRate = this.calculateSubscribeRate(remoteInfos, this.preProbeReceiveSet);
            this.logger.info('bwe: Use Pre-Probe subscription subscribedRate:' + subscribedRate);
            return this.preProbeReceiveSet;
        }
        for (const chosenStream of chosenStreams) {
            streamSelectionSet.add(chosenStream.streamId);
        }
        if (!this.optimalReceiveSet.equal(streamSelectionSet)) {
            if (decisionLogStr.length > 0) {
                this.logger.info(decisionLogStr);
            }
            const subscribedRate = this.calculateSubscribeRate(remoteInfos, streamSelectionSet);
            this.logger.info(`bwe: new streamSelection: ${JSON.stringify(streamSelectionSet)} subscribedRate:${subscribedRate}`);
        }
        return streamSelectionSet;
    }
    determineTargetRate(remoteInfos) {
        let targetBitrate = 0;
        // Estimated downlink bandwidth from WebRTC is dependent on actually receiving data, so if it ever got driven below the bitrate of the lowest
        // stream (a simulcast stream), and it stops receiving, it will get stuck never being able to resubscribe (as is implemented).
        let minTargetDownlinkBitrate = Number.MAX_VALUE;
        for (const info of remoteInfos) {
            if (info.avgBitrateKbps !== 0 && info.avgBitrateKbps < minTargetDownlinkBitrate) {
                minTargetDownlinkBitrate = info.avgBitrateKbps;
            }
        }
        const now = Date.now();
        // Startup phase handling.  During this period the estimate can be 0 or
        // could still be slowly hunting for a steady state.  This startup ramp up
        // can cause a series of subscribes which can be distracting. During this
        // time just use our configured default value
        if (this.downlinkStats.bandwidthEstimateKbps !== 0) {
            if (this.timeFirstEstimate === 0) {
                this.timeFirstEstimate = now;
            }
            // handle startup state where estimator is still converging.
            if (this.startupPeriod) {
                // Drop out of startup period if
                // - estimate is above default
                // - get packet loss and have a valid estimate
                // - startup period has expired and rate is not still increasing
                if (this.downlinkStats.bandwidthEstimateKbps >
                    VideoAdaptiveProbePolicy.DEFAULT_BANDWIDTH_KBPS ||
                    this.downlinkStats.packetsLost > 0 ||
                    (now - this.timeFirstEstimate > VideoAdaptiveProbePolicy.STARTUP_PERIOD_MS &&
                        this.downlinkStats.bandwidthEstimateKbps <=
                            this.prevDownlinkStats.bandwidthEstimateKbps)) {
                    this.startupPeriod = false;
                    this.prevTargetRateKbps = this.downlinkStats.bandwidthEstimateKbps;
                }
            }
            // If we are in the startup period and we haven't detected any packet loss, then
            // keep it at the default to let the estimation get to a steady state
            if (this.startupPeriod) {
                targetBitrate = VideoAdaptiveProbePolicy.DEFAULT_BANDWIDTH_KBPS;
            }
            else {
                targetBitrate = this.downlinkStats.bandwidthEstimateKbps;
            }
        }
        else {
            if (this.timeFirstEstimate === 0) {
                targetBitrate = VideoAdaptiveProbePolicy.DEFAULT_BANDWIDTH_KBPS;
            }
            else {
                targetBitrate = this.prevTargetRateKbps;
            }
        }
        targetBitrate = Math.max(minTargetDownlinkBitrate, targetBitrate);
        // Estimated downlink rate can follow actual bandwidth or fall for a short period of time
        // due to the absolute send time estimator incorrectly thinking that a delay in packets is
        // a precursor to packet loss.  We have seen too many false positives on this, so we
        // will ignore largish drops in the estimate if there is no packet loss
        if (!this.startupPeriod &&
            ((this.usingPrevTargetRate &&
                this.downlinkStats.bandwidthEstimateKbps < this.prevTargetRateKbps) ||
                this.downlinkStats.bandwidthEstimateKbps <
                    (this.prevTargetRateKbps *
                        (100 - VideoAdaptiveProbePolicy.LARGE_RATE_CHANGE_TRIGGER_PERCENT)) /
                        100 ||
                this.downlinkStats.bandwidthEstimateKbps <
                    (this.downlinkStats.usedBandwidthKbps *
                        VideoAdaptiveProbePolicy.LARGE_RATE_CHANGE_TRIGGER_PERCENT) /
                        100) &&
            this.downlinkStats.packetsLost === 0) {
            // Set target to be the same as last
            this.logger.debug(() => {
                return 'bwe: ValidateRate: Using Previous rate ' + this.prevTargetRateKbps;
            });
            this.usingPrevTargetRate = true;
            targetBitrate = this.prevTargetRateKbps;
        }
        else {
            this.usingPrevTargetRate = false;
        }
        return targetBitrate;
    }
    setProbeState(newState) {
        if (this.rateProbeState === newState)
            return;
        const now = Date.now();
        switch (newState) {
            case "Not Probing" /* kNotProbing */:
                this.timeProbePendingStart = 0;
                break;
            case "Probe Pending" /* kProbePending */:
                if (this.timeLastProbe === 0 ||
                    now - this.timeLastProbe > VideoAdaptiveProbePolicy.MIN_TIME_BETWEEN_PROBE) {
                    this.timeProbePendingStart = now;
                }
                else {
                    // Too soon to do a probe again
                    return false;
                }
                break;
            case "Probing" /* kProbing */:
                if (now - this.timeProbePendingStart > this.timeBeforeAllowProbeMs) {
                    this.timeLastProbe = now;
                    this.preProbeReceiveSet = this.subscribedReceiveSet;
                    // Increase the time allowed until the next probe
                    this.timeBeforeAllowProbeMs = Math.min(this.timeBeforeAllowProbeMs * 2, VideoAdaptiveProbePolicy.MAX_HOLD_MS_BEFORE_PROBE);
                }
                else {
                    // Too soon to do probe
                    return false;
                }
                break;
            default:
                break;
        }
        this.logger.info('bwe: setProbeState to ' + newState + ' from ' + this.rateProbeState);
        this.rateProbeState = newState;
        return true;
    }
    // Upgrade the stream id from the appropriate group or add it if it wasn't already in the list.
    // Return the added amount of bandwidth
    upgradeToStream(chosenStreams, upgradeStream) {
        for (let i = 0; i < chosenStreams.length; i++) {
            if (chosenStreams[i].groupId === upgradeStream.groupId) {
                const diffRate = upgradeStream.avgBitrateKbps - chosenStreams[i].avgBitrateKbps;
                this.logger.info('bwe: upgradeStream from ' +
                    JSON.stringify(chosenStreams[i]) +
                    ' to ' +
                    JSON.stringify(upgradeStream));
                this.lastUpgradeRateKbps = diffRate;
                chosenStreams[i] = upgradeStream;
                return diffRate;
            }
        }
        // We are adding a stream and not upgrading.
        chosenStreams.push(upgradeStream);
        this.lastUpgradeRateKbps = upgradeStream.avgBitrateKbps;
        return this.lastUpgradeRateKbps;
    }
    // Do specific behavior while we are currently in probing state and metrics
    // indicate environment is still valid to do probing.
    // Return true if the caller should not change from the previous subscriptions.
    handleProbe(chosenStreams, pausedStreamIds, targetDownlinkBitrate, remoteInfos) {
        if (this.rateProbeState !== "Probing" /* kProbing */) {
            return 0 /* kNewOptimal */;
        }
        // Don't allow probe to happen indefinitely
        if (Date.now() - this.timeLastProbe > VideoAdaptiveProbePolicy.MAX_ALLOWED_PROBE_TIME_MS) {
            this.logger.info(`bwe: Canceling probe due to timeout`);
            this.setProbeState("Not Probing" /* kNotProbing */);
            return 0 /* kNewOptimal */;
        }
        if (this.downlinkStats.packetsLost > 0) {
            this.setProbeState("Not Probing" /* kNotProbing */);
            this.timeBeforeAllowSubscribeMs = VideoAdaptiveProbePolicy.MIN_TIME_BETWEEN_SUBSCRIBE * 3;
            return 2 /* kPreProbe */;
        }
        const subscribedRate = this.calculateSubscribeRate(remoteInfos, this.optimalReceiveSet);
        if (this.chosenStreamsSameAsLast(chosenStreams, pausedStreamIds) ||
            targetDownlinkBitrate > subscribedRate) {
            let avgRate = 0;
            for (const chosenStream of chosenStreams) {
                avgRate += chosenStream.avgBitrateKbps;
            }
            if (targetDownlinkBitrate > avgRate) {
                // If target bitrate can sustain probe rate, then probe was successful.
                this.setProbeState("Not Probing" /* kNotProbing */);
                // Reset the time allowed between probes since this was successful
                this.timeBeforeAllowProbeMs = VideoAdaptiveProbePolicy.MIN_TIME_BETWEEN_PROBE;
                return 0 /* kNewOptimal */;
            }
        }
        return 1 /* kPreviousOptimal */;
    }
    maybeOverrideOrProbe(chosenStreams, pausedStreamIds, chosenTotalBitrate, targetDownlinkBitrate, deltaToNextUpgrade, upgradeStream) {
        const sameSubscriptions = this.chosenStreamsSameAsLast(chosenStreams, pausedStreamIds);
        let useLastSubscriptions = 0 /* kNewOptimal */;
        const now = Date.now();
        // We want to minimize thrashing between between low res and high res of different
        // participants due to avg bitrate fluctuations. If there hasn't been much of a change in estimated bandwidth
        // and the number of streams and their max rates are the same, then reuse the previous subscription
        const triggerPercent = targetDownlinkBitrate > VideoAdaptiveProbePolicy.LOW_BITRATE_THRESHOLD_KBPS
            ? VideoAdaptiveProbePolicy.TARGET_RATE_CHANGE_TRIGGER_PERCENT
            : VideoAdaptiveProbePolicy.TARGET_RATE_CHANGE_TRIGGER_PERCENT * 2;
        const minTargetBitrateDelta = (targetDownlinkBitrate * triggerPercent) / 100;
        if (!sameSubscriptions &&
            Math.abs(targetDownlinkBitrate - this.prevTargetRateKbps) < minTargetBitrateDelta) {
            this.logger.info('bwe: MaybeOverrideOrProbe: Reuse last decision based on delta rate. {' +
                JSON.stringify(this.subscribedReceiveSet) +
                `}`);
            useLastSubscriptions = 1 /* kPreviousOptimal */;
        }
        // If there has been packet loss, then reset to no probing state
        if (this.downlinkStats.packetsLost > this.prevDownlinkStats.packetsLost) {
            this.setProbeState("Not Probing" /* kNotProbing */);
            this.lastUpgradeRateKbps = 0;
            return useLastSubscriptions;
        }
        if (sameSubscriptions || useLastSubscriptions) {
            // If planned subscriptions are same as last, then either move to probe pending state
            // or move to probing state if enough time has passed.
            switch (this.rateProbeState) {
                case "Not Probing" /* kNotProbing */:
                    this.setProbeState("Probe Pending" /* kProbePending */);
                    break;
                case "Probe Pending" /* kProbePending */:
                    if (now - this.timeProbePendingStart > this.timeBeforeAllowProbeMs) {
                        if (this.setProbeState("Probing" /* kProbing */)) {
                            this.timeBeforeAllowSubscribeMs = 800;
                            this.upgradeToStream(chosenStreams, upgradeStream);
                            useLastSubscriptions = 0 /* kNewOptimal */;
                        }
                    }
                    break;
                default:
                    this.logger.info('bwe: MaybeOverrideOrProbe: Unhandled condition ' + this.rateProbeState);
                    break;
            }
        }
        else {
            // At this point the current expectation is to subscribe for a new set of
            // streams, and environment is not right for probing.  If target rate is within
            // the threshold of doing an upgrade, then do it and if we are lucky will be the
            // same set of streams as last and no new subscription will be done.
            this.setProbeState("Not Probing" /* kNotProbing */);
            if (targetDownlinkBitrate + minTargetBitrateDelta > chosenTotalBitrate + deltaToNextUpgrade) {
                this.logger.info('bwe: MaybeOverrideOrProbe: Upgrade since we are within threshold');
                this.upgradeToStream(chosenStreams, upgradeStream);
            }
        }
        return useLastSubscriptions;
    }
    // Utility function to find max rate of streams in current decision
    calculateSubscribeRate(streams, streamSet) {
        let subscribeRate = 0;
        for (const index of streamSet.array()) {
            const streamMatch = streams.find(stream => stream.streamId === index);
            if (streamMatch !== undefined) {
                subscribeRate += streamMatch.maxBitrateKbps;
            }
        }
        return subscribeRate;
    }
    handlePausedStreams(streamSelectionSet, pausedStreamIds, remoteInfos) {
        const remoteTiles = this.tileController.getAllRemoteVideoTiles();
        for (let i = 0; i < remoteTiles.length; i++) {
            const tile = remoteTiles[i];
            const state = tile.state();
            if (state.paused) {
                let j = remoteInfos.length;
                while (j--) {
                    if (remoteInfos[j].attendeeId === state.boundAttendeeId) {
                        this.logger.info('bwe: removed paused attendee ' +
                            state.boundAttendeeId +
                            ' streamId: ' +
                            remoteInfos[j].streamId);
                        pausedStreamIds.add(remoteInfos[j].streamId);
                        // Add the stream to the selection set to keep the tile around
                        if (this.subscribedReceiveSet.contain(remoteInfos[j].streamId)) {
                            streamSelectionSet.add(remoteInfos[j].streamId);
                        }
                        remoteInfos.splice(j, 1);
                    }
                }
            }
        }
    }
    chooseContent(chosenStreams, remoteInfos) {
        let contentRate = 0;
        for (const info of remoteInfos) {
            // For now always subscribe to content even if higher bandwidth then target
            if (info.attendeeId.endsWith(ContentShareConstants_1.default.Modality)) {
                chosenStreams.push(info);
                contentRate += info.avgBitrateKbps;
            }
        }
        return contentRate;
    }
    availStreamsSameAsLast(remoteInfos) {
        if (this.prevRemoteInfos === undefined || remoteInfos.length !== this.prevRemoteInfos.length) {
            return false;
        }
        for (const info of remoteInfos) {
            const infoMatch = this.prevRemoteInfos.find(prevInfo => prevInfo.groupId === info.groupId &&
                prevInfo.streamId === info.streamId &&
                prevInfo.maxBitrateKbps === info.maxBitrateKbps);
            if (infoMatch === undefined) {
                return false;
            }
        }
        return true;
    }
    chosenStreamsSameAsLast(chosenStreams, pausedStreamIds) {
        const lastStreams = this.optimalReceiveSet.array();
        for (const id of lastStreams) {
            if (!pausedStreamIds.contain(id) &&
                chosenStreams.findIndex(chosenStream => chosenStream.streamId === id) === -1) {
                return false;
            }
        }
        return true;
    }
    policyStateLogStr(remoteInfos, targetDownlinkBitrate) {
        const subscribedRate = this.calculateSubscribeRate(remoteInfos, this.optimalReceiveSet);
        const optimalReceiveSet = {
            targetBitrate: targetDownlinkBitrate,
            subscribedRate: subscribedRate,
            probeState: this.rateProbeState,
            startupPeriod: this.startupPeriod,
        };
        // Reduced remote info logging:
        let remoteInfoStr = `remoteInfos: [`;
        for (const info of remoteInfos) {
            remoteInfoStr += `{grpId:${info.groupId} strId:${info.streamId} maxBr:${info.maxBitrateKbps} avgBr:${info.avgBitrateKbps}}, `;
        }
        remoteInfoStr += `]`;
        const logString = `bwe: optimalReceiveSet ${JSON.stringify(optimalReceiveSet)}\n` +
            `bwe:   prev ${JSON.stringify(this.prevDownlinkStats)}\n` +
            `bwe:   now  ${JSON.stringify(this.downlinkStats)}\n` +
            `bwe:   ${remoteInfoStr}`;
        return logString;
    }
}
exports.default = VideoAdaptiveProbePolicy;
VideoAdaptiveProbePolicy.DEFAULT_BANDWIDTH_KBPS = 2800;
VideoAdaptiveProbePolicy.STARTUP_PERIOD_MS = 6000;
VideoAdaptiveProbePolicy.LARGE_RATE_CHANGE_TRIGGER_PERCENT = 20;
VideoAdaptiveProbePolicy.TARGET_RATE_CHANGE_TRIGGER_PERCENT = 15;
VideoAdaptiveProbePolicy.LOW_BITRATE_THRESHOLD_KBPS = 300;
VideoAdaptiveProbePolicy.MIN_TIME_BETWEEN_PROBE = 5000;
VideoAdaptiveProbePolicy.MIN_TIME_BETWEEN_SUBSCRIBE = 2000;
VideoAdaptiveProbePolicy.MAX_HOLD_MS_BEFORE_PROBE = 60000;
VideoAdaptiveProbePolicy.MAX_ALLOWED_PROBE_TIME_MS = 60000;
//# sourceMappingURL=VideoAdaptiveProbePolicy.js.map