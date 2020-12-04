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
const DefaultBrowserBehavior_1 = require("../browserbehavior/DefaultBrowserBehavior");
const Maybe_1 = require("../maybe/Maybe");
const DefaultMediaDeviceFactory_1 = require("../mediadevicefactory/DefaultMediaDeviceFactory");
const AsyncScheduler_1 = require("../scheduler/AsyncScheduler");
const IntervalScheduler_1 = require("../scheduler/IntervalScheduler");
const DefaultVideoTile_1 = require("../videotile/DefaultVideoTile");
const AudioTransformDevice_1 = require("./AudioTransformDevice");
const DeviceSelection_1 = require("./DeviceSelection");
const GetUserMediaError_1 = require("./GetUserMediaError");
const NotFoundError_1 = require("./NotFoundError");
const NotReadableError_1 = require("./NotReadableError");
const OverconstrainedError_1 = require("./OverconstrainedError");
const PermissionDeniedError_1 = require("./PermissionDeniedError");
const TypeError_1 = require("./TypeError");
const VideoQualitySettings_1 = require("./VideoQualitySettings");
const VideoTransformDevice_1 = require("./VideoTransformDevice");
class DefaultDeviceController {
    constructor(logger, options) {
        this.logger = logger;
        this.deviceInfoCache = null;
        this.activeDevices = { audio: null, video: null };
        this.audioOutputDeviceId = null;
        this.deviceChangeObservers = new Set();
        this.deviceLabelTrigger = () => {
            return navigator.mediaDevices.getUserMedia({ audio: true, video: true });
        };
        this.audioInputDestinationNode = null;
        this.audioInputSourceNode = null;
        this.videoInputQualitySettings = null;
        this.useWebAudio = false;
        this.inputDeviceCount = 0;
        this.browserBehavior = new DefaultBrowserBehavior_1.default();
        this.alreadyHandlingDeviceChange = false;
        const { enableWebAudio = false } = options || {};
        this.useWebAudio = enableWebAudio;
        this.muteCallback = (muted) => {
            var _a;
            (_a = this.transform) === null || _a === void 0 ? void 0 : _a.device.mute(muted);
        };
        this.videoInputQualitySettings = new VideoQualitySettings_1.default(DefaultDeviceController.defaultVideoWidth, DefaultDeviceController.defaultVideoHeight, DefaultDeviceController.defaultVideoFrameRate, DefaultDeviceController.defaultVideoMaxBandwidthKbps);
        const dimension = this.browserBehavior.requiresResolutionAlignment(this.videoInputQualitySettings.videoWidth, this.videoInputQualitySettings.videoHeight);
        this.videoInputQualitySettings.videoWidth = dimension[0];
        this.videoInputQualitySettings.videoHeight = dimension[1];
        this.logger.info(`DefaultDeviceController video dimension ${this.videoInputQualitySettings.videoWidth} x ${this.videoInputQualitySettings.videoHeight}`);
        try {
            const mediaDeviceWrapper = new DefaultMediaDeviceFactory_1.default().create();
            mediaDeviceWrapper.addEventListener('devicechange', () => {
                this.handleDeviceChange();
            });
            const supportedConstraints = navigator.mediaDevices.getSupportedConstraints();
            this.logger.info(`Supported Constraints in this browser ${JSON.stringify(supportedConstraints)}`);
        }
        catch (error) {
            logger.error(error.message);
        }
    }
    listAudioInputDevices() {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.listDevicesOfKind('audioinput');
            this.trace('listAudioInputDevices', null, result);
            return result;
        });
    }
    listVideoInputDevices() {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.listDevicesOfKind('videoinput');
            this.trace('listVideoInputDevices', null, result);
            return result;
        });
    }
    listAudioOutputDevices() {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.listDevicesOfKind('audiooutput');
            this.trace('listAudioOutputDevices', null, result);
            return result;
        });
    }
    pushAudioMeetingStateForPermissions(device) {
        var _a, _b;
        (_b = (_a = this.boundAudioVideoController) === null || _a === void 0 ? void 0 : _a.eventController) === null || _b === void 0 ? void 0 : _b.pushMeetingState(device === null ? 'audioInputUnselected' : 'audioInputSelected');
    }
    pushVideoMeetingStateForPermissions(device) {
        var _a, _b;
        (_b = (_a = this.boundAudioVideoController) === null || _a === void 0 ? void 0 : _a.eventController) === null || _b === void 0 ? void 0 : _b.pushMeetingState(device === null ? 'videoInputUnselected' : 'videoInputSelected');
    }
    chooseAudioInputDevice(device) {
        return __awaiter(this, void 0, void 0, function* () {
            if (AudioTransformDevice_1.isAudioTransformDevice(device)) {
                // N.B., do not JSON.stringify here — for some kinds of devices this
                // will cause a cyclic object reference error.
                this.logger.info(`Choosing transform input device ${device}`);
                yield this.chooseAudioTransformInputDevice(device);
                return this.pushAudioMeetingStateForPermissions(device);
            }
            this.removeTransform();
            yield this.chooseInputIntrinsicDevice('audio', device, false);
            this.trace('chooseAudioInputDevice', device, `success`);
            this.pushAudioMeetingStateForPermissions(device);
        });
    }
    chooseAudioTransformInputDevice(device) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            if (((_a = this.transform) === null || _a === void 0 ? void 0 : _a.device) === device) {
                return;
            }
            if (!this.useWebAudio) {
                throw new Error('Cannot apply transform device without enabling Web Audio.');
            }
            const context = DefaultDeviceController.getAudioContext();
            let nodes;
            try {
                nodes = yield device.createAudioNode(context);
            }
            catch (e) {
                this.logger.error(`Unable to create transform device node: ${e}.`);
                throw e;
            }
            // Pick the plain ol' inner device as the source. It will be
            // connected to the node.
            const inner = yield device.intrinsicDevice();
            yield this.chooseInputIntrinsicDevice('audio', inner, false);
            this.logger.debug(`Got inner stream: ${inner}.`);
            // Otherwise, continue: hook up the new node.
            this.setTransform(device, nodes);
        });
    }
    chooseVideoInputDevice(device) {
        return __awaiter(this, void 0, void 0, function* () {
            if (VideoTransformDevice_1.isVideoTransformDevice(device)) {
                throw new Error(`Not implemented`);
            }
            this.updateMaxBandwidthKbps();
            yield this.chooseInputIntrinsicDevice('video', device, false);
            this.trace('chooseVideoInputDevice', device);
            this.pushVideoMeetingStateForPermissions(device);
        });
    }
    chooseAudioOutputDevice(deviceId) {
        return __awaiter(this, void 0, void 0, function* () {
            this.audioOutputDeviceId = deviceId;
            yield this.bindAudioOutput();
            this.trace('chooseAudioOutputDevice', deviceId, null);
            return;
        });
    }
    addDeviceChangeObserver(observer) {
        this.logger.info('adding device change observer');
        this.deviceChangeObservers.add(observer);
        this.trace('addDeviceChangeObserver');
    }
    removeDeviceChangeObserver(observer) {
        this.logger.info('removing device change observer');
        this.deviceChangeObservers.delete(observer);
        this.trace('removeDeviceChangeObserver');
    }
    createAnalyserNodeForAudioInput() {
        var _a, _b;
        if (!this.activeDevices['audio']) {
            return null;
        }
        // If there is a WebAudio node in the graph, we use that as the source instead of the stream.
        const node = (_b = (_a = this.transform) === null || _a === void 0 ? void 0 : _a.nodes) === null || _b === void 0 ? void 0 : _b.end;
        if (node) {
            const analyser = node.context.createAnalyser();
            analyser.removeOriginalInputs = () => {
                /* istanbul ignore catch */
                try {
                    node.disconnect(analyser);
                }
                catch (e) {
                    // This can fail in some unusual cases, but this is best-effort.
                }
            };
            node.connect(analyser);
            return analyser;
        }
        return this.createAnalyserNodeForRawAudioInput();
    }
    //
    // N.B., this bypasses any applied transform node.
    //
    createAnalyserNodeForRawAudioInput() {
        if (!this.activeDevices['audio']) {
            return null;
        }
        return this.createAnalyserNodeForStream(this.activeDevices['audio'].stream);
    }
    createAnalyserNodeForStream(stream) {
        const audioContext = DefaultDeviceController.getAudioContext();
        const analyser = audioContext.createAnalyser();
        const source = audioContext.createMediaStreamSource(stream);
        source.connect(analyser);
        this.trace('createAnalyserNodeForAudioInput');
        analyser.removeOriginalInputs = () => {
            /* istanbul ignore catch */
            try {
                source.disconnect(analyser);
            }
            catch (e) {
                // This can fail in some unusual cases, but this is best-effort.
            }
        };
        return analyser;
    }
    startVideoPreviewForVideoInput(element) {
        if (!this.activeDevices['video']) {
            this.logger.warn('cannot bind video preview since video input device has not been chosen');
            this.trace('startVideoPreviewForVideoInput', element.id);
            return;
        }
        // TODO: implement MediaDestroyer to provide single release MediaStream function
        this.releaseMediaStream(element.srcObject);
        DefaultVideoTile_1.default.disconnectVideoStreamFromVideoElement(element, false);
        navigator.mediaDevices
            .getUserMedia(this.activeDevices['video'].constraints)
            .then(previewStream => {
            DefaultVideoTile_1.default.connectVideoStreamToVideoElement(previewStream, element, true);
        })
            .catch(error => {
            this.logger.warn(`Unable to reacquire video stream for preview to element ${element.id}: ${error}`);
        });
        this.trace('startVideoPreviewForVideoInput', element.id);
    }
    stopVideoPreviewForVideoInput(element) {
        const stream = element.srcObject;
        if (stream) {
            this.releaseMediaStream(stream);
            DefaultVideoTile_1.default.disconnectVideoStreamFromVideoElement(element, false);
        }
        if (this.activeDevices['video']) {
            this.releaseMediaStream(this.activeDevices['video'].stream);
        }
        this.trace('stopVideoPreviewForVideoInput', element.id);
    }
    setDeviceLabelTrigger(trigger) {
        this.deviceLabelTrigger = trigger;
        this.trace('setDeviceLabelTrigger');
    }
    mixIntoAudioInput(stream) {
        let node = null;
        if (this.useWebAudio) {
            node = DefaultDeviceController.getAudioContext().createMediaStreamSource(stream);
            node.connect(this.getMediaStreamOutputNode());
        }
        else {
            this.logger.warn('WebAudio is not enabled, mixIntoAudioInput will not work');
        }
        this.trace('mixIntoAudioInput', stream.id);
        return node;
    }
    chooseVideoInputQuality(width, height, frameRate, maxBandwidthKbps) {
        const dimension = this.browserBehavior.requiresResolutionAlignment(width, height);
        this.videoInputQualitySettings = new VideoQualitySettings_1.default(dimension[0], dimension[1], frameRate, maxBandwidthKbps);
        this.updateMaxBandwidthKbps();
    }
    getVideoInputQualitySettings() {
        return this.videoInputQualitySettings;
    }
    acquireAudioInputStream() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.acquireInputStream('audio');
        });
    }
    acquireVideoInputStream() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.acquireInputStream('video');
        });
    }
    acquireDisplayInputStream(streamConstraints) {
        return __awaiter(this, void 0, void 0, function* () {
            if (streamConstraints &&
                streamConstraints.video &&
                // @ts-ignore
                streamConstraints.video.mandatory &&
                // @ts-ignore
                streamConstraints.video.mandatory.chromeMediaSource &&
                // @ts-ignore
                streamConstraints.video.mandatory.chromeMediaSourceId) {
                return navigator.mediaDevices.getUserMedia(streamConstraints);
            }
            // @ts-ignore https://github.com/microsoft/TypeScript/issues/31821
            return navigator.mediaDevices.getDisplayMedia(streamConstraints);
        });
    }
    releaseMediaStream(mediaStreamToRelease) {
        if (!mediaStreamToRelease) {
            return;
        }
        let tracksToStop = null;
        if (!!this.audioInputDestinationNode &&
            mediaStreamToRelease === this.audioInputDestinationNode.stream) {
            // release the true audio stream if WebAudio is used.
            this.logger.info('stopping audio track');
            tracksToStop = this.audioInputSourceNode.mediaStream.getTracks();
            this.audioInputSourceNode.disconnect();
        }
        else {
            tracksToStop = mediaStreamToRelease.getTracks();
        }
        for (const track of tracksToStop) {
            this.logger.info(`stopping ${track.kind} track`);
            track.stop();
        }
        for (const kind in this.activeDevices) {
            if (this.activeDevices[kind] && this.activeDevices[kind].stream === mediaStreamToRelease) {
                this.activeDevices[kind] = null;
                if (kind === 'video' &&
                    this.boundAudioVideoController &&
                    this.boundAudioVideoController.videoTileController.hasStartedLocalVideoTile()) {
                    this.boundAudioVideoController.videoTileController.stopLocalVideoTile();
                }
            }
        }
    }
    bindToAudioVideoController(audioVideoController) {
        if (this.boundAudioVideoController) {
            this.unsubscribeFromMuteAndUnmuteLocalAudio();
        }
        this.boundAudioVideoController = audioVideoController;
        this.subscribeToMuteAndUnmuteLocalAudio();
        new AsyncScheduler_1.default().start(() => {
            this.bindAudioOutput();
        });
    }
    subscribeToMuteAndUnmuteLocalAudio() {
        if (!this.boundAudioVideoController) {
            return;
        }
        // Safety that's hard to test.
        /* istanbul ignore next */
        if (!this.boundAudioVideoController.realtimeController) {
            return;
        }
        this.boundAudioVideoController.realtimeController.realtimeSubscribeToMuteAndUnmuteLocalAudio(this.muteCallback);
    }
    unsubscribeFromMuteAndUnmuteLocalAudio() {
        // Safety that's hard to test.
        /* istanbul ignore next */
        if (!this.boundAudioVideoController.realtimeController) {
            return;
        }
        this.boundAudioVideoController.realtimeController.realtimeUnsubscribeToMuteAndUnmuteLocalAudio(this.muteCallback);
    }
    static createEmptyAudioDevice() {
        return DefaultDeviceController.synthesizeAudioDevice(0);
    }
    static createEmptyVideoDevice() {
        return DefaultDeviceController.synthesizeVideoDevice('black');
    }
    static synthesizeAudioDevice(toneHz) {
        const audioContext = DefaultDeviceController.getAudioContext();
        const outputNode = audioContext.createMediaStreamDestination();
        if (!toneHz) {
            const source = audioContext.createBufferSource();
            // The AudioContext object uses the sample rate of the default output device
            // if not specified. Creating an AudioBuffer object with the output device's
            // sample rate fails in some browsers, e.g. Safari with a Bluetooth headphone.
            try {
                source.buffer = audioContext.createBuffer(1, audioContext.sampleRate * 5, audioContext.sampleRate);
            }
            catch (error) {
                if (error && error.name === 'NotSupportedError') {
                    source.buffer = audioContext.createBuffer(1, DefaultDeviceController.defaultSampleRate * 5, DefaultDeviceController.defaultSampleRate);
                }
                else {
                    throw error;
                }
            }
            // Some browsers will not play audio out the MediaStreamDestination
            // unless there is actually audio to play, so we add a small amount of
            // noise here to ensure that audio is played out.
            source.buffer.getChannelData(0)[0] = 0.0003;
            source.loop = true;
            source.connect(outputNode);
            source.start();
        }
        else {
            const gainNode = audioContext.createGain();
            gainNode.gain.value = 0.1;
            gainNode.connect(outputNode);
            const oscillatorNode = audioContext.createOscillator();
            oscillatorNode.frequency.value = toneHz;
            oscillatorNode.connect(gainNode);
            oscillatorNode.start();
        }
        return outputNode.stream;
    }
    static synthesizeVideoDevice(colorOrPattern) {
        const canvas = document.createElement('canvas');
        canvas.width = 480;
        canvas.height = (canvas.width / 16) * 9;
        const scheduler = new IntervalScheduler_1.default(1000);
        const context = canvas.getContext('2d');
        // @ts-ignore
        const stream = canvas.captureStream(5) || null;
        if (stream) {
            scheduler.start(() => {
                if (colorOrPattern === 'smpte') {
                    DefaultDeviceController.fillSMPTEColorBars(canvas, 0);
                }
                else {
                    context.fillStyle = colorOrPattern;
                    context.fillRect(0, 0, canvas.width, canvas.height);
                }
            });
            stream.getVideoTracks()[0].addEventListener('ended', () => {
                scheduler.stop();
            });
        }
        return stream;
    }
    static fillSMPTEColorBars(canvas, xShift) {
        const w = canvas.width;
        const h = canvas.height;
        const h1 = (h * 2) / 3;
        const h2 = (h * 3) / 4;
        const h3 = h;
        const top = ['#c0c0c0', '#c0c000', '#00c0c0', '#00c000', '#c000c0', '#c00000', '#0000c0'];
        const middle = ['#0000c0', '#000000', '#c000c0', '#000000', '#00c0c0', '#000000', '#c0c0c0'];
        const bottom = [
            '#00214c',
            '#ffffff',
            '#32006a',
            '#131313',
            '#090909',
            '#131313',
            '#1d1d1d',
            '#131313',
        ];
        const bottomX = [
            w * 0,
            ((w * 1) / 4) * (5 / 7),
            ((w * 2) / 4) * (5 / 7),
            ((w * 3) / 4) * (5 / 7),
            w * (5 / 7),
            w * (5 / 7 + 1 / 21),
            w * (5 / 7 + 2 / 21),
            w * (6 / 7),
            w * 1,
        ];
        const segmentWidth = w / top.length;
        const ctx = canvas.getContext('2d');
        for (let i = 0; i < top.length; i++) {
            ctx.fillStyle = top[i];
            ctx.fillRect(xShift + i * segmentWidth, 0, segmentWidth, h1);
            ctx.fillStyle = middle[i];
            ctx.fillRect(xShift + i * segmentWidth, h1, segmentWidth, h2 - h1);
        }
        for (let i = 0; i < bottom.length; i++) {
            ctx.fillStyle = bottom[i];
            ctx.fillRect(xShift + bottomX[i], h2, bottomX[i + 1] - bottomX[i], h3 - h2);
        }
    }
    updateMaxBandwidthKbps() {
        if (this.boundAudioVideoController) {
            this.boundAudioVideoController.setVideoMaxBandwidthKbps(this.videoInputQualitySettings.videoMaxBandwidthKbps);
        }
    }
    listDevicesOfKind(deviceKind) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.deviceInfoCache === null) {
                yield this.updateDeviceInfoCacheFromBrowser();
            }
            return this.listCachedDevicesOfKind(deviceKind);
        });
    }
    updateDeviceInfoCacheFromBrowser() {
        return __awaiter(this, void 0, void 0, function* () {
            const doesNotHaveAccessToMediaDevices = !MediaDeviceInfo;
            if (doesNotHaveAccessToMediaDevices) {
                this.deviceInfoCache = [];
                return;
            }
            let devices = yield navigator.mediaDevices.enumerateDevices();
            let hasDeviceLabels = true;
            for (const device of devices) {
                if (!device.label) {
                    hasDeviceLabels = false;
                    break;
                }
            }
            if (!hasDeviceLabels) {
                try {
                    this.logger.info('attempting to trigger media device labels since they are hidden');
                    const triggerStream = yield this.deviceLabelTrigger();
                    devices = yield navigator.mediaDevices.enumerateDevices();
                    for (const track of triggerStream.getTracks()) {
                        track.stop();
                    }
                }
                catch (err) {
                    this.logger.info('unable to get media device labels');
                }
            }
            this.deviceInfoCache = devices;
        });
    }
    listCachedDevicesOfKind(deviceKind) {
        const devicesOfKind = [];
        for (const device of this.deviceInfoCache) {
            if (device.kind === deviceKind) {
                devicesOfKind.push(device);
            }
        }
        return devicesOfKind;
    }
    handleDeviceChange() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.deviceInfoCache === null) {
                return;
            }
            if (this.alreadyHandlingDeviceChange) {
                new AsyncScheduler_1.default().start(() => {
                    this.handleDeviceChange();
                });
                return;
            }
            this.alreadyHandlingDeviceChange = true;
            const oldAudioInputDevices = this.listCachedDevicesOfKind('audioinput');
            const oldVideoInputDevices = this.listCachedDevicesOfKind('videoinput');
            const oldAudioOutputDevices = this.listCachedDevicesOfKind('audiooutput');
            yield this.updateDeviceInfoCacheFromBrowser();
            const newAudioInputDevices = this.listCachedDevicesOfKind('audioinput');
            const newVideoInputDevices = this.listCachedDevicesOfKind('videoinput');
            const newAudioOutputDevices = this.listCachedDevicesOfKind('audiooutput');
            this.forEachObserver((observer) => {
                if (!this.areDeviceListsEqual(oldAudioInputDevices, newAudioInputDevices)) {
                    Maybe_1.default.of(observer.audioInputsChanged).map(f => f.bind(observer)(newAudioInputDevices));
                }
                if (!this.areDeviceListsEqual(oldVideoInputDevices, newVideoInputDevices)) {
                    Maybe_1.default.of(observer.videoInputsChanged).map(f => f.bind(observer)(newVideoInputDevices));
                }
                if (!this.areDeviceListsEqual(oldAudioOutputDevices, newAudioOutputDevices)) {
                    Maybe_1.default.of(observer.audioOutputsChanged).map(f => f.bind(observer)(newAudioOutputDevices));
                }
            });
            this.alreadyHandlingDeviceChange = false;
        });
    }
    handleDeviceStreamEnded(kind, deviceId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.chooseInputIntrinsicDevice(kind, null, false);
            if (kind === 'audio') {
                this.forEachObserver((observer) => {
                    Maybe_1.default.of(observer.audioInputStreamEnded).map(f => f.bind(observer)(deviceId));
                });
            }
            else {
                this.forEachObserver((observer) => {
                    Maybe_1.default.of(observer.videoInputStreamEnded).map(f => f.bind(observer)(deviceId));
                });
            }
        });
    }
    forEachObserver(observerFunc) {
        for (const observer of this.deviceChangeObservers) {
            new AsyncScheduler_1.default().start(() => {
                /* istanbul ignore else */
                if (this.deviceChangeObservers.has(observer)) {
                    observerFunc(observer);
                }
            });
        }
    }
    areDeviceListsEqual(a, b) {
        return (JSON.stringify(a.map(device => JSON.stringify(device)).sort()) ===
            JSON.stringify(b.map(device => JSON.stringify(device)).sort()));
    }
    intrinsicDeviceAsMediaStream(device) {
        // @ts-ignore
        return device && device.id ? device : null;
    }
    hasSameGroupId(groupId, kind, device) {
        device = this.getIntrinsicDeviceIdStr(device);
        if (groupId === this.getGroupIdFromDeviceId(kind, device) || groupId === '') {
            return true;
        }
        return false;
    }
    getGroupIdFromDeviceId(kind, device) {
        if (this.deviceInfoCache !== null) {
            const cachedDeviceInfo = this.listCachedDevicesOfKind(`${kind}input`).find((cachedDevice) => cachedDevice.deviceId === device);
            if (cachedDeviceInfo && cachedDeviceInfo.groupId) {
                return cachedDeviceInfo.groupId;
            }
        }
        return '';
    }
    getIntrinsicDeviceIdStr(device) {
        if (device === null) {
            return null;
        }
        if (typeof device === 'string') {
            return device;
        }
        if (device.id) {
            return device.id;
        }
        const constraints = device;
        if (!constraints.deviceId) {
            return '';
        }
        if (typeof constraints.deviceId === 'string') {
            return constraints.deviceId;
        }
        const deviceIdConstraint = constraints.deviceId;
        if (typeof deviceIdConstraint.exact === 'string') {
            return deviceIdConstraint.exact;
        }
        return '';
    }
    getActiveDeviceId(kind) {
        /* istanbul ignore else */
        if (this.activeDevices[kind] && this.activeDevices[kind].constraints) {
            const activeDeviceMediaTrackConstraints = this.activeDevices[kind].constraints.audio || this.activeDevices[kind].constraints.video;
            const activeDeviceConstrainDOMStringParameters = activeDeviceMediaTrackConstraints
                .deviceId;
            let activeDeviceId;
            if (typeof activeDeviceConstrainDOMStringParameters === 'string') {
                activeDeviceId = activeDeviceConstrainDOMStringParameters;
            }
            else {
                activeDeviceId = activeDeviceConstrainDOMStringParameters
                    .exact;
            }
            return activeDeviceId;
        }
        /* istanbul ignore next */
        return null;
    }
    restartLocalVideoAfterSelection(oldStream, fromAcquire) {
        if (!fromAcquire &&
            this.boundAudioVideoController &&
            this.boundAudioVideoController.videoTileController.hasStartedLocalVideoTile()) {
            this.logger.info('restarting local video to switch to new device');
            this.boundAudioVideoController.restartLocalVideo(() => {
                // TODO: implement MediaStreamDestroyer
                // tracks of oldStream should be stopped when video tile is disconnected from MediaStream
                // otherwise, camera is still being accessed and we need to stop it here.
                if (oldStream && oldStream.active) {
                    this.logger.warn('previous media stream is not stopped during restart video');
                    this.releaseMediaStream(oldStream);
                }
            });
        }
        else {
            this.releaseMediaStream(oldStream);
        }
    }
    handleGetUserMediaError(error, errorTimeMs) {
        switch (error.name) {
            case 'NotReadableError':
            case 'TrackStartError':
                throw new NotReadableError_1.default(error);
            case 'NotFoundError':
            case 'DevicesNotFoundError':
                throw new NotFoundError_1.default(error);
            case 'NotAllowedError':
            case 'PermissionDeniedError':
            case 'SecurityError':
                if (errorTimeMs &&
                    errorTimeMs < DefaultDeviceController.permissionDeniedOriginDetectionThresholdMs) {
                    throw new PermissionDeniedError_1.default(error, 'Permission denied by browser');
                }
                else {
                    throw new PermissionDeniedError_1.default(error, 'Permission denied by user');
                }
            case 'OverconstrainedError':
            case 'ConstraintNotSatisfiedError':
                throw new OverconstrainedError_1.default(error);
            case 'TypeError':
                throw new TypeError_1.default(error);
            case 'AbortError':
            default:
                throw new GetUserMediaError_1.default(error);
        }
    }
    chooseInputIntrinsicDevice(kind, device, fromAcquire) {
        var _a, _b, _c, _d;
        return __awaiter(this, void 0, void 0, function* () {
            this.inputDeviceCount += 1;
            const callCount = this.inputDeviceCount;
            if (device === null && kind === 'video') {
                this.lastNoVideoInputDeviceCount = this.inputDeviceCount;
                if (this.activeDevices[kind]) {
                    this.releaseMediaStream(this.activeDevices[kind].stream);
                    delete this.activeDevices[kind];
                }
                return;
            }
            // N.B.,: the input device might already have augmented constraints supplied
            // by an `AudioTransformDevice`. `calculateMediaStreamConstraints` will respect
            // settings supplied by the device.
            const proposedConstraints = this.calculateMediaStreamConstraints(kind, device);
            // TODO: `matchesConstraints` should really return compatible/incompatible/exact --
            // `applyConstraints` can be used to reuse the active device while changing the
            // requested constraints.
            if (this.activeDevices[kind] &&
                this.activeDevices[kind].matchesConstraints(proposedConstraints) &&
                this.activeDevices[kind].stream.active &&
                this.activeDevices[kind].groupId !== null &&
                this.hasSameGroupId(this.activeDevices[kind].groupId, kind, device)) {
                this.logger.info(`reusing existing ${kind} device`);
                return;
            }
            if (kind === 'audio' && this.activeDevices[kind] && this.activeDevices[kind].stream) {
                this.releaseMediaStream(this.activeDevices[kind].stream);
            }
            const startTimeMs = Date.now();
            const newDevice = new DeviceSelection_1.default();
            try {
                this.logger.info(`requesting new ${kind} device with constraint ${JSON.stringify(proposedConstraints)}`);
                const stream = this.intrinsicDeviceAsMediaStream(device);
                if (kind === 'audio' && device === null) {
                    newDevice.stream = DefaultDeviceController.createEmptyAudioDevice();
                    newDevice.constraints = null;
                }
                else if (stream) {
                    this.logger.info(`using media stream ${stream.id} for ${kind} device`);
                    newDevice.stream = stream;
                    newDevice.constraints = proposedConstraints;
                }
                else {
                    newDevice.stream = yield navigator.mediaDevices.getUserMedia(proposedConstraints);
                    newDevice.constraints = proposedConstraints;
                    if (kind === 'video' && this.lastNoVideoInputDeviceCount > callCount) {
                        this.logger.warn(`ignored to get video device for constraints ${JSON.stringify(proposedConstraints)} as no device was requested`);
                        this.releaseMediaStream(newDevice.stream);
                        return;
                    }
                    yield this.handleDeviceChange();
                    newDevice.stream.getTracks()[0].addEventListener('ended', () => {
                        if (this.activeDevices[kind] && this.activeDevices[kind].stream === newDevice.stream) {
                            this.logger.warn(`${kind} input device which was active is no longer available, resetting to null device`);
                            this.handleDeviceStreamEnded(kind, this.getActiveDeviceId(kind));
                        }
                    });
                }
                newDevice.groupId = this.getGroupIdFromDeviceId(kind, this.getIntrinsicDeviceIdStr(device));
            }
            catch (error) {
                let errorMessage;
                if ((error === null || error === void 0 ? void 0 : error.name) && error.message) {
                    errorMessage = `${error.name}: ${error.message}`;
                }
                else if (error === null || error === void 0 ? void 0 : error.name) {
                    errorMessage = error.name;
                }
                else if (error === null || error === void 0 ? void 0 : error.message) {
                    errorMessage = error.message;
                }
                else {
                    errorMessage = 'UnknownError';
                }
                if (kind === 'audio') {
                    (_b = (_a = this.boundAudioVideoController) === null || _a === void 0 ? void 0 : _a.eventController) === null || _b === void 0 ? void 0 : _b.publishEvent('audioInputFailed', {
                        audioInputErrorMessage: errorMessage,
                    });
                }
                else {
                    (_d = (_c = this.boundAudioVideoController) === null || _c === void 0 ? void 0 : _c.eventController) === null || _d === void 0 ? void 0 : _d.publishEvent('videoInputFailed', {
                        videoInputErrorMessage: errorMessage,
                    });
                }
                this.logger.error(`failed to get ${kind} device for constraints ${JSON.stringify(proposedConstraints)}: ${errorMessage}`);
                // This is effectively `error instanceof OverconstrainedError` but works in Node.
                if ('constraint' in error) {
                    this.logger.error(`Over-constrained by constraint: ${error.constraint}`);
                }
                /*
                 * If there is any error while acquiring the audio device, we fall back to null device.
                 * Reason: If device selection fails (e.g. NotReadableError), the peer connection is left hanging
                 * with no active audio track since we release the previously attached track.
                 * If no audio packet has yet been sent to the server, the server will not emit the joined event.
                 */
                if (kind === 'audio') {
                    this.logger.info(`choosing null ${kind} device instead`);
                    try {
                        newDevice.stream = DefaultDeviceController.createEmptyAudioDevice();
                        newDevice.constraints = null;
                        yield this.handleNewInputDevice(kind, newDevice, fromAcquire);
                    }
                    catch (error) {
                        this.logger.error(`failed to choose null ${kind} device. ${error.name}: ${error.message}`);
                    }
                }
                this.handleGetUserMediaError(error, Date.now() - startTimeMs);
            }
            this.logger.info(`got ${kind} device for constraints ${JSON.stringify(proposedConstraints)}`);
            yield this.handleNewInputDevice(kind, newDevice, fromAcquire);
            return;
        });
    }
    handleNewInputDevice(kind, newDevice, fromAcquire) {
        return __awaiter(this, void 0, void 0, function* () {
            const oldStream = this.activeDevices[kind]
                ? this.activeDevices[kind].stream
                : null;
            this.activeDevices[kind] = newDevice;
            if (kind === 'video') {
                this.restartLocalVideoAfterSelection(oldStream, fromAcquire);
            }
            else {
                this.releaseMediaStream(oldStream);
                if (this.useWebAudio) {
                    this.attachAudioInputStreamToAudioContext(this.activeDevices[kind].stream);
                }
                else if (this.boundAudioVideoController) {
                    try {
                        yield this.boundAudioVideoController.restartLocalAudio(() => { });
                    }
                    catch (error) {
                        this.logger.info(`cannot replace audio track due to: ${error.message}`);
                    }
                }
                else {
                    this.logger.info('no audio-video controller is bound to the device controller');
                }
            }
        });
    }
    bindAudioOutput() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.boundAudioVideoController) {
                return;
            }
            const deviceInfo = this.deviceInfoFromDeviceId('audiooutput', this.audioOutputDeviceId);
            yield this.boundAudioVideoController.audioMixController.bindAudioDevice(deviceInfo);
        });
    }
    calculateMediaStreamConstraints(kind, device) {
        let trackConstraints = {};
        if (device === '') {
            device = null;
        }
        const stream = this.intrinsicDeviceAsMediaStream(device);
        if (device === null) {
            return null;
        }
        else if (typeof device === 'string') {
            if (this.browserBehavior.requiresNoExactMediaStreamConstraints()) {
                trackConstraints.deviceId = device;
            }
            else {
                trackConstraints.deviceId = { exact: device };
            }
        }
        else if (stream) {
            // @ts-ignore - create a fake track constraint using the stream id
            trackConstraints.streamId = stream.id;
        }
        else {
            // Take the input set of constraints. Note that this allows
            // the builder to specify overrides for properties like `autoGainControl`.
            // @ts-ignore - device is a MediaTrackConstraints
            trackConstraints = device;
        }
        if (kind === 'video') {
            trackConstraints.width = trackConstraints.width || {
                ideal: this.videoInputQualitySettings.videoWidth,
            };
            trackConstraints.height = trackConstraints.height || {
                ideal: this.videoInputQualitySettings.videoHeight,
            };
            trackConstraints.frameRate = trackConstraints.frameRate || {
                ideal: this.videoInputQualitySettings.videoFrameRate,
            };
            // TODO: try to replace hard-code value related to videos into quality-level presets
            // The following configs relaxes CPU overuse detection threshold to offer better encoding quality
            // @ts-ignore
            trackConstraints.googCpuOveruseDetection = true;
            // @ts-ignore
            trackConstraints.googCpuOveruseEncodeUsage = true;
            // @ts-ignore
            trackConstraints.googCpuOveruseThreshold = 85;
            // @ts-ignore
            trackConstraints.googCpuUnderuseThreshold = 55;
        }
        if (kind === 'audio' && this.supportSampleRateConstraint()) {
            trackConstraints.sampleRate = { ideal: DefaultDeviceController.defaultSampleRate };
        }
        if (kind === 'audio' && this.supportSampleSizeConstraint()) {
            trackConstraints.sampleSize = { ideal: DefaultDeviceController.defaultSampleSize };
        }
        if (kind === 'audio' && this.supportChannelCountConstraint()) {
            trackConstraints.channelCount = { ideal: DefaultDeviceController.defaultChannelCount };
        }
        if (kind === 'audio') {
            const augmented = Object.assign({ echoCancellation: true, googEchoCancellation: true, googEchoCancellation2: true, googAutoGainControl: true, googAutoGainControl2: true, googNoiseSuppression: true, googNoiseSuppression2: true, googHighpassFilter: true }, trackConstraints);
            trackConstraints = augmented;
        }
        return kind === 'audio' ? { audio: trackConstraints } : { video: trackConstraints };
    }
    deviceInfoFromDeviceId(deviceKind, deviceId) {
        if (this.deviceInfoCache === null) {
            return null;
        }
        for (const device of this.deviceInfoCache) {
            if (device.kind === deviceKind && device.deviceId === deviceId) {
                return device;
            }
        }
        return null;
    }
    acquireInputStream(kind) {
        return __awaiter(this, void 0, void 0, function* () {
            if (kind === 'audio') {
                if (this.useWebAudio) {
                    const dest = this.getMediaStreamDestinationNode();
                    return dest.stream;
                }
            }
            let existingConstraints = null;
            if (!this.activeDevices[kind]) {
                if (kind === 'audio') {
                    this.logger.info(`no ${kind} device chosen, creating empty ${kind} device`);
                }
                else {
                    this.logger.error(`no ${kind} device chosen, stopping local video tile`);
                    this.boundAudioVideoController.videoTileController.stopLocalVideoTile();
                    throw new Error(`no ${kind} device chosen, stopping local video tile`);
                }
            }
            else {
                this.logger.info(`checking whether existing ${kind} device can be reused`);
                const active = this.activeDevices[kind];
                // @ts-ignore
                existingConstraints = active.constraints ? active.constraints[kind] : null;
            }
            try {
                yield this.chooseInputIntrinsicDevice(kind, existingConstraints, true);
            }
            catch (e) {
                this.logger.error(`unable to acquire ${kind} device`);
                if (e instanceof PermissionDeniedError_1.default) {
                    throw e;
                }
                throw new GetUserMediaError_1.default(e, `unable to acquire ${kind} device`);
            }
            return this.activeDevices[kind].stream;
        });
    }
    hasAppliedTransform() {
        return !!this.transform;
    }
    reconnectAudioInputs() {
        // It is never possible to get here without first establishing `audioInputSourceNode` via
        // choosing an inner stream, so we do not check for undefined here in order to avoid
        // creating an un-testable branch!
        this.audioInputSourceNode.disconnect();
        const output = this.getMediaStreamOutputNode();
        this.audioInputSourceNode.connect(output);
    }
    setTransform(device, nodes) {
        var _a, _b;
        (_b = (_a = this.transform) === null || _a === void 0 ? void 0 : _a.nodes) === null || _b === void 0 ? void 0 : _b.end.disconnect();
        this.transform = { nodes, device };
        const proc = nodes === null || nodes === void 0 ? void 0 : nodes.end;
        const dest = this.getMediaStreamDestinationNode();
        this.logger.debug(`Connecting transform node ${proc} to destination ${dest}.`);
        proc === null || proc === void 0 ? void 0 : proc.connect(dest);
        this.reconnectAudioInputs();
    }
    removeTransform() {
        var _a;
        const previous = this.transform;
        if (!previous) {
            return undefined;
        }
        (_a = this.transform.nodes) === null || _a === void 0 ? void 0 : _a.end.disconnect();
        this.transform = undefined;
        this.reconnectAudioInputs();
        return previous;
    }
    attachAudioInputStreamToAudioContext(stream) {
        var _a;
        (_a = this.audioInputSourceNode) === null || _a === void 0 ? void 0 : _a.disconnect();
        this.audioInputSourceNode = DefaultDeviceController.getAudioContext().createMediaStreamSource(stream);
        const output = this.getMediaStreamOutputNode();
        this.audioInputSourceNode.connect(output);
    }
    /**
     * Return the end of the Web Audio graph: post-transform audio.
     */
    getMediaStreamDestinationNode() {
        if (!this.audioInputDestinationNode) {
            this.audioInputDestinationNode = DefaultDeviceController.getAudioContext().createMediaStreamDestination();
        }
        return this.audioInputDestinationNode;
    }
    /**
     * Return the start of the Web Audio graph: pre-transform audio.
     * If there's no transform node, this is the destination node.
     */
    getMediaStreamOutputNode() {
        var _a, _b;
        return ((_b = (_a = this.transform) === null || _a === void 0 ? void 0 : _a.nodes) === null || _b === void 0 ? void 0 : _b.start) || this.getMediaStreamDestinationNode();
    }
    static getAudioContext() {
        if (!DefaultDeviceController.audioContext) {
            const options = {};
            if (navigator.mediaDevices.getSupportedConstraints().sampleRate) {
                options.sampleRate = DefaultDeviceController.defaultSampleRate;
            }
            // @ts-ignore
            DefaultDeviceController.audioContext = new (window.AudioContext || window.webkitAudioContext)(options);
        }
        return DefaultDeviceController.audioContext;
    }
    static closeAudioContext() {
        if (DefaultDeviceController.audioContext) {
            DefaultDeviceController.audioContext.close();
        }
        DefaultDeviceController.audioContext = null;
    }
    supportSampleRateConstraint() {
        return this.useWebAudio && !!navigator.mediaDevices.getSupportedConstraints().sampleRate;
    }
    supportSampleSizeConstraint() {
        return this.useWebAudio && !!navigator.mediaDevices.getSupportedConstraints().sampleSize;
    }
    supportChannelCountConstraint() {
        return this.useWebAudio && !!navigator.mediaDevices.getSupportedConstraints().channelCount;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    trace(name, input, output) {
        let s = `API/DefaultDeviceController/${name}`;
        if (typeof input !== 'undefined') {
            s += ` ${JSON.stringify(input)}`;
        }
        if (typeof output !== 'undefined') {
            s += ` -> ${JSON.stringify(output)}`;
        }
        this.logger.info(s);
    }
}
exports.default = DefaultDeviceController;
DefaultDeviceController.permissionDeniedOriginDetectionThresholdMs = 500;
DefaultDeviceController.defaultVideoWidth = 960;
DefaultDeviceController.defaultVideoHeight = 540;
DefaultDeviceController.defaultVideoFrameRate = 15;
DefaultDeviceController.defaultVideoMaxBandwidthKbps = 1400;
DefaultDeviceController.defaultSampleRate = 48000;
DefaultDeviceController.defaultSampleSize = 16;
DefaultDeviceController.defaultChannelCount = 1;
DefaultDeviceController.audioContext = null;
//# sourceMappingURL=DefaultDeviceController.js.map