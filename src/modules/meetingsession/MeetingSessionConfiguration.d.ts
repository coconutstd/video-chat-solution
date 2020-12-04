import ConnectionHealthPolicyConfiguration from '../connectionhealthpolicy/ConnectionHealthPolicyConfiguration';
import VideoDownlinkBandwidthPolicy from '../videodownlinkbandwidthpolicy/VideoDownlinkBandwidthPolicy';
import VideoUplinkBandwidthPolicy from '../videouplinkbandwidthpolicy/VideoUplinkBandwidthPolicy';
import MeetingSessionCredentials from './MeetingSessionCredentials';
import MeetingSessionURLs from './MeetingSessionURLs';
/**
 * [[MeetingSessionConfiguration]] contains the information necessary to start
 * a session.
 */
export default class MeetingSessionConfiguration {
    /**
     * The id of the meeting the session is joining.
     */
    meetingId: string | null;
    /**
     * The external meeting id of the meeting the session is joining.
     */
    externalMeetingId: string | null;
    /**
     * The credentials used to authenticate the session.
     */
    credentials: MeetingSessionCredentials | null;
    /**
     * The URLs the session uses to reach the meeting service.
     */
    urls: MeetingSessionURLs | null;
    /**
     * Maximum amount of time in milliseconds to allow for connecting.
     */
    connectionTimeoutMs: number;
    /**
     * Maximum amount of time in milliseconds to allow for a screen sharing connection.
     */
    screenSharingTimeoutMs: number;
    /**
     * Maximum amount of time in milliseconds to allow for a screen viewing connection.
     */
    screenViewingTimeoutMs: number;
    /**
     * Maximum amount of time in milliseconds to wait for the current attendee to be present
     * after initial connection.
     */
    attendeePresenceTimeoutMs: number;
    /**
     * Configuration for connection health policies: reconnection, unusable audio warning connection,
     * and signal strength bars connection.
     */
    connectionHealthPolicyConfiguration: ConnectionHealthPolicyConfiguration;
    /**
     * Feature flag to enable Chromium-based browsers
     */
    enableUnifiedPlanForChromiumBasedBrowsers: boolean;
    /**
     * Feature flag to enable Simulcast
     */
    enableSimulcastForUnifiedPlanChromiumBasedBrowsers: boolean;
    /**
     * Video downlink bandwidth policy to determine which remote videos
     * are subscribed to.
     */
    videoDownlinkBandwidthPolicy: VideoDownlinkBandwidthPolicy;
    /**
     * Video uplink bandwidth policy to determine the bandwidth constraints
     * of the local video.
     */
    videoUplinkBandwidthPolicy: VideoUplinkBandwidthPolicy;
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
    constructor(createMeetingResponse?: any, createAttendeeResponse?: any);
    private toLowerCasePropertyNames;
}
