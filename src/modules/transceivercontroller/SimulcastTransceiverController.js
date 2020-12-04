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
const DefaultTransceiverController_1 = require("./DefaultTransceiverController");
class SimulcastTransceiverController extends DefaultTransceiverController_1.default {
    constructor(logger, browserBehavior) {
        super(logger, browserBehavior);
        this.videoQualityControlParameterMap = new Map();
        let scale = 4;
        for (let i = 0; i < SimulcastTransceiverController.NAME_ARR_ASCENDING.length; i++) {
            const ridName = SimulcastTransceiverController.NAME_ARR_ASCENDING[i];
            this.videoQualityControlParameterMap.set(ridName, {
                rid: ridName,
                scaleResolutionDownBy: scale,
                maxBitrate: SimulcastTransceiverController.BITRATE_ARR_ASCENDING[i] * 1000,
            });
            scale = scale / 2;
        }
    }
    setEncodingParameters(encodingParamMap) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this._localCameraTransceiver || this._localCameraTransceiver.direction !== 'sendrecv') {
                return;
            }
            const sender = this._localCameraTransceiver.sender;
            const newEncodingParams = Array.from(encodingParamMap.values());
            if (newEncodingParams.length <= 0) {
                return;
            }
            const oldParam = sender.getParameters();
            if (!oldParam.encodings) {
                oldParam.encodings = newEncodingParams;
            }
            else {
                for (let i = 0; i < oldParam.encodings.length; i++) {
                    if (oldParam.encodings[i].rid === SimulcastTransceiverController.LOW_LEVEL_NAME) {
                        oldParam.encodings[i].maxBitrate = encodingParamMap.get(SimulcastTransceiverController.LOW_LEVEL_NAME).maxBitrate;
                        oldParam.encodings[i].active = encodingParamMap.get(SimulcastTransceiverController.LOW_LEVEL_NAME).active;
                    }
                    if (oldParam.encodings[i].rid === SimulcastTransceiverController.MID_LEVEL_NAME) {
                        oldParam.encodings[i].maxBitrate = encodingParamMap.get(SimulcastTransceiverController.MID_LEVEL_NAME).maxBitrate;
                        oldParam.encodings[i].active = encodingParamMap.get(SimulcastTransceiverController.MID_LEVEL_NAME).active;
                    }
                    if (oldParam.encodings[i].rid === SimulcastTransceiverController.HIGH_LEVEL_NAME) {
                        oldParam.encodings[i].maxBitrate = encodingParamMap.get(SimulcastTransceiverController.HIGH_LEVEL_NAME).maxBitrate;
                        oldParam.encodings[i].active = encodingParamMap.get(SimulcastTransceiverController.HIGH_LEVEL_NAME).active;
                    }
                }
            }
            yield sender.setParameters(oldParam);
            this.logVideoTransceiverParameters();
        });
    }
    static replaceAudioTrackForSender(sender, track) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!sender) {
                return false;
            }
            yield sender.replaceTrack(track);
            return true;
        });
    }
    setVideoSendingBitrateKbps(_bitrateKbps) {
        return __awaiter(this, void 0, void 0, function* () {
            return;
        });
    }
    setupLocalTransceivers() {
        if (!this.useTransceivers()) {
            return;
        }
        if (!this.defaultMediaStream && typeof MediaStream !== 'undefined') {
            this.defaultMediaStream = new MediaStream();
        }
        if (!this._localAudioTransceiver) {
            this._localAudioTransceiver = this.peer.addTransceiver('audio', {
                direction: 'inactive',
                streams: [this.defaultMediaStream],
            });
        }
        if (!this._localCameraTransceiver) {
            const encodingParams = Array.from(this.videoQualityControlParameterMap.values());
            this._localCameraTransceiver = this.peer.addTransceiver('video', {
                direction: 'inactive',
                streams: [this.defaultMediaStream],
                sendEncodings: encodingParams,
            });
        }
    }
    logVideoTransceiverParameters() {
        const params = this._localCameraTransceiver.sender.getParameters();
        const encodings = params.encodings;
        let msg = 'simulcast: current encoding parameters \n';
        for (const encodingParam of encodings) {
            msg += `rid=${encodingParam.rid} maxBitrate=${encodingParam.maxBitrate} active=${encodingParam.active} \n`;
        }
        this.logger.info(msg);
    }
}
exports.default = SimulcastTransceiverController;
SimulcastTransceiverController.LOW_LEVEL_NAME = 'low';
SimulcastTransceiverController.MID_LEVEL_NAME = 'mid';
SimulcastTransceiverController.HIGH_LEVEL_NAME = 'hi';
SimulcastTransceiverController.NAME_ARR_ASCENDING = ['low', 'mid', 'hi'];
SimulcastTransceiverController.BITRATE_ARR_ASCENDING = [200, 400, 1100];
//# sourceMappingURL=SimulcastTransceiverController.js.map