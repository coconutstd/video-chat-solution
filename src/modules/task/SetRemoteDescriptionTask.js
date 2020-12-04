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
const DefaultBrowserBehavior_1 = require("../browserbehavior/DefaultBrowserBehavior");
const DefaultSDP_1 = require("../sdp/DefaultSDP");
const BaseTask_1 = require("./BaseTask");
/*
 * [[SetRemoteDescriptionTask]] asynchronously calls [[setRemoteDescription]] on the
 * peer connection and then waits for the tracks to be added and for the ICE connection
 * to complete.
 */
class SetRemoteDescriptionTask extends BaseTask_1.default {
    constructor(context) {
        super(context.logger);
        this.context = context;
        this.taskName = 'SetRemoteDescriptionTask';
    }
    cancel() {
        if (this.cancelICEPromise) {
            this.cancelICEPromise();
        }
    }
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            const peer = this.context.peer;
            if (!peer) {
                this.logAndThrow('session does not have peer connection; bypass set remote description');
            }
            let sdp = this.context.sdpAnswer;
            sdp = new DefaultSDP_1.default(sdp).withoutServerReflexiveCandidates().sdp;
            if (this.context.audioProfile) {
                sdp = new DefaultSDP_1.default(sdp).withAudioMaxAverageBitrate(this.context.audioProfile.audioBitrateBps).sdp;
            }
            if (!this.context.browserBehavior.requiresUnifiedPlan()) {
                // Under Plan B if our offer has video, but we're not going to subscribe to
                // any videos, ensure that the answer has video (marked inactive). If
                // it doesn't, WebRTC will reject the SDP answer. This happens on Chrome
                // when going from receiving one video to zero videos. The server does not
                // provide a video m-line when there are no videos available under Plan B,
                // thus we need to synthesize a video m-line by copying the one from the offer.
                this.logger.info('checking for no videos (plan-b)');
                if (this.context.videosToReceive.empty() && this.context.peer.remoteDescription) {
                    this.logger.info('have no videos and have remote description (plan-b)');
                    const sdpInactiveVideoOffer = this.context.peer.localDescription.sdp;
                    const sdpInactiveVideoAnswer = sdp;
                    let updatedAnswer = sdpInactiveVideoAnswer;
                    const offer = new DefaultSDP_1.default(sdpInactiveVideoOffer);
                    if (offer.hasVideo()) {
                        this.logger.info(`offer has video (plan-b): >>>${offer.sdp}<<<`);
                        const answer = new DefaultSDP_1.default(sdpInactiveVideoAnswer);
                        this.logger.info(`existing answer (plan-b): >>>${answer.sdp}<<<`);
                        if (!answer.hasVideo()) {
                            this.logger.info(`copying inactive video from offer into answer (plan-b); sdp answer before is >>>${sdpInactiveVideoAnswer}<<<`);
                            updatedAnswer = answer.copyVideo(sdpInactiveVideoOffer).sdp;
                        }
                    }
                    sdp = updatedAnswer;
                }
            }
            if (new DefaultBrowserBehavior_1.default().requiresSortCodecPreferencesForSdpAnswer()) {
                sdp = new DefaultSDP_1.default(sdp).preferH264IfExists().sdp;
            }
            this.logger.info(`processed remote description is >>>${sdp}<<<`);
            const remoteDescription = {
                type: 'answer',
                sdp: sdp,
                toJSON: null,
            };
            try {
                yield this.createICEConnectionCompletedPromise(remoteDescription);
            }
            catch (err) {
                throw err;
            }
        });
    }
    createICEConnectionCompletedPromise(remoteDescription) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const checkConnectionCompleted = () => {
                if (this.context.peer.iceConnectionState === 'connected' ||
                    this.context.peer.iceConnectionState === 'completed') {
                    this.context.peer.removeEventListener('iceconnectionstatechange', checkConnectionCompleted);
                    resolve();
                }
            };
            this.cancelICEPromise = () => {
                if (this.context.peer) {
                    this.context.peer.removeEventListener('iceconnectionstatechange', checkConnectionCompleted);
                }
                reject(new Error(`${this.name()} got canceled while waiting for the ICE connection state`));
            };
            this.context.peer.addEventListener('iceconnectionstatechange', checkConnectionCompleted);
            try {
                yield this.context.peer.setRemoteDescription(remoteDescription);
                this.logger.info('set remote description, waiting for ICE connection');
                checkConnectionCompleted();
            }
            catch (err) {
                reject(err);
            }
        }));
    }
}
exports.default = SetRemoteDescriptionTask;
//# sourceMappingURL=SetRemoteDescriptionTask.js.map