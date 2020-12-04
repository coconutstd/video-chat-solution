"use strict";
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * [[RealtimeState]] stores all realtime persistent state.
 */
class RealtimeState {
    constructor() {
        /**
         * Stores the attendee id of the current user
         */
        this.localAttendeeId = null;
        /**
         * Stores the external user id of the current user
         */
        this.localExternalUserId = null;
        /**
         * Callbacks to listen for attendee id changes
         */
        this.attendeeIdChangesCallbacks = [];
        /**
         * Stores whether the user can transition from muted to unmuted
         */
        this.canUnmute = true;
        /**
         * Callbacks to listen for changes to can-unmute local audio state
         */
        this.setCanUnmuteLocalAudioCallbacks = [];
        /**
         * Stores whether the user is presently muted
         */
        this.muted = false;
        /**
         * Callbacks to listen for local audio mutes and unmutes
         */
        this.muteAndUnmuteLocalAudioCallbacks = [];
        /**
         * Stores the active audio input
         */
        this.audioInput = null;
        /**
         * Stores per-attendee id volume indicator state
         */
        this.volumeIndicatorState = {};
        /**
         * Stores attendee id to external user id mappings
         */
        this.attendeeIdToExternalUserId = {};
        /**
         * Stores per-attendee id callbacks called when volume indicators change
         */
        this.volumeIndicatorCallbacks = {};
        /**
         * Callbacks to listen for changes to local signal strength
         */
        this.localSignalStrengthChangeCallbacks = [];
        /**
         * Callbacks to listen for fatal errors
         */
        this.fatalErrorCallbacks = [];
        /**
         * Callbacks to trigger when sending message
         */
        this.sendDataMessageCallbacks = [];
        /**
         * Callbacks to listen for receiving message from data channel based on given topic
         */
        this.receiveDataMessageCallbacks = new Map();
    }
}
exports.default = RealtimeState;
//# sourceMappingURL=RealtimeState.js.map