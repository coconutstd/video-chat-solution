"use strict";
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * [[VideoTileState]] encapsulates the state of a [[VideoTile]]
 */
class VideoTileState {
    constructor() {
        /**
         * The unique identifier for the [[VideoTile]] managed by [[VideoTileController]]. Each attendee can have at most one tileId.
         */
        this.tileId = null;
        /**
         * Indication of whether tile is associated with local video.
         */
        this.localTile = false;
        /**
         * Indication of whether the tile associated with the local attendee has started to play.
         */
        this.localTileStarted = false;
        /**
         * Indication of whether the tile has content-sharing video.
         */
        this.isContent = false;
        /**
         * Indication of whether the tile has active video stream.
         */
        this.active = false;
        /**
         * Indication of whether the tile has paused video stream.
         */
        this.paused = false;
        /**
         * Indication of whether the remote video is paused at publishing attendee. This field is not supported.
         */
        this.poorConnection = false;
        /**
         * The attendee id associated with the [[VideoTile]].
         */
        this.boundAttendeeId = null;
        /**
         * The user id associated with the [[VideoTile]].
         */
        this.boundExternalUserId = null;
        /**
         * The video stream bound with the [[VideoTile]].
         */
        this.boundVideoStream = null;
        /**
         * The HTMLVideoElement bound with the [[VideoTile]].
         */
        this.boundVideoElement = null;
        /**
         * The nameplate for the [[VideoTile]]. SDK users should use boundExternalUserId for user id instead of this field.
         */
        this.nameplate = null;
        /**
         * The intrinsic width of the video stream upon binding with the [[VideoTile]].
         * Video stream intrinsic width could change and developers should use HTMLVideoElement listener for actual intrinsic width.
         */
        this.videoStreamContentWidth = null;
        /**
         * The intrinsic height of the video stream upon binding with the [[VideoTile]]
         * Video stream intrinsic height could change and developers should use HTMLVideoElement listener for actual intrinsic height.
         */
        this.videoStreamContentHeight = null;
        /**
         * The CSS width in pixel of the HTMLVideoElement upon binding with the [[VideoTile]].
         */
        this.videoElementCSSWidthPixels = null;
        /**
         * The CSS height in pixel of the HTMLVideoElement upon binding with the [[VideoTile]].
         */
        this.videoElementCSSHeightPixels = null;
        /**
         * The device pixel ratio of the current display monitor.
         */
        this.devicePixelRatio = 0;
        /**
         * The physical width in pixel of the HTMLVideoElement upon binding with the [[VideoTile]].
         */
        this.videoElementPhysicalWidthPixels = null;
        /**
         * The physical height in pixel of the HTMLVideoElement upon binding with the [[VideoTile]].
         */
        this.videoElementPhysicalHeightPixels = null;
        /**
         * The unique identifier published by server to associate with bound video stream. It is defined in [[SignalingProtocol.proto]].
         * Developers should avoid using this field directly.
         */
        this.streamId = null;
    }
    clone() {
        const cloned = new VideoTileState();
        cloned.tileId = this.tileId;
        cloned.localTile = this.localTile;
        cloned.isContent = this.isContent;
        cloned.active = this.active;
        cloned.paused = this.paused;
        cloned.poorConnection = this.poorConnection;
        cloned.boundAttendeeId = this.boundAttendeeId;
        cloned.boundExternalUserId = this.boundExternalUserId;
        cloned.boundVideoStream = this.boundVideoStream;
        cloned.boundVideoElement = this.boundVideoElement;
        cloned.nameplate = this.nameplate;
        cloned.videoStreamContentWidth = this.videoStreamContentWidth;
        cloned.videoStreamContentHeight = this.videoStreamContentHeight;
        cloned.videoElementCSSWidthPixels = this.videoElementCSSWidthPixels;
        cloned.videoElementCSSHeightPixels = this.videoElementCSSHeightPixels;
        cloned.devicePixelRatio = this.devicePixelRatio;
        cloned.videoElementPhysicalWidthPixels = this.videoElementPhysicalWidthPixels;
        cloned.videoElementPhysicalHeightPixels = this.videoElementPhysicalHeightPixels;
        cloned.streamId = this.streamId;
        return cloned;
    }
}
exports.default = VideoTileState;
//# sourceMappingURL=VideoTileState.js.map