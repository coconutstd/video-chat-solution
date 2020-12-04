/**
 * [[VideoTileState]] encapsulates the state of a [[VideoTile]]
 */
export default class VideoTileState {
    /**
     * The unique identifier for the [[VideoTile]] managed by [[VideoTileController]]. Each attendee can have at most one tileId.
     */
    tileId: number | null;
    /**
     * Indication of whether tile is associated with local video.
     */
    localTile: boolean;
    /**
     * Indication of whether the tile associated with the local attendee has started to play.
     */
    localTileStarted: boolean;
    /**
     * Indication of whether the tile has content-sharing video.
     */
    isContent: boolean;
    /**
     * Indication of whether the tile has active video stream.
     */
    active: boolean;
    /**
     * Indication of whether the tile has paused video stream.
     */
    paused: boolean;
    /**
     * Indication of whether the remote video is paused at publishing attendee. This field is not supported.
     */
    poorConnection: boolean;
    /**
     * The attendee id associated with the [[VideoTile]].
     */
    boundAttendeeId: string | null;
    /**
     * The user id associated with the [[VideoTile]].
     */
    boundExternalUserId: string | null;
    /**
     * The video stream bound with the [[VideoTile]].
     */
    boundVideoStream: MediaStream | null;
    /**
     * The HTMLVideoElement bound with the [[VideoTile]].
     */
    boundVideoElement: HTMLVideoElement | null;
    /**
     * The nameplate for the [[VideoTile]]. SDK users should use boundExternalUserId for user id instead of this field.
     */
    nameplate: string | null;
    /**
     * The intrinsic width of the video stream upon binding with the [[VideoTile]].
     * Video stream intrinsic width could change and developers should use HTMLVideoElement listener for actual intrinsic width.
     */
    videoStreamContentWidth: number | null;
    /**
     * The intrinsic height of the video stream upon binding with the [[VideoTile]]
     * Video stream intrinsic height could change and developers should use HTMLVideoElement listener for actual intrinsic height.
     */
    videoStreamContentHeight: number | null;
    /**
     * The CSS width in pixel of the HTMLVideoElement upon binding with the [[VideoTile]].
     */
    videoElementCSSWidthPixels: number | null;
    /**
     * The CSS height in pixel of the HTMLVideoElement upon binding with the [[VideoTile]].
     */
    videoElementCSSHeightPixels: number | null;
    /**
     * The device pixel ratio of the current display monitor.
     */
    devicePixelRatio: number;
    /**
     * The physical width in pixel of the HTMLVideoElement upon binding with the [[VideoTile]].
     */
    videoElementPhysicalWidthPixels: number | null;
    /**
     * The physical height in pixel of the HTMLVideoElement upon binding with the [[VideoTile]].
     */
    videoElementPhysicalHeightPixels: number | null;
    /**
     * The unique identifier published by server to associate with bound video stream. It is defined in [[SignalingProtocol.proto]].
     * Developers should avoid using this field directly.
     */
    streamId: number | null;
    clone(): VideoTileState;
}
