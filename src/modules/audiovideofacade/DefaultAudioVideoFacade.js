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
class DefaultAudioVideoFacade {
    constructor(audioVideoController, videoTileController, realtimeController, audioMixController, deviceController, contentShareController) {
        this.audioVideoController = audioVideoController;
        this.videoTileController = videoTileController;
        this.realtimeController = realtimeController;
        this.audioMixController = audioMixController;
        this.deviceController = deviceController;
        this.contentShareController = contentShareController;
    }
    addObserver(observer) {
        this.audioVideoController.addObserver(observer);
        this.trace('addObserver');
    }
    removeObserver(observer) {
        this.audioVideoController.removeObserver(observer);
        this.trace('removeObserver');
    }
    setAudioProfile(audioProfile) {
        this.trace('setAudioProfile', audioProfile);
        this.audioVideoController.setAudioProfile(audioProfile);
    }
    start() {
        this.audioVideoController.start();
        this.trace('start');
    }
    stop() {
        this.audioVideoController.stop();
        this.trace('stop');
    }
    getRTCPeerConnectionStats(selector) {
        this.trace('getRTCPeerConnectionStats', selector ? selector.id : null);
        return this.audioVideoController.getRTCPeerConnectionStats(selector);
    }
    bindAudioElement(element) {
        const result = this.audioMixController.bindAudioElement(element);
        this.trace('bindAudioElement', element.id, result);
        return result;
    }
    unbindAudioElement() {
        this.audioMixController.unbindAudioElement();
        this.trace('unbindAudioElement');
    }
    bindVideoElement(tileId, videoElement) {
        this.videoTileController.bindVideoElement(tileId, videoElement);
        this.trace('bindVideoElement', { tileId: tileId, videoElementId: videoElement.id });
    }
    unbindVideoElement(tileId) {
        this.videoTileController.unbindVideoElement(tileId);
        this.trace('unbindVideoElement', tileId);
    }
    startLocalVideoTile() {
        const result = this.videoTileController.startLocalVideoTile();
        this.trace('startLocalVideoTile', null, result);
        return result;
    }
    stopLocalVideoTile() {
        this.videoTileController.stopLocalVideoTile();
        this.trace('stopLocalVideoTile');
    }
    hasStartedLocalVideoTile() {
        const result = this.videoTileController.hasStartedLocalVideoTile();
        this.trace('hasStartedLocalVideoTile', null, result);
        return result;
    }
    removeLocalVideoTile() {
        this.videoTileController.removeLocalVideoTile();
        this.trace('removeLocalVideoTile');
    }
    getLocalVideoTile() {
        const result = this.videoTileController.getLocalVideoTile();
        this.trace('getLocalVideoTile');
        return result;
    }
    pauseVideoTile(tileId) {
        this.videoTileController.pauseVideoTile(tileId);
        this.trace('pauseVideoTile', tileId);
    }
    unpauseVideoTile(tileId) {
        this.videoTileController.unpauseVideoTile(tileId);
        this.trace('unpauseVideoTile', tileId);
    }
    getVideoTile(tileId) {
        const result = this.videoTileController.getVideoTile(tileId);
        this.trace('getVideoTile', tileId);
        return result;
    }
    getAllRemoteVideoTiles() {
        const result = this.videoTileController.getAllRemoteVideoTiles();
        this.trace('getAllRemoteVideoTiles');
        return result;
    }
    getAllVideoTiles() {
        const result = this.videoTileController.getAllVideoTiles();
        this.trace('getAllVideoTiles');
        return result;
    }
    addVideoTile() {
        const result = this.videoTileController.addVideoTile();
        this.trace('addVideoTile', null, result.state());
        return result;
    }
    removeVideoTile(tileId) {
        this.videoTileController.removeVideoTile(tileId);
        this.trace('removeVideoTile', tileId);
    }
    removeVideoTilesByAttendeeId(attendeeId) {
        const result = this.videoTileController.removeVideoTilesByAttendeeId(attendeeId);
        this.trace('removeVideoTilesByAttendeeId', attendeeId, result);
        return result;
    }
    removeAllVideoTiles() {
        this.videoTileController.removeAllVideoTiles();
        this.trace('removeAllVideoTiles');
    }
    captureVideoTile(tileId) {
        const result = this.videoTileController.captureVideoTile(tileId);
        this.trace('captureVideoTile', tileId);
        return result;
    }
    realtimeSubscribeToAttendeeIdPresence(callback) {
        this.realtimeController.realtimeSubscribeToAttendeeIdPresence(callback);
        this.trace('realtimeSubscribeToAttendeeIdPresence');
    }
    realtimeUnsubscribeToAttendeeIdPresence(callback) {
        this.realtimeController.realtimeUnsubscribeToAttendeeIdPresence(callback);
        this.trace('realtimeUnsubscribeToAttendeeIdPresence');
    }
    realtimeSetCanUnmuteLocalAudio(canUnmute) {
        this.realtimeController.realtimeSetCanUnmuteLocalAudio(canUnmute);
        this.trace('realtimeSetCanUnmuteLocalAudio', canUnmute);
    }
    realtimeSubscribeToSetCanUnmuteLocalAudio(callback) {
        this.realtimeController.realtimeSubscribeToSetCanUnmuteLocalAudio(callback);
        this.trace('realtimeSubscribeToSetCanUnmuteLocalAudio');
    }
    realtimeUnsubscribeToSetCanUnmuteLocalAudio(callback) {
        this.realtimeController.realtimeUnsubscribeToSetCanUnmuteLocalAudio(callback);
    }
    realtimeCanUnmuteLocalAudio() {
        const result = this.realtimeController.realtimeCanUnmuteLocalAudio();
        this.trace('realtimeCanUnmuteLocalAudio', null, result);
        return result;
    }
    realtimeMuteLocalAudio() {
        this.realtimeController.realtimeMuteLocalAudio();
        this.trace('realtimeMuteLocalAudio');
    }
    realtimeUnmuteLocalAudio() {
        const result = this.realtimeController.realtimeUnmuteLocalAudio();
        this.trace('realtimeUnmuteLocalAudio');
        return result;
    }
    realtimeSubscribeToMuteAndUnmuteLocalAudio(callback) {
        this.realtimeController.realtimeSubscribeToMuteAndUnmuteLocalAudio(callback);
        this.trace('realtimeSubscribeToMuteAndUnmuteLocalAudio');
    }
    realtimeUnsubscribeToMuteAndUnmuteLocalAudio(callback) {
        this.realtimeController.realtimeUnsubscribeToMuteAndUnmuteLocalAudio(callback);
    }
    realtimeIsLocalAudioMuted() {
        const result = this.realtimeController.realtimeIsLocalAudioMuted();
        this.trace('realtimeIsLocalAudioMuted');
        return result;
    }
    realtimeSubscribeToVolumeIndicator(attendeeId, callback) {
        this.realtimeController.realtimeSubscribeToVolumeIndicator(attendeeId, callback);
        this.trace('realtimeSubscribeToVolumeIndicator', attendeeId);
    }
    realtimeUnsubscribeFromVolumeIndicator(attendeeId) {
        this.realtimeController.realtimeUnsubscribeFromVolumeIndicator(attendeeId);
        this.trace('realtimeUnsubscribeFromVolumeIndicator', attendeeId);
    }
    realtimeSubscribeToLocalSignalStrengthChange(callback) {
        this.realtimeController.realtimeSubscribeToLocalSignalStrengthChange(callback);
        this.trace('realtimeSubscribeToLocalSignalStrengthChange');
    }
    realtimeUnsubscribeToLocalSignalStrengthChange(callback) {
        this.realtimeController.realtimeUnsubscribeToLocalSignalStrengthChange(callback);
        this.trace('realtimeUnsubscribeToLocalSignalStrengthChange');
    }
    realtimeSendDataMessage(topic, // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data, lifetimeMs) {
        this.realtimeController.realtimeSendDataMessage(topic, data, lifetimeMs);
        this.trace('realtimeSendDataMessage');
    }
    realtimeSubscribeToReceiveDataMessage(topic, callback) {
        this.realtimeController.realtimeSubscribeToReceiveDataMessage(topic, callback);
        this.trace('realtimeSubscribeToReceiveDataMessage');
    }
    realtimeUnsubscribeFromReceiveDataMessage(topic) {
        this.realtimeController.realtimeUnsubscribeFromReceiveDataMessage(topic);
        this.trace('realtimeUnsubscribeFromReceiveDataMessage');
    }
    realtimeSubscribeToFatalError(callback) {
        this.realtimeController.realtimeSubscribeToFatalError(callback);
    }
    realtimeUnsubscribeToFatalError(callback) {
        this.realtimeController.realtimeUnsubscribeToFatalError(callback);
    }
    subscribeToActiveSpeakerDetector(policy, callback, scoresCallback, scoresCallbackIntervalMs) {
        this.audioVideoController.activeSpeakerDetector.subscribe(policy, callback, scoresCallback, scoresCallbackIntervalMs);
        this.trace('subscribeToActiveSpeakerDetector');
    }
    unsubscribeFromActiveSpeakerDetector(callback) {
        this.audioVideoController.activeSpeakerDetector.unsubscribe(callback);
        this.trace('unsubscribeFromActiveSpeakerDetector');
    }
    listAudioInputDevices() {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.deviceController.listAudioInputDevices();
            this.trace('listAudioInputDevices', null, result);
            return result;
        });
    }
    listVideoInputDevices() {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.deviceController.listVideoInputDevices();
            this.trace('listVideoInputDevices', null, result);
            return result;
        });
    }
    listAudioOutputDevices() {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.deviceController.listAudioOutputDevices();
            this.trace('listAudioOutputDevices', null, result);
            return result;
        });
    }
    chooseAudioInputDevice(device) {
        this.trace('chooseAudioInputDevice', device);
        return this.deviceController.chooseAudioInputDevice(device);
    }
    chooseVideoInputDevice(device) {
        this.trace('chooseVideoInputDevice', device);
        return this.deviceController.chooseVideoInputDevice(device);
    }
    chooseAudioOutputDevice(deviceId) {
        const result = this.deviceController.chooseAudioOutputDevice(deviceId);
        this.trace('chooseAudioOutputDevice', deviceId);
        return result;
    }
    addDeviceChangeObserver(observer) {
        this.deviceController.addDeviceChangeObserver(observer);
        this.trace('addDeviceChangeObserver');
    }
    removeDeviceChangeObserver(observer) {
        this.deviceController.removeDeviceChangeObserver(observer);
        this.trace('removeDeviceChangeObserver');
    }
    createAnalyserNodeForAudioInput() {
        const result = this.deviceController.createAnalyserNodeForAudioInput();
        this.trace('createAnalyserNodeForAudioInput');
        return result;
    }
    startVideoPreviewForVideoInput(element) {
        this.deviceController.startVideoPreviewForVideoInput(element);
        this.trace('startVideoPreviewForVideoInput', element.id);
    }
    stopVideoPreviewForVideoInput(element) {
        this.deviceController.stopVideoPreviewForVideoInput(element);
        this.trace('stopVideoPreviewForVideoInput', element.id);
    }
    setDeviceLabelTrigger(trigger) {
        this.deviceController.setDeviceLabelTrigger(trigger);
        this.trace('setDeviceLabelTrigger');
    }
    mixIntoAudioInput(stream) {
        const result = this.deviceController.mixIntoAudioInput(stream);
        this.trace('mixIntoAudioInput', stream.id);
        return result;
    }
    chooseVideoInputQuality(width, height, frameRate, maxBandwidthKbps) {
        this.deviceController.chooseVideoInputQuality(width, height, frameRate, maxBandwidthKbps);
        this.trace('chooseVideoInputQuality', {
            width: width,
            height: height,
            frameRate: frameRate,
            maxBandwidthKbps: maxBandwidthKbps,
        });
    }
    getVideoInputQualitySettings() {
        const result = this.deviceController.getVideoInputQualitySettings();
        this.trace('getVideoInputQualitySettings');
        return result;
    }
    setContentAudioProfile(audioProfile) {
        this.trace('setContentAudioProfile', audioProfile);
        this.contentShareController.setContentAudioProfile(audioProfile);
    }
    startContentShare(stream) {
        const result = this.contentShareController.startContentShare(stream);
        this.trace('startContentShare');
        return result;
    }
    startContentShareFromScreenCapture(sourceId, frameRate) {
        const result = this.contentShareController.startContentShareFromScreenCapture(sourceId, frameRate);
        this.trace('startContentShareFromScreenCapture');
        return result;
    }
    pauseContentShare() {
        this.contentShareController.pauseContentShare();
        this.trace('pauseContentShare');
    }
    unpauseContentShare() {
        this.contentShareController.unpauseContentShare();
        this.trace('unpauseContentShare');
    }
    stopContentShare() {
        this.contentShareController.stopContentShare();
        this.trace('stopContentShare');
    }
    addContentShareObserver(observer) {
        this.contentShareController.addContentShareObserver(observer);
        this.trace('addContentShareObserver');
    }
    removeContentShareObserver(observer) {
        this.contentShareController.removeContentShareObserver(observer);
        this.trace('removeContentShareObserver');
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    trace(name, input, output) {
        const meetingId = this.audioVideoController.configuration.meetingId;
        const attendeeId = this.audioVideoController.configuration.credentials.attendeeId;
        let s = `API/DefaultAudioVideoFacade/${meetingId}/${attendeeId}/${name}`;
        if (typeof input !== 'undefined') {
            s += ` ${JSON.stringify(input)}`;
        }
        if (typeof output !== 'undefined') {
            s += ` -> ${JSON.stringify(output)}`;
        }
        this.audioVideoController.logger.info(s);
    }
    getRemoteVideoSources() {
        const result = this.audioVideoController.getRemoteVideoSources();
        this.trace('getRemoteVideoSources', null, result);
        return result;
    }
}
exports.default = DefaultAudioVideoFacade;
//# sourceMappingURL=DefaultAudioVideoFacade.js.map