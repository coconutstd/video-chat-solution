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
/**
 * [[LeaveAndReceiveLeaveAckTask]] sends a Leave frame and waits for a LeaveAck.
 */
class LeaveAndReceiveLeaveAckTask extends BaseTask_1.default {
    constructor(context) {
        super(context.logger);
        this.context = context;
        this.taskName = 'LeaveAndReceiveLeaveAckTask';
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
            if (this.context.signalingClient.ready()) {
                this.context.signalingClient.leave();
                this.context.logger.info('sent leave');
                yield this.receiveLeaveAck();
            }
        });
    }
    receiveLeaveAck() {
        return new Promise((resolve, reject) => {
            class Interceptor {
                constructor(signalingClient, logger) {
                    this.signalingClient = signalingClient;
                    this.logger = logger;
                }
                cancel() {
                    this.signalingClient.removeObserver(this);
                    reject(new Error(`LeaveAndReceiveLeaveAckTask got canceled while waiting for IndexFrame`));
                }
                handleSignalingClientEvent(event) {
                    if (event.isConnectionTerminated()) {
                        this.signalingClient.removeObserver(this);
                        this.logger.info('LeaveAndReceiveLeaveAckTask connection terminated');
                        // don't treat this as an error
                        resolve();
                        return;
                    }
                    if (event.type === SignalingClientEventType_1.default.ReceivedSignalFrame &&
                        event.message.type === SignalingProtocol_js_1.SdkSignalFrame.Type.LEAVE_ACK) {
                        this.signalingClient.removeObserver(this);
                        this.logger.info('got leave ack');
                        resolve();
                    }
                }
            }
            const interceptor = new Interceptor(this.context.signalingClient, this.context.logger);
            this.taskCanceler = interceptor;
            this.context.signalingClient.registerObserver(interceptor);
        });
    }
}
exports.default = LeaveAndReceiveLeaveAckTask;
//# sourceMappingURL=LeaveAndReceiveLeaveAckTask.js.map