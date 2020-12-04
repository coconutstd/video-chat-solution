"use strict";
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
exports.MeetingSessionStatusCode = void 0;
var MeetingSessionStatusCode;
(function (MeetingSessionStatusCode) {
    /**
     * Everything is OK so far.
     */
    MeetingSessionStatusCode[MeetingSessionStatusCode["OK"] = 0] = "OK";
    /**
     * The attendee left the meeting normally.
     */
    MeetingSessionStatusCode[MeetingSessionStatusCode["Left"] = 1] = "Left";
    /**
     * The attendee joined from another device.
     */
    MeetingSessionStatusCode[MeetingSessionStatusCode["AudioJoinedFromAnotherDevice"] = 2] = "AudioJoinedFromAnotherDevice";
    /**
     * The attendee should explicitly switch itself from joined with audio to
     * checked-in.
     */
    MeetingSessionStatusCode[MeetingSessionStatusCode["AudioDisconnectAudio"] = 3] = "AudioDisconnectAudio";
    /**
     * Authentication was rejected. The client is not allowed on this meeting.
     */
    MeetingSessionStatusCode[MeetingSessionStatusCode["AudioAuthenticationRejected"] = 4] = "AudioAuthenticationRejected";
    /**
     * The client can not join because the meeting is at capacity.
     */
    MeetingSessionStatusCode[MeetingSessionStatusCode["AudioCallAtCapacity"] = 5] = "AudioCallAtCapacity";
    /**
     * Deprecated. The meeting has ended. This is a legacy alias for MeetingEnded and will
     * be removed in v2.0.0.
     */
    MeetingSessionStatusCode[MeetingSessionStatusCode["AudioCallEnded"] = 6] = "AudioCallEnded";
    /**
     * Deprecated. The meeting has ended. This is a legacy alias for MeetingEnded and will
     * be removed in v2.0.0.
     */
    MeetingSessionStatusCode[MeetingSessionStatusCode["TURNMeetingEnded"] = 6] = "TURNMeetingEnded";
    /**
     * The meeting has ended.
     */
    MeetingSessionStatusCode[MeetingSessionStatusCode["MeetingEnded"] = 6] = "MeetingEnded";
    /**
     * There was an internal server error with the audio leg.
     */
    MeetingSessionStatusCode[MeetingSessionStatusCode["AudioInternalServerError"] = 7] = "AudioInternalServerError";
    /**
     * Could not connect the audio leg due to the service being unavailable.
     */
    MeetingSessionStatusCode[MeetingSessionStatusCode["AudioServiceUnavailable"] = 8] = "AudioServiceUnavailable";
    /**
     * The audio leg failed.
     */
    MeetingSessionStatusCode[MeetingSessionStatusCode["AudioDisconnected"] = 9] = "AudioDisconnected";
    /**
     * The client has asked to send and receive video, but it is only possible to
     * continue in view-only mode (receiving video). This should be handled by
     * explicitly switching to view-only mode.
     */
    MeetingSessionStatusCode[MeetingSessionStatusCode["VideoCallSwitchToViewOnly"] = 10] = "VideoCallSwitchToViewOnly";
    /** This can happen when you attempt to join a video meeting in "send only" mode
    (transmitting your camera, but not receiving anything -- this isn't something
    we ever do in practice, but it is supported on the server). It should be
    treated as "fatal" and probably should not be retried (despite the 5xx nature). */
    MeetingSessionStatusCode[MeetingSessionStatusCode["VideoCallAtSourceCapacity"] = 11] = "VideoCallAtSourceCapacity";
    /**
     * Bad request on JOIN or SUBSCRIBE
     */
    MeetingSessionStatusCode[MeetingSessionStatusCode["SignalingBadRequest"] = 12] = "SignalingBadRequest";
    /**
     * Internal server error on JOIN or SUBSCRIBE
     */
    MeetingSessionStatusCode[MeetingSessionStatusCode["SignalingInternalServerError"] = 13] = "SignalingInternalServerError";
    /**
     * Received unknown signaling error frame
     */
    MeetingSessionStatusCode[MeetingSessionStatusCode["SignalingRequestFailed"] = 14] = "SignalingRequestFailed";
    /**
     * Failed to transition between two states for some reason
     */
    MeetingSessionStatusCode[MeetingSessionStatusCode["StateMachineTransitionFailed"] = 15] = "StateMachineTransitionFailed";
    /**
     * Timed out gathering ICE candidates. If in Chrome, this could be an
     * indication that the browser is in a bad state due to a VPN reconnect and
     * the user should try quitting and relaunching the app. See:
     * https://bugs.chromium.org/p/webrtc/issues/detail?id=9097
     */
    MeetingSessionStatusCode[MeetingSessionStatusCode["ICEGatheringTimeoutWorkaround"] = 16] = "ICEGatheringTimeoutWorkaround";
    /**
     * Due to connection health, a reconnect has been triggered.
     */
    MeetingSessionStatusCode[MeetingSessionStatusCode["ConnectionHealthReconnect"] = 17] = "ConnectionHealthReconnect";
    /**
     * The realtime API failed in some way. This indicates a fatal problem.
     */
    MeetingSessionStatusCode[MeetingSessionStatusCode["RealtimeApiFailed"] = 18] = "RealtimeApiFailed";
    /**
     * A task failed for an unknown reason.
     */
    MeetingSessionStatusCode[MeetingSessionStatusCode["TaskFailed"] = 19] = "TaskFailed";
    /**
     * Audio device has switched.
     */
    MeetingSessionStatusCode[MeetingSessionStatusCode["AudioDeviceSwitched"] = 20] = "AudioDeviceSwitched";
    /**
     * Session update produces incompatible SDP.
     */
    MeetingSessionStatusCode[MeetingSessionStatusCode["IncompatibleSDP"] = 21] = "IncompatibleSDP";
    /**
     * This can happen when you attempt to join a meeting which has ended or attendee got removed
     */
    MeetingSessionStatusCode[MeetingSessionStatusCode["TURNCredentialsForbidden"] = 22] = "TURNCredentialsForbidden";
    /**
     * The attendee is not present.
     */
    MeetingSessionStatusCode[MeetingSessionStatusCode["NoAttendeePresent"] = 23] = "NoAttendeePresent";
})(MeetingSessionStatusCode = exports.MeetingSessionStatusCode || (exports.MeetingSessionStatusCode = {}));
exports.default = MeetingSessionStatusCode;
//# sourceMappingURL=MeetingSessionStatusCode.js.map