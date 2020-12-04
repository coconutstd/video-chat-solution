"use strict";
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
exports.MeetingSessionLifecycleEventCondition = void 0;
/**
 * [[MeetingSessionLifecycleEventCondition]] indicates the lifecycle event condition.
 * Add new enums to the bottom. We depend on these numbers for analytics.
 */
var MeetingSessionLifecycleEventCondition;
(function (MeetingSessionLifecycleEventCondition) {
    /**
     * The session is connecting for the first time.
     */
    MeetingSessionLifecycleEventCondition[MeetingSessionLifecycleEventCondition["ConnectingNew"] = 0] = "ConnectingNew";
    /**
     * The session was connected before and is now reconnecting.
     */
    MeetingSessionLifecycleEventCondition[MeetingSessionLifecycleEventCondition["ReconnectingExisting"] = 1] = "ReconnectingExisting";
    /**
     * The session successfully arrived in the started state for the first time.
     */
    MeetingSessionLifecycleEventCondition[MeetingSessionLifecycleEventCondition["StartedNew"] = 2] = "StartedNew";
    /**
     * The session successfully arrived in the started state but was connected before.
     * This can happen, for example, when the connection type changes.
     */
    MeetingSessionLifecycleEventCondition[MeetingSessionLifecycleEventCondition["StartedExisting"] = 3] = "StartedExisting";
    /**
     * The session successfully arrived in the started state following a reconnect.
     */
    MeetingSessionLifecycleEventCondition[MeetingSessionLifecycleEventCondition["StartedAfterReconnect"] = 4] = "StartedAfterReconnect";
    /**
     * The session stopped cleanly, probably due to leaving the call.
     */
    MeetingSessionLifecycleEventCondition[MeetingSessionLifecycleEventCondition["StoppedCleanly"] = 5] = "StoppedCleanly";
    /**
     * The session stopped due to a failure. A status code will indicate the cause of
     * the failure.
     */
    MeetingSessionLifecycleEventCondition[MeetingSessionLifecycleEventCondition["StoppedWithFailure"] = 6] = "StoppedWithFailure";
})(MeetingSessionLifecycleEventCondition = exports.MeetingSessionLifecycleEventCondition || (exports.MeetingSessionLifecycleEventCondition = {}));
exports.default = MeetingSessionLifecycleEventCondition;
//# sourceMappingURL=MeetingSessionLifecycleEventCondition.js.map