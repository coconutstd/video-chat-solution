"use strict";
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * [[SignalingClientJoin]] contains settings for the Join SignalFrame.
 */
class SignalingClientJoin {
    /** Initializes a SignalingClientJoin with the given properties.
     *
     * @param {number} maxVideos The maximum number of video tiles to send.
     * @param {boolean} sendBitrates Whether the server should send Bitrates messages.
     */
    constructor(maxVideos, sendBitrates) {
        this.maxVideos = maxVideos;
        this.sendBitrates = sendBitrates;
    }
}
exports.default = SignalingClientJoin;
//# sourceMappingURL=SignalingClientJoin.js.map