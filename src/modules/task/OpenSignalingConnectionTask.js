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
const SignalingClientConnectionRequest_1 = require("../signalingclient/SignalingClientConnectionRequest");
const SignalingClientEventType_1 = require("../signalingclient/SignalingClientEventType");
const BaseTask_1 = require("./BaseTask");
class OpenSignalingConnectionTask extends BaseTask_1.default {
    constructor(context) {
        super(context.logger);
        this.context = context;
        this.taskName = 'OpenSignalingConnectionTask';
        this.taskCanceler = null;
    }
    cancel() {
        if (this.taskCanceler) {
            this.taskCanceler.cancel();
            this.taskCanceler = null;
        }
    }
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            const configuration = this.context.meetingSessionConfiguration;
            this.context.signalingClient.openConnection(new SignalingClientConnectionRequest_1.default(configuration.urls.signalingURL, configuration.credentials.joinToken));
            const startTimeMs = Date.now();
            try {
                yield new Promise((resolve, reject) => {
                    class WebSocketOpenInterceptor {
                        constructor(signalingClient) {
                            this.signalingClient = signalingClient;
                        }
                        cancel() {
                            this.signalingClient.removeObserver(this);
                            reject(new Error(`OpenSignalingConnectionTask got canceled while waiting to open signaling connection`));
                        }
                        handleSignalingClientEvent(event) {
                            switch (event.type) {
                                case SignalingClientEventType_1.default.WebSocketOpen:
                                    this.signalingClient.removeObserver(this);
                                    resolve();
                                    break;
                                case SignalingClientEventType_1.default.WebSocketFailed:
                                    this.signalingClient.removeObserver(this);
                                    reject(new Error('WebSocket connection failed'));
                                    break;
                            }
                        }
                    }
                    const interceptor = new WebSocketOpenInterceptor(this.context.signalingClient);
                    this.context.signalingClient.registerObserver(interceptor);
                    this.taskCanceler = interceptor;
                });
            }
            catch (error) {
                throw error;
            }
            finally {
                this.context.signalingOpenDurationMs = Math.round(Date.now() - startTimeMs);
            }
        });
    }
}
exports.default = OpenSignalingConnectionTask;
//# sourceMappingURL=OpenSignalingConnectionTask.js.map