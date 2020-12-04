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
const VideoLogEvent_1 = require("../statscollector/VideoLogEvent");
const BaseTask_1 = require("./BaseTask");
/*
 * [[AttachMediaInputTask]] adds audio and video input to peer connection.
 */
class AttachMediaInputTask extends BaseTask_1.default {
    constructor(context) {
        super(context.logger);
        this.context = context;
        this.taskName = 'AttachMediaInputTask';
    }
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            const transceiverController = this.context.transceiverController;
            transceiverController.setPeer(this.context.peer);
            transceiverController.setupLocalTransceivers();
            const audioInput = this.context.activeAudioInput;
            if (audioInput) {
                const audioTracks = audioInput.getAudioTracks();
                if (this.context.browserBehavior.requiresUnifiedPlan()) {
                    this.context.logger.info('attaching audio track to peer connection (unified-plan)');
                    yield transceiverController.setAudioInput(audioTracks.length ? audioTracks[0] : null);
                }
                else {
                    this.context.logger.info('attaching audio track to peer connection (plan-b)');
                    // @ts-ignore
                    const senders = this.context.peer.getSenders();
                    audioInput.getAudioTracks().forEach((track) => {
                        if (!senders.find((sender) => {
                            return sender.track.id === track.id;
                        })) {
                            // unclear why this does not deal with the case of removing
                            // an existing track as we do in attachVideoInput
                            // @ts-ignore
                            this.context.localAudioSender = this.context.peer.addTrack(track, audioInput);
                        }
                    });
                }
            }
            else {
                yield transceiverController.setAudioInput(null);
                this.context.logger.warn('no audio track');
            }
            const videoInput = this.context.activeVideoInput;
            if (videoInput) {
                const videoTracks = videoInput.getVideoTracks();
                const videoTrack = videoTracks.length ? videoTracks[0] : null;
                if (this.context.browserBehavior.requiresUnifiedPlan()) {
                    this.context.logger.info('attaching video track to peer connection (unified-plan)');
                    yield transceiverController.setVideoInput(videoTrack);
                    if (this.context.enableSimulcast && this.context.videoUplinkBandwidthPolicy) {
                        const encodingParam = this.context.videoUplinkBandwidthPolicy.chooseEncodingParameters();
                        transceiverController.setEncodingParameters(encodingParam);
                    }
                }
                else {
                    this.context.logger.info('attaching video track to peer connection (plan-b)');
                    // @ts-ignore
                    const senders = this.context.peer.getSenders();
                    if (!senders.find((sender) => {
                        return sender.track && sender.track.id === videoTracks[0].id;
                    })) {
                        if (this.context.localVideoSender) {
                            // @ts-ignore
                            this.context.peer.removeTrack(this.context.localVideoSender);
                            this.context.localVideoSender = null;
                        }
                        this.context.localVideoSender = this.context.peer.addTrack(videoTracks[0], videoInput);
                    }
                }
                if (videoTrack) {
                    this.context.statsCollector.logVideoEvent(VideoLogEvent_1.default.InputAttached, this.context.videoDeviceInformation);
                    this.context.videoInputAttachedTimestampMs = Date.now();
                }
            }
            else {
                yield transceiverController.setVideoInput(null);
                this.context.logger.info('no video track');
                if (this.context.localVideoSender) {
                    this.context.logger.info('removing track from peer');
                    // @ts-ignore
                    this.context.peer.removeTrack(this.context.localVideoSender);
                    this.context.localVideoSender = null;
                }
            }
            this.context.videoSubscriptions = transceiverController.updateVideoTransceivers(this.context.videoStreamIndex, this.context.videosToReceive);
        });
    }
}
exports.default = AttachMediaInputTask;
//# sourceMappingURL=AttachMediaInputTask.js.map