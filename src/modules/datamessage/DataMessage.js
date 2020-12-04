"use strict";
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint @typescript-eslint/no-explicit-any: 0 */
class DataMessage {
    constructor(timestampMs, topic, data, senderAttendeeId, senderExternalUserId, throttled) {
        this.timestampMs = timestampMs;
        this.topic = topic;
        this.data = data;
        this.senderAttendeeId = senderAttendeeId;
        this.senderExternalUserId = senderExternalUserId;
        this.throttled = !!throttled;
    }
    /**
     * Helper conversion methods to convert Uint8Array data to string
     */
    text() {
        return new TextDecoder().decode(this.data);
    }
    /**
     * Helper conversion methods to convert Uint8Array data to JSON
     */
    json() {
        return JSON.parse(new TextDecoder().decode(this.data));
    }
}
exports.default = DataMessage;
//# sourceMappingURL=DataMessage.js.map