"use strict";
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
const DefaultBrowserBehavior_1 = require("../browserbehavior/DefaultBrowserBehavior");
const DefaultModality_1 = require("../modality/DefaultModality");
const AsyncScheduler_1 = require("../scheduler/AsyncScheduler");
const VideoTileState_1 = require("./VideoTileState");
class DefaultVideoTile {
    constructor(tileId, localTile, tileController, devicePixelRatioMonitor) {
        this.tileController = tileController;
        this.devicePixelRatioMonitor = devicePixelRatioMonitor;
        this.tileState = new VideoTileState_1.default();
        this.tileState.tileId = tileId;
        this.tileState.localTile = localTile;
        this.devicePixelRatioMonitor.registerObserver(this);
    }
    static connectVideoStreamToVideoElement(videoStream, videoElement, localTile) {
        const transform = localTile && videoStream.getVideoTracks()[0].getSettings().facingMode !== 'environment'
            ? 'rotateY(180deg)'
            : '';
        DefaultVideoTile.setVideoElementFlag(videoElement, 'disablePictureInPicture', localTile);
        DefaultVideoTile.setVideoElementFlag(videoElement, 'disableRemotePlayback', localTile);
        if (videoElement.style.transform !== transform) {
            videoElement.style.transform = transform;
        }
        if (videoElement.hasAttribute('controls')) {
            videoElement.removeAttribute('controls');
        }
        if (!videoElement.hasAttribute('autoplay')) {
            videoElement.setAttribute('autoplay', 'true');
        }
        // playsinline is needed for video to play in Iphone in non-fullscreen mode.
        // See https://developer.apple.com/documentation/webkit/safari_tools_and_features/delivering_video_content_for_safari#3030250
        if (!videoElement.hasAttribute('playsinline')) {
            videoElement.setAttribute('playsinline', 'true');
        }
        if (!videoElement.hasAttribute('muted')) {
            videoElement.setAttribute('muted', 'true');
        }
        if (videoElement.srcObject !== videoStream) {
            videoElement.srcObject = videoStream;
        }
    }
    static disconnectVideoStreamFromVideoElement(videoElement, dueToPause) {
        if (!videoElement) {
            return;
        }
        if (dueToPause) {
            videoElement.srcObject = null;
            videoElement.style.transform = '';
        }
        else {
            if (!videoElement.srcObject) {
                return;
            }
            videoElement.pause();
            videoElement.style.transform = '';
            DefaultVideoTile.setVideoElementFlag(videoElement, 'disablePictureInPicture', false);
            DefaultVideoTile.setVideoElementFlag(videoElement, 'disableRemotePlayback', false);
            // We must remove all the tracks from the MediaStream before
            // clearing the `srcObject` to prevent Safari from crashing.
            const mediaStream = videoElement.srcObject;
            const tracks = mediaStream.getTracks();
            for (const track of tracks) {
                track.stop();
                mediaStream.removeTrack(track);
            }
            // Need to yield the message loop before clearing `srcObject` to
            // prevent Safari from crashing.
            if (new DefaultBrowserBehavior_1.default().requiresVideoElementWorkaround()) {
                new AsyncScheduler_1.default().start(() => {
                    videoElement.srcObject = null;
                });
            }
            else {
                videoElement.srcObject = null;
            }
        }
    }
    destroy() {
        this.devicePixelRatioMonitor.removeObserver(this);
        if (this.tileState.boundVideoElement &&
            this.tileState.boundVideoElement.srcObject === this.tileState.boundVideoStream) {
            DefaultVideoTile.disconnectVideoStreamFromVideoElement(this.tileState.boundVideoElement, false);
        }
        this.tileState = new VideoTileState_1.default();
    }
    devicePixelRatioChanged(newDevicePixelRatio) {
        this.tileState.devicePixelRatio = newDevicePixelRatio;
        this.sendTileStateUpdate();
    }
    id() {
        return this.tileState.tileId;
    }
    state() {
        return this.tileState.clone();
    }
    stateRef() {
        return this.tileState;
    }
    bindVideoStream(attendeeId, localTile, mediaStream, contentWidth, contentHeight, streamId, externalUserId) {
        let tileUpdated = false;
        if (this.tileState.boundAttendeeId !== attendeeId) {
            this.tileState.boundAttendeeId = attendeeId;
            if (new DefaultModality_1.default(attendeeId).hasModality(DefaultModality_1.default.MODALITY_CONTENT)) {
                this.tileState.isContent = true;
            }
            tileUpdated = true;
        }
        if (this.tileState.boundExternalUserId !== externalUserId) {
            this.tileState.boundExternalUserId = externalUserId;
            tileUpdated = true;
        }
        if (this.tileState.localTile !== localTile) {
            this.tileState.localTile = localTile;
            tileUpdated = true;
        }
        if (this.tileState.boundVideoStream !== mediaStream) {
            this.tileState.boundVideoStream = mediaStream;
            tileUpdated = true;
        }
        if (this.tileState.videoStreamContentWidth !== contentWidth) {
            this.tileState.videoStreamContentWidth = contentWidth;
            tileUpdated = true;
        }
        if (this.tileState.videoStreamContentHeight !== contentHeight) {
            this.tileState.videoStreamContentHeight = contentHeight;
            tileUpdated = true;
        }
        if (this.tileState.streamId !== streamId) {
            this.tileState.streamId = streamId;
            tileUpdated = true;
        }
        if (tileUpdated) {
            this.sendTileStateUpdate();
        }
    }
    bindVideoElement(videoElement) {
        let tileUpdated = false;
        if (this.tileState.boundVideoElement !== videoElement) {
            this.tileState.boundVideoElement = videoElement;
            tileUpdated = true;
        }
        if (this.tileState.boundVideoElement !== null) {
            if (this.tileState.videoElementCSSWidthPixels !== videoElement.clientWidth) {
                this.tileState.videoElementCSSWidthPixels = videoElement.clientWidth;
                tileUpdated = true;
            }
            if (this.tileState.videoElementCSSHeightPixels !== videoElement.clientHeight) {
                this.tileState.videoElementCSSHeightPixels = videoElement.clientHeight;
                tileUpdated = true;
            }
        }
        else {
            this.tileState.videoElementCSSWidthPixels = null;
            this.tileState.videoElementCSSHeightPixels = null;
        }
        if (tileUpdated) {
            this.sendTileStateUpdate();
        }
    }
    pause() {
        if (!this.tileState.paused) {
            this.tileState.paused = true;
            this.sendTileStateUpdate();
        }
    }
    unpause() {
        if (this.tileState.paused) {
            this.tileState.paused = false;
            this.sendTileStateUpdate();
        }
    }
    markPoorConnection() {
        if (this.tileState.poorConnection) {
            return false;
        }
        this.tileState.poorConnection = true;
        this.sendTileStateUpdate();
        return true;
    }
    unmarkPoorConnection() {
        if (!this.tileState.poorConnection) {
            return false;
        }
        this.tileState.poorConnection = false;
        this.sendTileStateUpdate();
        return true;
    }
    capture() {
        if (!this.tileState.active) {
            return null;
        }
        const canvas = document.createElement('canvas');
        const video = this.tileState.boundVideoElement;
        canvas.width = video.videoWidth || video.width;
        canvas.height = video.videoHeight || video.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        return ctx.getImageData(0, 0, canvas.width, canvas.height);
    }
    sendTileStateUpdate() {
        this.updateActiveState();
        this.updateVideoStreamOnVideoElement();
        this.updateVideoElementPhysicalPixels();
        this.tileController.sendTileStateUpdate(this.state());
    }
    updateActiveState() {
        this.tileState.active = !!(!this.tileState.paused &&
            !this.tileState.poorConnection &&
            this.tileState.boundAttendeeId &&
            this.tileState.boundVideoElement &&
            this.tileState.boundVideoStream);
    }
    updateVideoElementPhysicalPixels() {
        if (typeof this.tileState.videoElementCSSWidthPixels === 'number' &&
            typeof this.tileState.videoElementCSSHeightPixels === 'number') {
            this.tileState.videoElementPhysicalWidthPixels =
                this.tileState.devicePixelRatio * this.tileState.videoElementCSSWidthPixels;
            this.tileState.videoElementPhysicalHeightPixels =
                this.tileState.devicePixelRatio * this.tileState.videoElementCSSHeightPixels;
        }
        else {
            this.tileState.videoElementPhysicalWidthPixels = null;
            this.tileState.videoElementPhysicalHeightPixels = null;
        }
    }
    updateVideoStreamOnVideoElement() {
        if (this.tileState.active) {
            DefaultVideoTile.connectVideoStreamToVideoElement(this.tileState.boundVideoStream, this.tileState.boundVideoElement, this.tileState.localTile);
        }
        else {
            DefaultVideoTile.disconnectVideoStreamFromVideoElement(this.tileState.boundVideoElement, this.tileState.paused);
        }
    }
    static setVideoElementFlag(videoElement, flag, value) {
        if (flag in videoElement) {
            // @ts-ignore
            videoElement[flag] = value;
        }
    }
}
exports.default = DefaultVideoTile;
//# sourceMappingURL=DefaultVideoTile.js.map