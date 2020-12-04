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
const SignalingClientEventType_1 = require("../signalingclient/SignalingClientEventType");
const SignalingProtocol_js_1 = require("../signalingprotocol/SignalingProtocol.js");
const BaseTask_1 = require("./BaseTask");
class ListenForVolumeIndicatorsTask extends BaseTask_1.default {
    constructor(context) {
        super(context.logger);
        this.context = context;
        this.taskName = 'ListenForVolumeIndicatorsTask';
        this.realtimeMuteAndUnmuteHandler = (muted) => {
            this.context.signalingClient.mute(muted);
        };
    }
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            this.context.removableObservers.push(this);
            this.context.signalingClient.registerObserver(this);
            this.context.realtimeController.realtimeSubscribeToMuteAndUnmuteLocalAudio(this.realtimeMuteAndUnmuteHandler);
        });
    }
    removeObserver() {
        this.context.realtimeController.realtimeUnsubscribeToMuteAndUnmuteLocalAudio(this.realtimeMuteAndUnmuteHandler);
        this.context.signalingClient.removeObserver(this);
    }
    handleSignalingClientEvent(event) {
        if (event.type !== SignalingClientEventType_1.default.ReceivedSignalFrame) {
            return;
        }
        if (event.message.type === SignalingProtocol_js_1.SdkSignalFrame.Type.AUDIO_STREAM_ID_INFO) {
            // @ts-ignore
            const audioStreamIdInfo = event.message.audioStreamIdInfo;
            this.context.volumeIndicatorAdapter.sendRealtimeUpdatesForAudioStreamIdInfo(audioStreamIdInfo);
        }
        else if (event.message.type === SignalingProtocol_js_1.SdkSignalFrame.Type.AUDIO_METADATA) {
            // @ts-ignore
            const audioMetadata = event.message.audioMetadata;
            this.context.volumeIndicatorAdapter.sendRealtimeUpdatesForAudioMetadata(audioMetadata);
        }
    }
}
exports.default = ListenForVolumeIndicatorsTask;
//# sourceMappingURL=ListenForVolumeIndicatorsTask.js.map