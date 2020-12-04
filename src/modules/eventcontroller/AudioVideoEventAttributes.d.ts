/**
 * [[AudioVideoEventAttributes]] describes an audio-video event.
 */
export default interface AudioVideoEventAttributes {
    maxVideoTileCount?: number;
    meetingDurationMs?: number;
    meetingErrorMessage?: string;
    meetingStatus?: string;
    poorConnectionCount?: number;
    retryCount?: number;
    signalingOpenDurationMs?: number;
}
