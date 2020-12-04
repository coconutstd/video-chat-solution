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
const DataMessage_1 = require("../datamessage/DataMessage");
const SignalingClientEventType_1 = require("../signalingclient/SignalingClientEventType");
const SignalingProtocol_js_1 = require("../signalingprotocol/SignalingProtocol.js");
const BaseTask_1 = require("./BaseTask");
class SendAndReceiveDataMessagesTask extends BaseTask_1.default {
    constructor(context) {
        super(context.logger);
        this.context = context;
        this.taskName = 'SendAndReceiveDataMessagesTask';
        this.sendDataMessageHandler = (topic, data, // eslint-disable-line @typescript-eslint/no-explicit-any
        lifetimeMs) => {
            if (this.context.signalingClient.ready()) {
                let uint8Data;
                if (data instanceof Uint8Array) {
                    uint8Data = data;
                }
                else if (typeof data === 'string') {
                    uint8Data = new TextEncoder().encode(data);
                }
                else {
                    uint8Data = new TextEncoder().encode(JSON.stringify(data));
                }
                this.validateDataMessage(topic, uint8Data, lifetimeMs);
                const message = SignalingProtocol_js_1.SdkDataMessagePayload.create();
                message.topic = topic;
                message.lifetimeMs = lifetimeMs;
                message.data = uint8Data;
                const messageFrame = SignalingProtocol_js_1.SdkDataMessageFrame.create();
                messageFrame.messages = [message];
                this.context.signalingClient.sendDataMessage(messageFrame);
            }
            else {
                throw new Error('Signaling client is not ready');
            }
        };
    }
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            this.context.removableObservers.push(this);
            this.context.signalingClient.registerObserver(this);
            this.context.realtimeController.realtimeSubscribeToSendDataMessage(this.sendDataMessageHandler);
        });
    }
    removeObserver() {
        this.context.realtimeController.realtimeUnsubscribeFromSendDataMessage(this.sendDataMessageHandler);
        this.context.signalingClient.removeObserver(this);
    }
    handleSignalingClientEvent(event) {
        if (event.type === SignalingClientEventType_1.default.ReceivedSignalFrame &&
            event.message.type === SignalingProtocol_js_1.SdkSignalFrame.Type.DATA_MESSAGE) {
            for (const message of event.message.dataMessage.messages) {
                const dataMessage = new DataMessage_1.default(message.ingestTimeNs / 1000000, message.topic, message.data, message.senderAttendeeId, message.senderExternalUserId, message.ingestTimeNs === 0);
                this.context.realtimeController.realtimeReceiveDataMessage(dataMessage);
            }
        }
    }
    validateDataMessage(topic, data, lifetimeMs) {
        if (!SendAndReceiveDataMessagesTask.TOPIC_REGEX.test(topic)) {
            throw new Error('Invalid topic');
        }
        if (data.length > SendAndReceiveDataMessagesTask.DATA_SIZE) {
            throw new Error('Data size has to be less than 2048 bytes');
        }
        if (lifetimeMs && lifetimeMs < 0) {
            throw new Error('The life time of the message has to be non negative');
        }
    }
}
exports.default = SendAndReceiveDataMessagesTask;
SendAndReceiveDataMessagesTask.TOPIC_REGEX = new RegExp(/^[a-zA-Z0-9_-]{1,36}$/);
SendAndReceiveDataMessagesTask.DATA_SIZE = 2048;
//# sourceMappingURL=SendAndReceiveDataMessagesTask.js.map