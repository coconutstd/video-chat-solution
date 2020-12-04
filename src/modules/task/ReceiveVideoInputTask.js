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
const SignalingProtocol_js_1 = require("../signalingprotocol/SignalingProtocol.js");
const BaseTask_1 = require("./BaseTask");
/**
 * [[ReceiveVideoInputTask]] acquires a video input from [[DeviceController]].
 */
class ReceiveVideoInputTask extends BaseTask_1.default {
    constructor(context) {
        super(context.logger);
        this.context = context;
        this.taskName = 'ReceiveVideoInputTask';
    }
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            // TODO: move videoDuplexMode and videoCaptureAndEncodeParameters to video tile controller
            const receiveEnabled = this.context.videoDuplexMode === SignalingProtocol_js_1.SdkStreamServiceType.RX ||
                this.context.videoDuplexMode === SignalingProtocol_js_1.SdkStreamServiceType.DUPLEX;
            if (this.context.videoTileController.hasStartedLocalVideoTile()) {
                this.context.videoDuplexMode = receiveEnabled
                    ? SignalingProtocol_js_1.SdkStreamServiceType.DUPLEX
                    : SignalingProtocol_js_1.SdkStreamServiceType.TX;
            }
            else {
                this.context.videoDuplexMode = receiveEnabled ? SignalingProtocol_js_1.SdkStreamServiceType.RX : 0;
            }
            this.context.videoCaptureAndEncodeParameter = this.context.videoUplinkBandwidthPolicy.chooseCaptureAndEncodeParameters();
            if (!this.context.videoTileController.hasStartedLocalVideoTile()) {
                this.context.logger.info('a video input is not enabled');
                if (this.context.activeVideoInput) {
                    this.stopVideoInput();
                }
                return;
            }
            // TODO: bind after ICE connection started in case of a failure to resubscribe
            //       or perform error handling to unbind video stream.
            const localTile = this.context.videoTileController.getLocalVideoTile();
            let videoInput = null;
            try {
                videoInput = yield this.context.mediaStreamBroker.acquireVideoInputStream();
            }
            catch (error) {
                this.context.logger.warn('could not acquire video input from current device');
            }
            if (this.context.enableSimulcast) {
                const encodingParams = this.context.videoUplinkBandwidthPolicy.chooseEncodingParameters();
                this.context.videoStreamIndex.integrateUplinkPolicyDecision(Array.from(encodingParams.values()));
            }
            this.context.activeVideoInput = videoInput;
            if (videoInput) {
                const videoTracks = videoInput.getVideoTracks();
                const attendeeId = this.context.meetingSessionConfiguration.credentials.attendeeId;
                const trackSettings = videoTracks[0].getSettings();
                if (this.context.enableSimulcast) {
                    const constraint = this.context.videoUplinkBandwidthPolicy.chooseMediaTrackConstraints();
                    this.context.logger.info(`simulcast: choose constraint ${JSON.stringify(constraint)}`);
                    try {
                        yield videoTracks[0].applyConstraints(constraint);
                    }
                    catch (error) {
                        this.context.logger.info('simulcast: pass video without more constraint');
                    }
                }
                const externalUserId = this.context.audioVideoController.configuration.credentials
                    .externalUserId;
                localTile.bindVideoStream(attendeeId, true, videoInput, trackSettings.width, trackSettings.height, null, externalUserId);
                for (let i = 0; i < videoTracks.length; i++) {
                    const track = videoTracks[i];
                    this.logger.info(`using video device label=${track.label} id=${track.id}`);
                    this.context.videoDeviceInformation['current_camera_name'] = track.label;
                    this.context.videoDeviceInformation['current_camera_id'] = track.id;
                }
            }
        });
    }
    stopVideoInput() {
        this.context.mediaStreamBroker.releaseMediaStream(this.context.activeVideoInput);
        this.context.activeVideoInput = null;
    }
}
exports.default = ReceiveVideoInputTask;
//# sourceMappingURL=ReceiveVideoInputTask.js.map