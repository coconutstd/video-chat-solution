"use strict";
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * [[MeetingSessionVideoAvailability]] contains the video availability information.
 */
class MeetingSessionVideoAvailability {
    constructor() {
        /**
         * Indicates whether one or more remote video streams
         * are available for streaming. This can be used to decide whether or not to
         * switch the connection type to include video.
         */
        this.remoteVideoAvailable = false;
        /**
         * Indicates whether the server has a slot available for
         * this client's local video tile. If the client is already sending a local
         * video tile, then this will be true. This property can be used to decide
         * whether to offer the option to start the local video tile.
         */
        this.canStartLocalVideo = false;
    }
    /**
     * Returns whether the fields are the same as that of another availability object.
     */
    equal(other) {
        return (this.remoteVideoAvailable === other.remoteVideoAvailable &&
            this.canStartLocalVideo === other.canStartLocalVideo);
    }
    /**
     * Returns a deep copy of this object.
     */
    clone() {
        const cloned = new MeetingSessionVideoAvailability();
        cloned.remoteVideoAvailable = this.remoteVideoAvailable;
        cloned.canStartLocalVideo = this.canStartLocalVideo;
        return cloned;
    }
}
exports.default = MeetingSessionVideoAvailability;
//# sourceMappingURL=MeetingSessionVideoAvailability.js.map