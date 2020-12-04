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
const MeetingSessionStatus_1 = require("../meetingsession/MeetingSessionStatus");
const MeetingSessionStatusCode_1 = require("../meetingsession/MeetingSessionStatusCode");
const MeetingSessionTURNCredentials_1 = require("../meetingsession/MeetingSessionTURNCredentials");
const SignalingClientEventType_1 = require("../signalingclient/SignalingClientEventType");
const SignalingClientJoin_1 = require("../signalingclient/SignalingClientJoin");
const SignalingProtocol_js_1 = require("../signalingprotocol/SignalingProtocol.js");
const BaseTask_1 = require("./BaseTask");
/*
 * [[JoinAndReceiveIndexTask]] sends the JoinFrame and asynchronously waits for the server to send the [[SdkIndexFrame]].
 * It should run with the [[TimeoutTask]] as the subtask so it can get canceled after timeout.
 */
class JoinAndReceiveIndexTask extends BaseTask_1.default {
    constructor(context) {
        super(context.logger);
        this.context = context;
        this.taskName = 'JoinAndReceiveIndexTask';
        this.taskCanceler = null;
        this.maxVideos = 16;
    }
    cancel() {
        if (this.taskCanceler) {
            this.taskCanceler.cancel();
            this.taskCanceler = null;
        }
    }
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            const indexFrame = yield new Promise((resolve, reject) => {
                const context = this.context;
                context.turnCredentials = null;
                class IndexFrameInterceptor {
                    constructor(signalingClient) {
                        this.signalingClient = signalingClient;
                    }
                    cancel() {
                        this.signalingClient.removeObserver(this);
                        reject(new Error(`JoinAndReceiveIndexTask got canceled while waiting for SdkIndexFrame`));
                    }
                    handleSignalingClientEvent(event) {
                        if (event.type === SignalingClientEventType_1.default.WebSocketClosed) {
                            context.logger.warn(`signaling connection closed by server with code ${event.closeCode} and reason: ${event.closeReason}`);
                            let statusCode = MeetingSessionStatusCode_1.default.SignalingBadRequest;
                            if (event.closeCode === 4410) {
                                context.logger.warn(`the meeting cannot be joined because it is has been ended`);
                                statusCode = MeetingSessionStatusCode_1.default.MeetingEnded;
                            }
                            else if (event.closeCode >= 4500 && event.closeCode < 4600) {
                                statusCode = MeetingSessionStatusCode_1.default.SignalingInternalServerError;
                            }
                            context.audioVideoController.handleMeetingSessionStatus(new MeetingSessionStatus_1.default(statusCode), null);
                            return;
                        }
                        if (event.type !== SignalingClientEventType_1.default.ReceivedSignalFrame) {
                            return;
                        }
                        if (event.message.type === SignalingProtocol_js_1.SdkSignalFrame.Type.JOIN_ACK) {
                            // @ts-ignore: force cast to SdkJoinAckFrame
                            const joinAckFrame = event.message.joinack;
                            if (joinAckFrame && joinAckFrame.turnCredentials) {
                                context.turnCredentials = new MeetingSessionTURNCredentials_1.default();
                                context.turnCredentials.username = joinAckFrame.turnCredentials.username;
                                context.turnCredentials.password = joinAckFrame.turnCredentials.password;
                                context.turnCredentials.ttl = joinAckFrame.turnCredentials.ttl;
                                context.turnCredentials.uris = joinAckFrame.turnCredentials.uris
                                    .map((uri) => {
                                    return context.meetingSessionConfiguration.urls.urlRewriter(uri);
                                })
                                    .filter((uri) => {
                                    return !!uri;
                                });
                            }
                            else {
                                context.logger.error('missing TURN credentials in JoinAckFrame');
                            }
                            return;
                        }
                        if (event.message.type !== SignalingProtocol_js_1.SdkSignalFrame.Type.INDEX) {
                            return;
                        }
                        this.signalingClient.removeObserver(this);
                        // @ts-ignore: force cast to SdkIndexFrame
                        const indexFrame = event.message.index;
                        resolve(indexFrame);
                    }
                }
                const interceptor = new IndexFrameInterceptor(this.context.signalingClient);
                this.context.signalingClient.registerObserver(interceptor);
                this.taskCanceler = interceptor;
                this.context.signalingClient.join(new SignalingClientJoin_1.default(this.maxVideos, true));
            });
            this.context.logger.info(`received first index ${JSON.stringify(indexFrame)}`);
            this.context.indexFrame = indexFrame;
        });
    }
}
exports.default = JoinAndReceiveIndexTask;
//# sourceMappingURL=JoinAndReceiveIndexTask.js.map