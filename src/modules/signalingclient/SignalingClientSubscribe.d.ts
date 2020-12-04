import VideoStreamDescription from '../videostreamindex/VideoStreamDescription';
/**
 * [[SignalingClientSubscribe]] contains settings for the Subscribe SignalFrame.
 */
export default class SignalingClientSubscribe {
    attendeeId: string;
    sdpOffer: string;
    audioHost: string;
    audioMuted: boolean;
    audioCheckin: boolean;
    receiveStreamIds: number[];
    localVideoEnabled: boolean;
    videoStreamDescriptions: VideoStreamDescription[];
    connectionTypeHasVideo: boolean;
    /** Initializes a SignalingClientSubscribe with the given properties.
     *
     * @param{string} attendeeId Attendee ID of the client
     * @param{string} sdpOffer SDP offer created by WebRTC
     * @param{string} audioHost host
     * @param{boolean} audioMuted Whether audio from client is muted
     * @param{boolean} audioCheckin Whether audio is in checked-in state
     * @param{Array<number>} receiveStreamIds Which video streams to receive
     * @param{boolean} localVideoEnabled Whether to send a video stream for the local camera
     * @param{Array<VideoStreamDescription>} array of local video stream description
     * @param{boolean} connectionTypeHasVideo Whether connection type has video
     */
    constructor(attendeeId: string, sdpOffer: string, audioHost: string, audioMuted: boolean, audioCheckin: boolean, receiveStreamIds: number[], localVideoEnabled: boolean, videoStreamDescriptions: VideoStreamDescription[], connectionTypeHasVideo: boolean);
}
