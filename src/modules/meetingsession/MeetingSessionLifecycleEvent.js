"use strict";
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
exports.MeetingSessionLifecycleEvent = void 0;
/**
 * [[MeetingSessionLifecycleEvent]] indicates the lifecycle status.
 * Add new enums to the bottom. We depend on these numbers for analytics.
 */
var MeetingSessionLifecycleEvent;
(function (MeetingSessionLifecycleEvent) {
    /**
     * The session is connecting, either to start a new call, or reconnect to an existing one.
     */
    MeetingSessionLifecycleEvent[MeetingSessionLifecycleEvent["Connecting"] = 0] = "Connecting";
    /**
     * The session successfully arrived in the started state either for the first time or
     * due to a change in connection type.
     */
    MeetingSessionLifecycleEvent[MeetingSessionLifecycleEvent["Started"] = 1] = "Started";
    /**
     * The session came to a stop, either from leaving or due to a failure.
     */
    MeetingSessionLifecycleEvent[MeetingSessionLifecycleEvent["Stopped"] = 2] = "Stopped";
})(MeetingSessionLifecycleEvent = exports.MeetingSessionLifecycleEvent || (exports.MeetingSessionLifecycleEvent = {}));
exports.default = MeetingSessionLifecycleEvent;
//# sourceMappingURL=MeetingSessionLifecycleEvent.js.map