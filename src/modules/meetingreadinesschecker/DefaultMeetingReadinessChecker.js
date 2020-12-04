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
const DefaultAudioMixController_1 = require("../audiomixcontroller/DefaultAudioMixController");
const DefaultBrowserBehavior_1 = require("../browserbehavior/DefaultBrowserBehavior");
const DefaultDeviceController_1 = require("../devicecontroller/DefaultDeviceController");
const PermissionDeniedError_1 = require("../devicecontroller/PermissionDeniedError");
const TimeoutScheduler_1 = require("../scheduler/TimeoutScheduler");
const BaseTask_1 = require("../task/BaseTask");
const TimeoutTask_1 = require("../task/TimeoutTask");
const CheckAudioConnectivityFeedback_1 = require("./CheckAudioConnectivityFeedback");
const CheckAudioInputFeedback_1 = require("./CheckAudioInputFeedback");
const CheckAudioOutputFeedback_1 = require("./CheckAudioOutputFeedback");
const CheckCameraResolutionFeedback_1 = require("./CheckCameraResolutionFeedback");
const CheckContentShareConnectivityFeedback_1 = require("./CheckContentShareConnectivityFeedback");
const CheckNetworkTCPConnectivityFeedback_1 = require("./CheckNetworkTCPConnectivityFeedback");
const CheckNetworkUDPConnectivityFeedback_1 = require("./CheckNetworkUDPConnectivityFeedback");
const CheckVideoConnectivityFeedback_1 = require("./CheckVideoConnectivityFeedback");
const CheckVideoInputFeedback_1 = require("./CheckVideoInputFeedback");
const MeetingReadinessCheckerConfiguration_1 = require("./MeetingReadinessCheckerConfiguration");
class DefaultMeetingReadinessChecker {
    constructor(logger, meetingSession, configuration = new MeetingReadinessCheckerConfiguration_1.default()) {
        this.logger = logger;
        this.meetingSession = meetingSession;
        this.configuration = configuration;
        this.browserBehavior = new DefaultBrowserBehavior_1.default();
    }
    static delay(timeoutMs) {
        return __awaiter(this, void 0, void 0, function* () {
            yield new Promise(resolve => new TimeoutScheduler_1.default(timeoutMs).start(resolve));
        });
    }
    checkAudioInput(audioInputDeviceInfo) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.meetingSession.audioVideo.chooseAudioInputDevice(audioInputDeviceInfo);
                yield this.meetingSession.audioVideo.chooseAudioInputDevice(null);
                return CheckAudioInputFeedback_1.default.Succeeded;
            }
            catch (error) {
                this.logger.error(`MeetingReadinessChecker: Audio input check failed with error ${error}`);
                if (error instanceof PermissionDeniedError_1.default) {
                    return CheckAudioInputFeedback_1.default.PermissionDenied;
                }
                return CheckAudioInputFeedback_1.default.Failed;
            }
        });
    }
    checkAudioOutput(audioOutputDeviceInfo, audioOutputVerificationCallback, audioElement = null) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const audioOutputDeviceId = audioOutputDeviceInfo && audioOutputDeviceInfo.deviceId
                    ? audioOutputDeviceInfo.deviceId
                    : '';
                yield this.playTone(audioOutputDeviceId, 440, audioElement);
                const userFeedback = yield audioOutputVerificationCallback();
                if (userFeedback) {
                    return CheckAudioOutputFeedback_1.default.Succeeded;
                }
                else {
                    return CheckAudioOutputFeedback_1.default.Failed;
                }
            }
            catch (error) {
                this.logger.error(`MeetingReadinessChecker: Audio output check failed with error: ${error}`);
                return CheckAudioOutputFeedback_1.default.Failed;
            }
            finally {
                this.stopTone();
            }
        });
    }
    playTone(sinkId, frequency, audioElement) {
        return __awaiter(this, void 0, void 0, function* () {
            const rampSec = 0.1;
            const maxGainValue = 0.1;
            if (this.oscillatorNode) {
                this.stopTone();
            }
            this.audioContext = DefaultDeviceController_1.default.getAudioContext();
            this.gainNode = this.audioContext.createGain();
            this.gainNode.gain.value = 0;
            this.oscillatorNode = this.audioContext.createOscillator();
            this.oscillatorNode.frequency.value = frequency;
            this.oscillatorNode.connect(this.gainNode);
            this.destinationStream = this.audioContext.createMediaStreamDestination();
            this.gainNode.connect(this.destinationStream);
            const currentTime = this.audioContext.currentTime;
            const startTime = currentTime + 0.1;
            this.gainNode.gain.linearRampToValueAtTime(0, startTime);
            this.gainNode.gain.linearRampToValueAtTime(maxGainValue, startTime + rampSec);
            this.oscillatorNode.start();
            const audioMixController = new DefaultAudioMixController_1.default(this.logger);
            try {
                // @ts-ignore
                yield audioMixController.bindAudioDevice({ deviceId: sinkId });
            }
            catch (e) {
                this.logger.error(`Failed to bind audio device: ${e}`);
            }
            try {
                yield audioMixController.bindAudioElement(audioElement || new Audio());
            }
            catch (e) {
                this.logger.error(`Failed to bind audio element: ${e}`);
            }
            yield audioMixController.bindAudioStream(this.destinationStream.stream);
        });
    }
    stopTone() {
        if (!this.audioContext || !this.gainNode || !this.oscillatorNode || !this.destinationStream) {
            return;
        }
        const durationSec = 1;
        const rampSec = 0.1;
        const maxGainValue = 0.1;
        const currentTime = this.audioContext.currentTime;
        this.gainNode.gain.linearRampToValueAtTime(maxGainValue, currentTime + rampSec + durationSec);
        this.gainNode.gain.linearRampToValueAtTime(0, currentTime + rampSec * 2 + durationSec);
        this.oscillatorNode.stop();
        this.oscillatorNode.disconnect(this.gainNode);
        this.gainNode.disconnect(this.destinationStream);
        this.oscillatorNode = null;
        this.gainNode = null;
        this.destinationStream = null;
    }
    checkVideoInput(videoInputDeviceInfo) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.meetingSession.audioVideo.chooseVideoInputDevice(videoInputDeviceInfo);
                yield this.meetingSession.audioVideo.chooseVideoInputDevice(null);
                return CheckVideoInputFeedback_1.default.Succeeded;
            }
            catch (error) {
                this.logger.error(`MeetingReadinessChecker: Video check failed with error ${error}`);
                if (error instanceof PermissionDeniedError_1.default) {
                    return CheckVideoInputFeedback_1.default.PermissionDenied;
                }
                return CheckVideoInputFeedback_1.default.Failed;
            }
        });
    }
    checkCameraResolution(videoInputDevice, width, height) {
        return __awaiter(this, void 0, void 0, function* () {
            const videoConstraint = {
                video: this.calculateVideoConstraint(videoInputDevice, width, height),
            };
            let stream;
            try {
                stream = yield navigator.mediaDevices.getUserMedia(videoConstraint);
            }
            catch (error) {
                this.logger.error(`MeetingReadinessChecker: Camera resolution check with width: ${width} height ${height} failed with error ${error}`);
                if (error && error.name === 'OverconstrainedError') {
                    return CheckCameraResolutionFeedback_1.default.ResolutionNotSupported;
                }
                if (error && error.name === 'NotAllowedError') {
                    return CheckCameraResolutionFeedback_1.default.PermissionDenied;
                }
                return CheckCameraResolutionFeedback_1.default.Failed;
            }
            finally {
                if (stream) {
                    stream.getTracks().forEach(function (track) {
                        track.stop();
                    });
                }
            }
            return CheckCameraResolutionFeedback_1.default.Succeeded;
        });
    }
    calculateVideoConstraint(videoInputDevice, width, height) {
        const dimension = this.browserBehavior.requiresResolutionAlignment(width, height);
        const trackConstraints = {};
        if (this.browserBehavior.requiresNoExactMediaStreamConstraints()) {
            trackConstraints.deviceId = videoInputDevice.deviceId;
            trackConstraints.width = width;
            trackConstraints.height = height;
        }
        else {
            trackConstraints.deviceId = { exact: videoInputDevice.deviceId };
            trackConstraints.width = { exact: dimension[0] };
            trackConstraints.height = { exact: dimension[1] };
        }
        return trackConstraints;
    }
    checkContentShareConnectivity(sourceId) {
        return __awaiter(this, void 0, void 0, function* () {
            let isContentShareStarted = false;
            let isAudioVideoStarted = false;
            const contentShareObserver = {
                contentShareDidStart: () => {
                    isContentShareStarted = true;
                },
            };
            const observer = {
                audioVideoDidStart: () => {
                    isAudioVideoStarted = true;
                },
            };
            try {
                this.meetingSession.audioVideo.addObserver(observer);
                this.meetingSession.audioVideo.start();
                this.meetingSession.audioVideo.addContentShareObserver(contentShareObserver);
                yield this.meetingSession.audioVideo.startContentShareFromScreenCapture(sourceId);
                yield this.executeTimeoutTask(() => __awaiter(this, void 0, void 0, function* () {
                    return isAudioVideoStarted && isContentShareStarted;
                }));
                if (!isAudioVideoStarted) {
                    return CheckContentShareConnectivityFeedback_1.default.ConnectionFailed;
                }
                yield this.stopMeeting();
                return isContentShareStarted
                    ? CheckContentShareConnectivityFeedback_1.default.Succeeded
                    : CheckContentShareConnectivityFeedback_1.default.TimedOut;
            }
            catch (error) {
                this.logger.error(`MeetingReadinessChecker: Content share check failed with error ${error}`);
                if (error.name === 'NotAllowedError') {
                    return CheckContentShareConnectivityFeedback_1.default.PermissionDenied;
                }
                else {
                    return CheckContentShareConnectivityFeedback_1.default.Failed;
                }
            }
            finally {
                this.meetingSession.audioVideo.removeObserver(observer);
                this.meetingSession.audioVideo.stopContentShare();
                this.meetingSession.audioVideo.removeContentShareObserver(contentShareObserver);
            }
        });
    }
    checkAudioConnectivity(audioInputDeviceInfo) {
        return __awaiter(this, void 0, void 0, function* () {
            let audioPresence = false;
            const audioVideo = this.meetingSession.audioVideo;
            const attendeePresenceHandler = (attendeeId, present, _externalUserId, _dropped) => {
                if (attendeeId === this.meetingSession.configuration.credentials.attendeeId && present) {
                    audioPresence = true;
                }
            };
            try {
                yield audioVideo.chooseAudioInputDevice(audioInputDeviceInfo);
            }
            catch (error) {
                this.logger.error(`MeetingReadinessChecker: Failed to get audio input device with error ${error}`);
                if (error instanceof PermissionDeniedError_1.default) {
                    return CheckAudioConnectivityFeedback_1.default.AudioInputPermissionDenied;
                }
                return CheckAudioConnectivityFeedback_1.default.AudioInputRequestFailed;
            }
            audioVideo.realtimeSubscribeToAttendeeIdPresence(attendeePresenceHandler);
            if (!(yield this.startMeeting())) {
                audioVideo.realtimeUnsubscribeToAttendeeIdPresence(attendeePresenceHandler);
                try {
                    yield this.meetingSession.audioVideo.chooseAudioInputDevice(null);
                }
                catch (e) {
                    this.logger.error(`MeetingReadinessChecker: Failed to choose null device with error ${e}`);
                }
                return CheckAudioConnectivityFeedback_1.default.ConnectionFailed;
            }
            yield this.executeTimeoutTask(() => __awaiter(this, void 0, void 0, function* () {
                return audioPresence;
            }));
            audioVideo.realtimeUnsubscribeToAttendeeIdPresence(attendeePresenceHandler);
            yield this.stopMeeting();
            try {
                yield this.meetingSession.audioVideo.chooseAudioInputDevice(null);
            }
            catch (e) {
                this.logger.error(`MeetingReadinessChecker: Failed to choose null device with error ${e}`);
            }
            return audioPresence
                ? CheckAudioConnectivityFeedback_1.default.Succeeded
                : CheckAudioConnectivityFeedback_1.default.AudioNotReceived;
        });
    }
    checkVideoConnectivity(videoInputDeviceInfo) {
        return __awaiter(this, void 0, void 0, function* () {
            const audioVideo = this.meetingSession.audioVideo;
            try {
                yield audioVideo.chooseVideoInputDevice(videoInputDeviceInfo);
            }
            catch (error) {
                this.logger.error(`MeetingReadinessChecker: Failed to get video input device with error ${error}`);
                if (error instanceof PermissionDeniedError_1.default) {
                    return CheckVideoConnectivityFeedback_1.default.VideoInputPermissionDenied;
                }
                return CheckVideoConnectivityFeedback_1.default.VideoInputRequestFailed;
            }
            if (!(yield this.startMeeting())) {
                return CheckVideoConnectivityFeedback_1.default.ConnectionFailed;
            }
            let packetsSent = 0;
            audioVideo.startLocalVideoTile();
            yield this.executeTimeoutTask(() => __awaiter(this, void 0, void 0, function* () {
                const rawStats = yield audioVideo.getRTCPeerConnectionStats();
                if (rawStats) {
                    rawStats.forEach(report => {
                        if (report.type === 'outbound-rtp' && report.mediaType === 'video') {
                            packetsSent = report.packetsSent;
                        }
                    });
                }
                return packetsSent > 0;
            }));
            audioVideo.stopLocalVideoTile();
            yield this.stopMeeting();
            if (packetsSent <= 0) {
                return CheckVideoConnectivityFeedback_1.default.VideoNotSent;
            }
            return CheckVideoConnectivityFeedback_1.default.Succeeded;
        });
    }
    checkNetworkUDPConnectivity() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.originalURLRewriter = this.meetingSession.configuration.urls.urlRewriter;
            }
            catch (error) {
                this.logger.error(`MeetingSessionConfiguration.urls doesn't exist. Error: ${error}`);
                return CheckNetworkUDPConnectivityFeedback_1.default.MeetingSessionURLsNotInitialized;
            }
            this.meetingSession.configuration.urls.urlRewriter = (uri) => {
                const transformedUri = this.originalURLRewriter(uri);
                if (transformedUri.includes('transport=tcp')) {
                    return '';
                }
                return transformedUri;
            };
            const audioVideo = this.meetingSession.audioVideo;
            if (!(yield this.startMeeting())) {
                this.meetingSession.configuration.urls.urlRewriter = this.originalURLRewriter;
                return CheckNetworkUDPConnectivityFeedback_1.default.ConnectionFailed;
            }
            let candidatePairSucceed = false;
            yield this.executeTimeoutTask(() => __awaiter(this, void 0, void 0, function* () {
                const rawStats = yield audioVideo.getRTCPeerConnectionStats();
                if (rawStats) {
                    rawStats.forEach(report => {
                        if (report.type === 'candidate-pair' && report.state === 'succeeded') {
                            candidatePairSucceed = true;
                        }
                    });
                }
                return candidatePairSucceed;
            }));
            this.meetingSession.configuration.urls.urlRewriter = this.originalURLRewriter;
            yield this.stopMeeting();
            if (!candidatePairSucceed) {
                return CheckNetworkUDPConnectivityFeedback_1.default.ICENegotiationFailed;
            }
            return CheckNetworkUDPConnectivityFeedback_1.default.Succeeded;
        });
    }
    checkNetworkTCPConnectivity() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.originalURLRewriter = this.meetingSession.configuration.urls.urlRewriter;
            }
            catch (error) {
                this.logger.error(`MeetingSessionConfiguration.urls doesn't exist. Error: ${error}`);
                return CheckNetworkTCPConnectivityFeedback_1.default.MeetingSessionURLsNotInitialized;
            }
            this.meetingSession.configuration.urls.urlRewriter = (uri) => {
                const transformedUri = this.originalURLRewriter(uri);
                if (transformedUri.includes('transport=udp')) {
                    return '';
                }
                return transformedUri;
            };
            const audioVideo = this.meetingSession.audioVideo;
            if (!(yield this.startMeeting())) {
                this.meetingSession.configuration.urls.urlRewriter = this.originalURLRewriter;
                return CheckNetworkTCPConnectivityFeedback_1.default.ConnectionFailed;
            }
            let candidatePairSucceed = false;
            yield this.executeTimeoutTask(() => __awaiter(this, void 0, void 0, function* () {
                const rawStats = yield audioVideo.getRTCPeerConnectionStats();
                if (rawStats) {
                    rawStats.forEach(report => {
                        if (report.type === 'candidate-pair' && report.state === 'succeeded') {
                            candidatePairSucceed = true;
                        }
                    });
                }
                return candidatePairSucceed;
            }));
            this.meetingSession.configuration.urls.urlRewriter = this.originalURLRewriter;
            yield this.stopMeeting();
            if (!candidatePairSucceed) {
                return CheckNetworkTCPConnectivityFeedback_1.default.ICENegotiationFailed;
            }
            return CheckNetworkTCPConnectivityFeedback_1.default.Succeeded;
        });
    }
    startMeeting() {
        return __awaiter(this, void 0, void 0, function* () {
            let isStarted = false;
            const observer = {
                audioVideoDidStart: () => {
                    isStarted = true;
                },
            };
            this.meetingSession.audioVideo.addObserver(observer);
            this.meetingSession.audioVideo.start();
            yield this.executeTimeoutTask(() => __awaiter(this, void 0, void 0, function* () {
                return isStarted;
            }));
            this.meetingSession.audioVideo.removeObserver(observer);
            return isStarted;
        });
    }
    stopMeeting() {
        return __awaiter(this, void 0, void 0, function* () {
            let isStopped = false;
            const observer = {
                audioVideoDidStop: (_sessionStatus) => {
                    isStopped = true;
                },
            };
            this.meetingSession.audioVideo.addObserver(observer);
            this.meetingSession.audioVideo.stop();
            yield this.executeTimeoutTask(() => __awaiter(this, void 0, void 0, function* () {
                return isStopped;
            }));
            this.meetingSession.audioVideo.removeObserver(observer);
            return isStopped;
        });
    }
    executeTimeoutTask(conditionCheck) {
        return __awaiter(this, void 0, void 0, function* () {
            let isSuccess = false;
            class CheckForConditionTask extends BaseTask_1.default {
                constructor(logger, waitDurationMs) {
                    super(logger);
                    this.waitDurationMs = waitDurationMs;
                    this.isCancelled = false;
                }
                cancel() {
                    this.isCancelled = true;
                }
                run() {
                    return __awaiter(this, void 0, void 0, function* () {
                        while (!this.isCancelled) {
                            if (yield conditionCheck()) {
                                isSuccess = true;
                                break;
                            }
                            yield DefaultMeetingReadinessChecker.delay(this.waitDurationMs);
                        }
                    });
                }
            }
            const timeoutTask = new TimeoutTask_1.default(this.logger, new CheckForConditionTask(this.logger, this.configuration.waitDurationMs), this.configuration.timeoutMs);
            yield timeoutTask.run();
            return isSuccess;
        });
    }
}
exports.default = DefaultMeetingReadinessChecker;
//# sourceMappingURL=DefaultMeetingReadinessChecker.js.map