"use strict";
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * [[MessagingSessionConfiguration]] contains the information necessary to start
 * a messaging session.
 */
/* eslint  @typescript-eslint/no-explicit-any: 0, @typescript-eslint/explicit-module-boundary-types: 0 */
class MessagingSessionConfiguration {
    /**
     * Constructs a MessagingSessionConfiguration optionally with userArn, messaging session id, a messaging session
     * endpoint URL, the chimeClient, and the AWSClient.
     * The messaging session id is to uniquely identify this messaging session for the userArn.
     * If messaging session id is passed in as null, it will be automatically generated.
     */
    constructor(userArn, messagingSessionId, endpointUrl, chimeClient, awsClient) {
        this.userArn = userArn;
        this.messagingSessionId = messagingSessionId;
        this.endpointUrl = endpointUrl;
        this.chimeClient = chimeClient;
        this.awsClient = awsClient;
        /**
         * Maximum amount of time in milliseconds to allow for reconnecting.
         */
        this.reconnectTimeoutMs = 10 * 1000;
        /**
         * Fixed wait amount in milliseconds between reconnecting attempts.
         */
        this.reconnectFixedWaitMs = 0;
        /**
         * The short back off time in milliseconds between reconnecting attempts.
         */
        this.reconnectShortBackoffMs = 1 * 1000;
        /**
         * The short back off time in milliseconds between reconnecting attempts.
         */
        this.reconnectLongBackoffMs = 5 * 1000;
        if (!this.messagingSessionId) {
            this.messagingSessionId = this.generateSessionId();
        }
    }
    generateSessionId() {
        const num = new Uint32Array(1);
        const randomNum = window.crypto.getRandomValues(num);
        return randomNum[0].toString();
    }
}
exports.default = MessagingSessionConfiguration;
//# sourceMappingURL=MessagingSessionConfiguration.js.map