"use strict";
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
const ConnectionHealthPolicyConfiguration_1 = require("../connectionhealthpolicy/ConnectionHealthPolicyConfiguration");
const AllHighestVideoBandwidthPolicy_1 = require("../videodownlinkbandwidthpolicy/AllHighestVideoBandwidthPolicy");
const NScaleVideoUplinkBandwidthPolicy_1 = require("../videouplinkbandwidthpolicy/NScaleVideoUplinkBandwidthPolicy");
const MeetingSessionCredentials_1 = require("./MeetingSessionCredentials");
const MeetingSessionURLs_1 = require("./MeetingSessionURLs");
/**
 * [[MeetingSessionConfiguration]] contains the information necessary to start
 * a session.
 */
class MeetingSessionConfiguration {
    /**
     * Constructs a MeetingSessionConfiguration optionally with a chime:CreateMeeting and
     * chime:CreateAttendee response. You can pass in either a JSON object containing the
     * responses, or a JSON object containing the information in the Meeting and Attendee
     * root-level fields. Examples:
     *
     * ```
     * const configuration = new MeetingSessionConfiguration({
     *   "Meeting": {
     *      "MeetingId": "...",
     *      "MediaPlacement": {
     *        "AudioHostUrl": "...",
     *        "ScreenDataUrl": "...",
     *        "ScreenSharingUrl": "...",
     *        "ScreenViewingUrl": "...",
     *        "SignalingUrl": "...",
     *        "TurnControlUrl": "..."
     *      }
     *    }
     *   }
     * }, {
     *   "Attendee": {
     *     "ExternalUserId": "...",
     *     "AttendeeId": "...",
     *     "JoinToken": "..."
     *   }
     * });
     * ```
     *
     * ```
     * const configuration = new MeetingSessionConfiguration({
     *   "MeetingId": "...",
     *   "MediaPlacement": {
     *     "AudioHostUrl": "...",
     *     "ScreenDataUrl": "...",
     *     "ScreenSharingUrl": "...",
     *     "ScreenViewingUrl": "...",
     *     "SignalingUrl": "...",
     *     "TurnControlUrl": "..."
     *   }
     * }, {
     *   "ExternalUserId": "...",
     *   "AttendeeId": "...",
     *   "JoinToken": "..."
     * });
     * ```
     */
    constructor(createMeetingResponse, createAttendeeResponse) {
        /**
         * The id of the meeting the session is joining.
         */
        this.meetingId = null;
        /**
         * The external meeting id of the meeting the session is joining.
         */
        this.externalMeetingId = null;
        /**
         * The credentials used to authenticate the session.
         */
        this.credentials = null;
        /**
         * The URLs the session uses to reach the meeting service.
         */
        this.urls = null;
        /**
         * Maximum amount of time in milliseconds to allow for connecting.
         */
        this.connectionTimeoutMs = 15000;
        /**
         * Maximum amount of time in milliseconds to allow for a screen sharing connection.
         */
        this.screenSharingTimeoutMs = 5000;
        /**
         * Maximum amount of time in milliseconds to allow for a screen viewing connection.
         */
        this.screenViewingTimeoutMs = 5000;
        /**
         * Maximum amount of time in milliseconds to wait for the current attendee to be present
         * after initial connection.
         */
        this.attendeePresenceTimeoutMs = 0;
        /**
         * Configuration for connection health policies: reconnection, unusable audio warning connection,
         * and signal strength bars connection.
         */
        this.connectionHealthPolicyConfiguration = new ConnectionHealthPolicyConfiguration_1.default();
        /**
         * Feature flag to enable Chromium-based browsers
         */
        this.enableUnifiedPlanForChromiumBasedBrowsers = true;
        /**
         * Feature flag to enable Simulcast
         */
        this.enableSimulcastForUnifiedPlanChromiumBasedBrowsers = false;
        /**
         * Video downlink bandwidth policy to determine which remote videos
         * are subscribed to.
         */
        this.videoDownlinkBandwidthPolicy = null;
        /**
         * Video uplink bandwidth policy to determine the bandwidth constraints
         * of the local video.
         */
        this.videoUplinkBandwidthPolicy = null;
        if (createMeetingResponse) {
            createMeetingResponse = this.toLowerCasePropertyNames(createMeetingResponse);
            if (createMeetingResponse.meeting) {
                createMeetingResponse = createMeetingResponse.meeting;
            }
            this.meetingId = createMeetingResponse.meetingid;
            this.externalMeetingId = createMeetingResponse.externalmeetingid;
            this.urls = new MeetingSessionURLs_1.default();
            this.urls.audioHostURL = createMeetingResponse.mediaplacement.audiohosturl;
            this.urls.screenDataURL = createMeetingResponse.mediaplacement.screendataurl;
            this.urls.screenSharingURL = createMeetingResponse.mediaplacement.screensharingurl;
            this.urls.screenViewingURL = createMeetingResponse.mediaplacement.screenviewingurl;
            this.urls.signalingURL = createMeetingResponse.mediaplacement.signalingurl;
            this.urls.turnControlURL = createMeetingResponse.mediaplacement.turncontrolurl;
        }
        if (createAttendeeResponse) {
            createAttendeeResponse = this.toLowerCasePropertyNames(createAttendeeResponse);
            if (createAttendeeResponse.attendee) {
                createAttendeeResponse = createAttendeeResponse.attendee;
            }
            this.credentials = new MeetingSessionCredentials_1.default();
            this.credentials.attendeeId = createAttendeeResponse.attendeeid;
            this.credentials.externalUserId = createAttendeeResponse.externaluserid;
            this.credentials.joinToken = createAttendeeResponse.jointoken;
        }
        // simulcast feature flag will override the following policies when DefaultAudioVideoController is created
        this.videoDownlinkBandwidthPolicy = new AllHighestVideoBandwidthPolicy_1.default(this.credentials ? this.credentials.attendeeId : null);
        this.videoUplinkBandwidthPolicy = new NScaleVideoUplinkBandwidthPolicy_1.default(this.credentials ? this.credentials.attendeeId : null);
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    toLowerCasePropertyNames(input) {
        if (input === null) {
            return null;
        }
        else if (typeof input !== 'object') {
            return input;
        }
        else if (Array.isArray(input)) {
            return input.map(this.toLowerCasePropertyNames);
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return Object.keys(input).reduce((result, key) => {
            const value = input[key];
            const newValue = typeof value === 'object' ? this.toLowerCasePropertyNames(value) : value;
            result[key.toLowerCase()] = newValue;
            return result;
        }, {});
    }
}
exports.default = MeetingSessionConfiguration;
//# sourceMappingURL=MeetingSessionConfiguration.js.map