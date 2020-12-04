import AudioVideoEventAttributes from './AudioVideoEventAttributes';
import DeviceEventAttributes from './DeviceEventAttributes';
import MeetingHistoryState from './MeetingHistoryState';
/**
 * [[EventAttributes]] describes the event.
 */
export default interface EventAttributes extends AudioVideoEventAttributes, DeviceEventAttributes {
    attendeeId?: string;
    browserMajorVersion?: string;
    browserName?: string;
    browserVersion?: string;
    deviceName?: string;
    externalMeetingId?: string;
    externalUserId?: string;
    meetingHistory?: {
        name: MeetingHistoryState;
        timestampMs: number;
    }[];
    meetingId?: string;
    osName?: string;
    osVersion?: string;
    sdkName?: string;
    sdkVersion?: string;
    timestampMs?: number;
}
