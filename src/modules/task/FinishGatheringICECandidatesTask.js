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
 * [[FinishGatheringICECandidatesTask]] add ice-candidate event handler on peer connection to
 * collect ice candidates and wait for peer connection ice gathering state to complete
 */
class FinishGatheringICECandidatesTask extends BaseTask_1.default {
    constructor(context, chromeVpnTimeoutMs = FinishGatheringICECandidatesTask.CHROME_VPN_TIMEOUT_MS) {
        super(context.logger);
        this.context = context;
        this.chromeVpnTimeoutMs = chromeVpnTimeoutMs;
        this.taskName = 'FinishGatheringICECandidatesTask';
    }
    removeEventListener() {
        if (this.context.peer) {
            this.context.peer.removeEventListener('icecandidate', this.context.iceCandidateHandler);
            if (!this.context.turnCredentials) {
                this.context.peer.removeEventListener('icegatheringstatechange', this.context.iceGatheringStateEventHandler);
            }
        }
    }
    cancel() {
        let error = new Error(`canceling ${this.name()}`);
        // TODO: Remove when the Chrome VPN reconnect bug is fixed.
        // In Chrome, SDK may fail to establish TURN session after VPN reconnect.
        // https://bugs.chromium.org/p/webrtc/issues/detail?id=9097
        if (this.context.browserBehavior.requiresIceCandidateGatheringTimeoutWorkaround()) {
            if (this.chromeVpnTimeoutMs < this.context.meetingSessionConfiguration.connectionTimeoutMs) {
                const duration = Date.now() - this.startTimestampMs;
                if (duration > this.chromeVpnTimeoutMs) {
                    error = new Error(`canceling ${this.name()} due to the meeting status code: ${MeetingSessionStatusCode_1.default.ICEGatheringTimeoutWorkaround}`);
                }
            }
        }
        this.cancelPromise && this.cancelPromise(error);
    }
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.context.peer) {
                this.logAndThrow(`session does not have peer connection; bypass ice gathering`);
            }
            if (this.context.browserBehavior.requiresCheckForSdpConnectionAttributes()) {
                if (new DefaultSDP_1.default(this.context.peer.localDescription.sdp).hasCandidatesForAllMLines()) {
                    this.context.logger.info(`ice gathering already complete; bypass gathering, current local description ${this.context.peer.localDescription.sdp}`);
                    return;
                }
            }
            else {
                this.context.logger.info(`iOS device does not require checking for connection attributes in SDP, current local description ${this.context.peer.localDescription.sdp}`);
            }
            /*
             * To bypass waiting for events, it is required that "icegatheringstate" to be complete and sdp to have candidate
             * For Firefox, it takes long for iceGatheringState === 'complete'
             * Ref: https://github.com/aws/amazon-chime-sdk-js/issues/609
             */
            if ((this.context.browserBehavior.hasFirefoxWebRTC() ||
                this.context.peer.iceGatheringState === 'complete') &&
                new DefaultSDP_1.default(this.context.peer.localDescription.sdp).hasCandidates()) {
                this.context.logger.info('ice gathering state is complete and candidates are in SDP; bypass gathering');
                return;
            }
            yield new Promise((resolve, reject) => {
                this.cancelPromise = (error) => {
                    this.removeEventListener();
                    reject(error);
                };
                if (!this.context.turnCredentials) {
                    // if one day, we found a case where a FinishGatheringICECandidate did not resolve but ice gathering state is complete and SDP answer has ice candidates
                    // we may need to enable this
                    this.context.iceGatheringStateEventHandler = () => {
                        if (this.context.peer.iceGatheringState === 'complete') {
                            this.removeEventListener();
                            resolve();
                            return;
                        }
                    };
                    this.context.peer.addEventListener('icegatheringstatechange', this.context.iceGatheringStateEventHandler);
                }
                this.context.iceCandidateHandler = (event) => {
                    this.context.logger.info(`ice candidate: ${event.candidate ? event.candidate.candidate : '(null)'} state: ${this.context.peer.iceGatheringState}`);
                    // Ice candidate arrives, do not need to wait anymore.
                    // https://webrtcglossary.com/trickle-ice/
                    if (event.candidate) {
                        if (DefaultSDP_1.default.isRTPCandidate(event.candidate.candidate)) {
                            this.context.iceCandidates.push(event.candidate);
                        }
                        // Could there be a case the candidate is not written to SDP ?
                        if (this.context.turnCredentials && this.context.iceCandidates.length >= 1) {
                            this.context.logger.info('gathered at least one relay candidate');
                            this.removeEventListener();
                            resolve();
                            return;
                        }
                    }
                    // Ice candidate gathering is complete, additional barrier to make sure sdp contain an ice candidate.
                    // TODO: Could there be a race where iceGatheringState is flipped after this task is run ? This could only be handled if ice state is monitored persistently.
                    if (this.context.peer.iceGatheringState === 'complete') {
                        this.context.logger.info('done gathering ice candidates');
                        this.removeEventListener();
                        if (!new DefaultSDP_1.default(this.context.peer.localDescription.sdp).hasCandidates() ||
                            this.context.iceCandidates.length === 0) {
                            reject(new Error('no ice candidates were gathered'));
                        }
                        else {
                            resolve();
                        }
                    }
                };
                // SDK does not catch candidate itself and send to sever. Rather, WebRTC handles candidate events and writes candidate to SDP.
                this.context.peer.addEventListener('icecandidate', this.context.iceCandidateHandler);
                this.startTimestampMs = Date.now();
            });
        });
    }
}
exports.default = FinishGatheringICECandidatesTask;
FinishGatheringICECandidatesTask.CHROME_VPN_TIMEOUT_MS = 5000;
//# sourceMappingURL=FinishGatheringICECandidatesTask.js.map