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
const MeetingSessionStatusCode_1 = require("../meetingsession/MeetingSessionStatusCode");
const DefaultSDP_1 = require("../sdp/DefaultSDP");
const BaseTask_1 = require("./BaseTask");
/*
 * [[CreateSDPTask]] asynchronously calls [[createOffer]] on peer connection.
 */
class CreateSDPTask extends BaseTask_1.default {
    constructor(context) {
        super(context.logger);
        this.context = context;
        this.taskName = 'CreateSDPTask';
    }
    cancel() {
        const error = new Error(`canceling ${this.name()}`);
        this.cancelPromise && this.cancelPromise(error);
    }
    sessionUsesAudio() {
        return true;
    }
    sessionUsesVideo() {
        const enabled = true;
        let sending;
        if (this.context.transceiverController.useTransceivers()) {
            sending = this.context.transceiverController.hasVideoInput();
        }
        else {
            sending = this.context.videoTileController.hasStartedLocalVideoTile();
        }
        const receiving = !!this.context.videosToReceive && !this.context.videosToReceive.empty();
        const usesVideo = enabled && (sending || receiving);
        this.context.logger.info(`uses video: ${usesVideo} (enabled: ${enabled}, sending: ${sending}, receiving: ${receiving})`);
        return usesVideo;
    }
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            const offerOptions = {
                offerToReceiveAudio: this.sessionUsesAudio(),
                offerToReceiveVideo: this.sessionUsesVideo(),
            };
            this.logger.info(`peer connection offerOptions: ${JSON.stringify(offerOptions)}`);
            yield new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                this.cancelPromise = (error) => {
                    reject(error);
                };
                try {
                    this.context.sdpOfferInit = yield this.context.peer.createOffer(offerOptions);
                    this.context.logger.info('peer connection created offer');
                    if (this.context.previousSdpOffer) {
                        if (new DefaultSDP_1.default(this.context.sdpOfferInit.sdp).videoSendSectionHasDifferentSSRC(this.context.previousSdpOffer)) {
                            const error = new Error(`canceling ${this.name()} due to the meeting status code: ${MeetingSessionStatusCode_1.default.IncompatibleSDP}`);
                            this.context.previousSdpOffer = null;
                            reject(error);
                        }
                    }
                    resolve();
                }
                catch (error) {
                    reject(error);
                }
            }));
        });
    }
}
exports.default = CreateSDPTask;
//# sourceMappingURL=CreateSDPTask.js.map