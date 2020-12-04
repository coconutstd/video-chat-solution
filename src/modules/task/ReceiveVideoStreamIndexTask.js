"use strict";
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const Maybe_1 = require("../maybe/Maybe");
const MeetingSessionVideoAvailability_1 = require("../meetingsession/MeetingSessionVideoAvailability");
const DefaultModality_1 = require("../modality/DefaultModality");
const SignalingClientEventType_1 = require("../signalingclient/SignalingClientEventType");
const SignalingProtocol_js_1 = require("../signalingprotocol/SignalingProtocol.js");
const BaseTask_1 = require("./BaseTask");
/*
 * [[ReceiveVideoStreamIndexTask]] receives [[SdkIndexFrame]] and updates [[VideoUplinkBandwidthPolicy]] and [[VideoDownlinkBandwidthPolicy]].
 */
class ReceiveVideoStreamIndexTask extends BaseTask_1.default {
    constructor(context) {
        super(context.logger);
        this.context = context;
        this.taskName = 'ReceiveVideoStreamIndexTask';
    }
    removeObserver() {
        this.context.signalingClient.removeObserver(this);
    }
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            this.handleIndexFrame(this.context.indexFrame);
            this.context.signalingClient.registerObserver(this);
            this.context.removableObservers.push(this);
        });
    }
    handleSignalingClientEvent(event) {
        if (event.type !== SignalingClientEventType_1.default.ReceivedSignalFrame ||
            event.message.type !== SignalingProtocol_js_1.SdkSignalFrame.Type.INDEX) {
            return;
        }
        // @ts-ignore: force cast to SdkIndexFrame
        const indexFrame = event.message.index;
        this.context.logger.info(`received new index ${JSON.stringify(indexFrame)}`);
        this.handleIndexFrame(indexFrame);
    }
    handleIndexFrame(indexFrame) {
        if (!indexFrame) {
            return;
        }
        // Filter out self content share video
        const selfAttendeeId = this.context.audioVideoController.configuration.credentials.attendeeId;
        indexFrame.sources = indexFrame.sources.filter(source => {
            const modality = new DefaultModality_1.default(source.attendeeId);
            return !(modality.base() === selfAttendeeId && modality.hasModality(DefaultModality_1.default.MODALITY_CONTENT));
        });
        const { videoStreamIndex, videoDownlinkBandwidthPolicy, videoUplinkBandwidthPolicy, } = this.context;
        const oldVideoSources = videoStreamIndex.allVideoSendingSourcesExcludingSelf(selfAttendeeId);
        videoStreamIndex.integrateIndexFrame(indexFrame);
        videoDownlinkBandwidthPolicy.updateIndex(videoStreamIndex);
        videoUplinkBandwidthPolicy.updateIndex(videoStreamIndex);
        this.resubscribe(videoDownlinkBandwidthPolicy, videoUplinkBandwidthPolicy);
        this.updateVideoAvailability(indexFrame);
        this.handleIndexVideosPausedAtSource();
        const newVideoSources = videoStreamIndex.allVideoSendingSourcesExcludingSelf(selfAttendeeId);
        if (!this.areVideoSourcesEqual(oldVideoSources, newVideoSources)) {
            this.context.audioVideoController.forEachObserver((observer) => {
                Maybe_1.default.of(observer.remoteVideoSourcesDidChange).map(f => f.bind(observer)(newVideoSources));
            });
        }
    }
    areVideoSourcesEqual(oldVideoSources, newVideoSources) {
        if (oldVideoSources.length !== newVideoSources.length) {
            return false;
        }
        const compare = (videoSourceA, videoSourceB) => videoSourceA.attendee.attendeeId.localeCompare(videoSourceB.attendee.attendeeId);
        const sortedOldVideoSources = [...oldVideoSources].sort(compare);
        const sortedNewVideoSources = [...newVideoSources].sort(compare);
        for (let i = 0; i < sortedOldVideoSources.length; i++) {
            if (sortedOldVideoSources[i].attendee.attendeeId !==
                sortedNewVideoSources[i].attendee.attendeeId) {
                return false;
            }
        }
        return true;
    }
    resubscribe(videoDownlinkBandwidthPolicy, videoUplinkBandwidthPolicy) {
        const resubscribeForDownlink = videoDownlinkBandwidthPolicy.wantsResubscribe();
        const resubscribeForUplink = (this.context.videoDuplexMode === SignalingProtocol_js_1.SdkStreamServiceType.TX ||
            this.context.videoDuplexMode === SignalingProtocol_js_1.SdkStreamServiceType.DUPLEX) &&
            videoUplinkBandwidthPolicy.wantsResubscribe();
        const shouldResubscribe = resubscribeForDownlink || resubscribeForUplink;
        this.logger.info(`should resubscribe: ${shouldResubscribe} (downlink: ${resubscribeForDownlink} uplink: ${resubscribeForUplink})`);
        if (!shouldResubscribe) {
            return;
        }
        this.context.videosToReceive = videoDownlinkBandwidthPolicy.chooseSubscriptions();
        this.context.videoCaptureAndEncodeParameter = videoUplinkBandwidthPolicy.chooseCaptureAndEncodeParameters();
        this.logger.info(`trigger resubscribe for up=${resubscribeForUplink} down=${resubscribeForDownlink}; videosToReceive=[${this.context.videosToReceive.array()}] captureParams=${JSON.stringify(this.context.videoCaptureAndEncodeParameter)}`);
        this.context.audioVideoController.update();
    }
    updateVideoAvailability(indexFrame) {
        if (!this.context.videosToReceive) {
            this.logger.error('videosToReceive must be set in the meeting context.');
            return;
        }
        const videoAvailability = new MeetingSessionVideoAvailability_1.default();
        videoAvailability.remoteVideoAvailable = !this.context.videosToReceive.empty();
        videoAvailability.canStartLocalVideo = !indexFrame.atCapacity;
        if (!this.context.lastKnownVideoAvailability ||
            !this.context.lastKnownVideoAvailability.equal(videoAvailability)) {
            this.context.lastKnownVideoAvailability = videoAvailability.clone();
            this.context.audioVideoController.forEachObserver((observer) => {
                Maybe_1.default.of(observer.videoAvailabilityDidChange).map(f => f.bind(observer)(videoAvailability.clone()));
            });
        }
    }
    handleIndexVideosPausedAtSource() {
        const streamsPausedAtSource = this.context.videoStreamIndex.streamsPausedAtSource();
        for (const tile of this.context.videoTileController.getAllVideoTiles()) {
            const tileState = tile.state();
            if (streamsPausedAtSource.contain(tileState.streamId)) {
                if (tile.markPoorConnection()) {
                    this.logger.info(`marks the tile ${tileState.tileId} as having a poor connection`);
                }
            }
            else {
                if (tile.unmarkPoorConnection()) {
                    this.logger.info(`unmarks the tile ${tileState.tileId} as having a poor connection`);
                }
            }
        }
    }
}
exports.default = ReceiveVideoStreamIndexTask;
//# sourceMappingURL=ReceiveVideoStreamIndexTask.js.map