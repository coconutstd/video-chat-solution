"use strict";
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
const SignalingClientEventType_1 = require("./SignalingClientEventType");
/*
 * [[SignalingClientEvent]] stores an event that can be sent to observers of the SignalingClient.
 */
class SignalingClientEvent {
    /** Initializes a SignalingClientEvent with the given SignalingClientEventType.
     *
     * @param {SignalingClient} client Indicates the SignalingClient associated with the event.
     * @param {SignalingClientEventType} type Indicates the kind of event.
     * @param {SdkSignalFrame} message SdkSignalFrame if type is ReceivedSignalFrame
     */
    constructor(client, type, message, closeCode, closeReason) {
        this.client = client;
        this.type = type;
        this.message = message;
        this.closeCode = closeCode;
        this.closeReason = closeReason;
        this.timestampMs = Date.now();
    }
    isConnectionTerminated() {
        switch (this.type) {
            case SignalingClientEventType_1.default.WebSocketFailed:
            case SignalingClientEventType_1.default.WebSocketError:
            case SignalingClientEventType_1.default.WebSocketClosing:
            case SignalingClientEventType_1.default.WebSocketClosed:
                return true;
            default:
                return false;
        }
    }
}
exports.default = SignalingClientEvent;
//# sourceMappingURL=SignalingClientEvent.js.map