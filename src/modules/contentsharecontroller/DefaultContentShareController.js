"use strict";
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const Maybe_1 = require("../maybe/Maybe");
const MeetingSessionConfiguration_1 = require("../meetingsession/MeetingSessionConfiguration");
const MeetingSessionCredentials_1 = require("../meetingsession/MeetingSessionCredentials");
const DefaultModality_1 = require("../modality/DefaultModality");
const AsyncScheduler_1 = require("../scheduler/AsyncScheduler");
const ContentShareConstants_1 = require("./ContentShareConstants");
class DefaultContentShareController {
    constructor(mediaStreamBroker, contentAudioVideo, attendeeAudioVideo) {
        this.mediaStreamBroker = mediaStreamBroker;
        this.contentAudioVideo = contentAudioVideo;
        this.attendeeAudioVideo = attendeeAudioVideo;
        this.observerQueue = new Set();
        this.contentAudioVideo.addObserver(this);
        this.setupContentShareEvents();
    }
    static createContentShareMeetingSessionConfigure(configuration) {
        const contentShareConfiguration = new MeetingSessionConfiguration_1.default();
        contentShareConfiguration.meetingId = configuration.meetingId;
        contentShareConfiguration.externalMeetingId = configuration.externalMeetingId;
        contentShareConfiguration.urls = configuration.urls;
        contentShareConfiguration.credentials = new MeetingSessionCredentials_1.default();
        contentShareConfiguration.credentials.attendeeId =
            configuration.credentials.attendeeId + ContentShareConstants_1.default.Modality;
        contentShareConfiguration.credentials.externalUserId = configuration.credentials.externalUserId;
        contentShareConfiguration.credentials.joinToken =
            configuration.credentials.joinToken + ContentShareConstants_1.default.Modality;
        return contentShareConfiguration;
    }
    setContentAudioProfile(audioProfile) {
        this.contentAudioVideo.setAudioProfile(audioProfile);
    }
    startContentShare(stream) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!stream) {
                return;
            }
            this.mediaStreamBroker.mediaStream = stream;
            for (let i = 0; i < this.mediaStreamBroker.mediaStream.getTracks().length; i++) {
                this.mediaStreamBroker.mediaStream.getTracks()[i].addEventListener('ended', () => {
                    this.stopContentShare();
                });
            }
            this.contentAudioVideo.start();
            if (this.mediaStreamBroker.mediaStream.getVideoTracks().length > 0) {
                this.contentAudioVideo.videoTileController.startLocalVideoTile();
            }
        });
    }
    startContentShareFromScreenCapture(sourceId, frameRate) {
        return __awaiter(this, void 0, void 0, function* () {
            const mediaStream = yield this.mediaStreamBroker.acquireScreenCaptureDisplayInputStream(sourceId, frameRate);
            yield this.startContentShare(mediaStream);
            return mediaStream;
        });
    }
    pauseContentShare() {
        if (this.mediaStreamBroker.toggleMediaStream(false)) {
            this.forEachContentShareObserver(observer => {
                Maybe_1.default.of(observer.contentShareDidPause).map(f => f.bind(observer)());
            });
        }
    }
    unpauseContentShare() {
        if (this.mediaStreamBroker.toggleMediaStream(true)) {
            this.forEachContentShareObserver(observer => {
                Maybe_1.default.of(observer.contentShareDidUnpause).map(f => f.bind(observer)());
            });
        }
    }
    stopContentShare() {
        this.contentAudioVideo.stop();
        this.mediaStreamBroker.cleanup();
    }
    addContentShareObserver(observer) {
        this.observerQueue.add(observer);
    }
    removeContentShareObserver(observer) {
        this.observerQueue.delete(observer);
    }
    forEachContentShareObserver(observerFunc) {
        for (const observer of this.observerQueue) {
            new AsyncScheduler_1.default().start(() => {
                if (this.observerQueue.has(observer)) {
                    observerFunc(observer);
                }
            });
        }
    }
    audioVideoDidStop(_sessionStatus) {
        // If the content attendee got dropped or could not connect, stopContentShare will not be called
        // so make sure to clean up the media stream.
        this.mediaStreamBroker.cleanup();
        if (this.contentShareTile) {
            this.attendeeAudioVideo.videoTileController.removeVideoTile(this.contentShareTile.id());
            this.contentShareTile = null;
        }
        this.forEachContentShareObserver(observer => {
            Maybe_1.default.of(observer.contentShareDidStop).map(f => f.bind(observer)());
        });
    }
    setupContentShareEvents() {
        // We use realtimeSubscribeToAttendeeIdPresence instead of audioVideoDidStart because audioVideoDidStart fires
        // before the capacity check in Tincan while when realtimeSubscribeToAttendeeIdPresence fires, we know the
        // content attendee has been able to pass the capacity check and join the call so we can start the local
        // content share video
        this.attendeeAudioVideo.realtimeController.realtimeSubscribeToAttendeeIdPresence((attendeeId, present, _externalUserId, _dropped) => {
            const isContentAttendee = new DefaultModality_1.default(attendeeId).hasModality(DefaultModality_1.default.MODALITY_CONTENT);
            const isSelfAttendee = new DefaultModality_1.default(attendeeId).base() ===
                this.attendeeAudioVideo.configuration.credentials.attendeeId;
            if (!isContentAttendee || !isSelfAttendee || !present || this.contentShareTile) {
                return;
            }
            const stream = this.mediaStreamBroker.mediaStream;
            if (stream.getVideoTracks().length > 0) {
                this.contentShareTile = this.attendeeAudioVideo.videoTileController.addVideoTile();
                const track = stream.getVideoTracks()[0];
                let width, height;
                if (track.getSettings) {
                    const cap = track.getSettings();
                    width = cap.width;
                    height = cap.height;
                }
                else {
                    const cap = track.getCapabilities();
                    width = cap.width;
                    height = cap.height;
                }
                this.contentShareTile.bindVideoStream(this.contentAudioVideo.configuration.credentials.attendeeId, false, stream, width, height, null, this.contentAudioVideo.configuration.credentials.externalUserId);
            }
            this.forEachContentShareObserver(observer => {
                Maybe_1.default.of(observer.contentShareDidStart).map(f => f.bind(observer)());
            });
        });
    }
}
exports.default = DefaultContentShareController;
//# sourceMappingURL=DefaultContentShareController.js.map