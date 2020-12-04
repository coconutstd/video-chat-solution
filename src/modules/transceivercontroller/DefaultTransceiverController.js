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
class DefaultTransceiverController {
    constructor(logger, browserBehavior) {
        this.logger = logger;
        this.browserBehavior = browserBehavior;
        this._localCameraTransceiver = null;
        this._localAudioTransceiver = null;
        this.videoSubscriptions = [];
        this.defaultMediaStream = null;
        this.peer = null;
    }
    setEncodingParameters(_params) {
        return;
    }
    static setVideoSendingBitrateKbpsForSender(sender, bitrateKbps, _logger) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!sender || bitrateKbps <= 0) {
                return;
            }
            const param = sender.getParameters();
            if (!param.encodings) {
                param.encodings = [{}];
            }
            for (const encodeParam of param.encodings) {
                encodeParam.maxBitrate = bitrateKbps * 1000;
            }
            yield sender.setParameters(param);
        });
    }
    static replaceAudioTrackForSender(sender, track) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!sender) {
                return false;
            }
            yield sender.replaceTrack(track);
            return true;
        });
    }
    localAudioTransceiver() {
        return this._localAudioTransceiver;
    }
    localVideoTransceiver() {
        return this._localCameraTransceiver;
    }
    setVideoSendingBitrateKbps(bitrateKbps) {
        return __awaiter(this, void 0, void 0, function* () {
            // this won't set bandwidth limitation for video in Chrome
            if (!this._localCameraTransceiver || this._localCameraTransceiver.direction !== 'sendrecv') {
                return;
            }
            const sender = this._localCameraTransceiver.sender;
            yield DefaultTransceiverController.setVideoSendingBitrateKbpsForSender(sender, bitrateKbps, this.logger);
        });
    }
    setPeer(peer) {
        this.peer = peer;
    }
    reset() {
        this._localCameraTransceiver = null;
        this._localAudioTransceiver = null;
        this.videoSubscriptions = [];
        this.defaultMediaStream = null;
        this.peer = null;
    }
    useTransceivers() {
        if (!this.peer || !this.browserBehavior.requiresUnifiedPlan()) {
            return false;
        }
        return typeof this.peer.getTransceivers !== 'undefined';
    }
    hasVideoInput() {
        if (!this._localCameraTransceiver || this._localCameraTransceiver.direction !== 'sendrecv')
            return false;
        return true;
    }
    trackIsVideoInput(track) {
        if (!this._localCameraTransceiver) {
            return false;
        }
        return (track === this._localCameraTransceiver.sender.track ||
            track === this._localCameraTransceiver.receiver.track);
    }
    setupLocalTransceivers() {
        if (!this.useTransceivers()) {
            return;
        }
        if (!this.defaultMediaStream && typeof MediaStream !== 'undefined') {
            this.defaultMediaStream = new MediaStream();
        }
        if (!this._localAudioTransceiver) {
            this._localAudioTransceiver = this.peer.addTransceiver('audio', {
                direction: 'inactive',
                streams: [this.defaultMediaStream],
            });
        }
        if (!this._localCameraTransceiver) {
            this._localCameraTransceiver = this.peer.addTransceiver('video', {
                direction: 'inactive',
                streams: [this.defaultMediaStream],
            });
        }
    }
    replaceAudioTrack(track) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this._localAudioTransceiver || this._localAudioTransceiver.direction !== 'sendrecv') {
                this.logger.info(`audio transceiver direction is not set up or not activated`);
                return false;
            }
            yield this._localAudioTransceiver.sender.replaceTrack(track);
            return true;
        });
    }
    setAudioInput(track) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.setTransceiverInput(this._localAudioTransceiver, track);
            return;
        });
    }
    setVideoInput(track) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.setTransceiverInput(this._localCameraTransceiver, track);
            return;
        });
    }
    updateVideoTransceivers(videoStreamIndex, videosToReceive) {
        if (!this.useTransceivers()) {
            return videosToReceive.array();
        }
        // See https://blog.mozilla.org/webrtc/rtcrtptransceiver-explored/ for details on transceivers
        const transceivers = this.peer.getTransceivers();
        // Subscription index 0 is reserved for transmitting camera.
        // We mark inactive slots with 0 in the subscription array.
        this.videoSubscriptions = [0];
        videosToReceive = videosToReceive.clone();
        this.updateTransceivers(transceivers, videoStreamIndex, videosToReceive);
        this.logger.debug(() => {
            return this.debugDumpTransceivers();
        });
        return this.videoSubscriptions;
    }
    updateTransceivers(transceivers, videoStreamIndex, videosToReceive) {
        const videosRemaining = videosToReceive.array();
        // Start by handling existing videos
        // Begin counting out index in the the subscription array at 1 since the camera.
        // Always occupies position 0 (whether active or not).
        let n = 1;
        for (const transceiver of transceivers) {
            if (transceiver === this._localCameraTransceiver || !this.transceiverIsVideo(transceiver)) {
                continue;
            }
            this.videoSubscriptions[n] = 0;
            if (transceiver.direction !== 'inactive') {
                // See if we want this existing transceiver
                // by convention with the video host, msid is equal to the media section mid, prefixed with the string "v_"
                // we use this to get the streamId for the track
                const streamId = videoStreamIndex.streamIdForTrack('v_' + transceiver.mid);
                if (streamId !== undefined) {
                    for (const [index, recvStreamId] of videosRemaining.entries()) {
                        if (videoStreamIndex.StreamIdsInSameGroup(streamId, recvStreamId)) {
                            transceiver.direction = 'recvonly';
                            this.videoSubscriptions[n] = recvStreamId;
                            videosRemaining.splice(index, 1);
                            break;
                        }
                    }
                }
            }
            n += 1;
        }
        // Next fill in open slots and remove unused
        n = 1;
        for (const transceiver of transceivers) {
            if (transceiver === this._localCameraTransceiver || !this.transceiverIsVideo(transceiver)) {
                continue;
            }
            if (transceiver.direction === 'inactive' && videosRemaining.length > 0) {
                // Fill available slot
                transceiver.direction = 'recvonly';
                const streamId = videosRemaining.shift();
                this.videoSubscriptions[n] = streamId;
            }
            else {
                // Remove if no longer subscribed
                if (this.videoSubscriptions[n] === 0) {
                    transceiver.direction = 'inactive';
                }
            }
            n += 1;
        }
        // add transceivers for the remaining subscriptions
        for (const index of videosRemaining) {
            // @ts-ignore
            const transceiver = this.peer.addTransceiver('video', {
                direction: 'recvonly',
                streams: [this.defaultMediaStream],
            });
            this.videoSubscriptions.push(index);
            this.logger.info(`adding transceiver mid: ${transceiver.mid} subscription: ${index} direction: recvonly`);
        }
    }
    transceiverIsVideo(transceiver) {
        return ((transceiver.receiver &&
            transceiver.receiver.track &&
            transceiver.receiver.track.kind === 'video') ||
            (transceiver.sender && transceiver.sender.track && transceiver.sender.track.kind === 'video'));
    }
    debugDumpTransceivers() {
        let msg = '';
        let n = 0;
        for (const transceiver of this.peer.getTransceivers()) {
            if (!this.transceiverIsVideo(transceiver)) {
                continue;
            }
            msg += `transceiver index=${n} mid=${transceiver.mid} subscription=${this.videoSubscriptions[n]} direction=${transceiver.direction}\n`;
            n += 1;
        }
        return msg;
    }
    setTransceiverInput(transceiver, track) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!transceiver) {
                return;
            }
            if (track) {
                transceiver.direction = 'sendrecv';
            }
            else {
                transceiver.direction = 'inactive';
            }
            yield transceiver.sender.replaceTrack(track);
        });
    }
}
exports.default = DefaultTransceiverController;
//# sourceMappingURL=DefaultTransceiverController.js.map