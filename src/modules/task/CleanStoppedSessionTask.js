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
const BaseTask_1 = require("./BaseTask");
class CleanStoppedSessionTask extends BaseTask_1.default {
    constructor(context) {
        super(context.logger);
        this.context = context;
        this.taskName = 'CleanStoppedSessionTask';
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
            try {
                if (this.context.signalingClient.ready()) {
                    this.context.signalingClient.closeConnection();
                    yield this.receiveWebSocketClosedEvent();
                }
            }
            catch (error) {
                throw error;
            }
            finally {
                for (const observer of this.context.removableObservers) {
                    observer.removeObserver();
                }
                this.context.statsCollector.stop();
                this.context.statsCollector = null;
                this.context.connectionMonitor.stop();
                this.context.connectionMonitor = null;
                if (this.context.peer) {
                    this.context.peer.close();
                }
                this.context.peer = null;
                this.context.localVideoSender = null;
                this.context.sdpAnswer = null;
                this.context.sdpOfferInit = null;
                this.context.indexFrame = null;
                this.context.videoDownlinkBandwidthPolicy.reset();
                this.context.iceCandidateHandler = null;
                this.context.iceCandidates = [];
                this.context.turnCredentials = null;
                this.context.videoSubscriptions = null;
                this.context.transceiverController.reset();
                this.context.mediaStreamBroker.releaseMediaStream(this.context.activeAudioInput);
                this.context.activeAudioInput = null;
                this.context.mediaStreamBroker.releaseMediaStream(this.context.activeVideoInput);
                this.context.activeVideoInput = null;
                this.context.realtimeController.realtimeSetLocalAudioInput(null);
                const tile = this.context.videoTileController.getLocalVideoTile();
                if (tile) {
                    tile.bindVideoStream('', true, null, null, null, null);
                }
                this.context.videoTileController.removeAllVideoTiles();
            }
        });
    }
    receiveWebSocketClosedEvent() {
        return new Promise((resolve, reject) => {
            class Interceptor {
                constructor(signalingClient) {
                    this.signalingClient = signalingClient;
                }
                cancel() {
                    this.signalingClient.removeObserver(this);
                    reject(new Error(`CleanStoppedSessionTask got canceled while waiting for the WebSocket closed event`));
                }
                handleSignalingClientEvent(event) {
                    if (event.type === SignalingClientEventType_1.default.WebSocketClosed) {
                        this.signalingClient.removeObserver(this);
                        resolve();
                    }
                }
            }
            const interceptor = new Interceptor(this.context.signalingClient);
            this.taskCanceler = interceptor;
            this.context.signalingClient.registerObserver(interceptor);
        });
    }
}
exports.default = CleanStoppedSessionTask;
//# sourceMappingURL=CleanStoppedSessionTask.js.map