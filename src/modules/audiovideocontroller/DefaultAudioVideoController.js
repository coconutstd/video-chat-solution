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
const DefaultActiveSpeakerDetector_1 = require("../activespeakerdetector/DefaultActiveSpeakerDetector");
const DefaultAudioMixController_1 = require("../audiomixcontroller/DefaultAudioMixController");
const AudioProfile_1 = require("../audioprofile/AudioProfile");
const DefaultBrowserBehavior_1 = require("../browserbehavior/DefaultBrowserBehavior");
const ConnectionHealthData_1 = require("../connectionhealthpolicy/ConnectionHealthData");
const SignalingAndMetricsConnectionMonitor_1 = require("../connectionmonitor/SignalingAndMetricsConnectionMonitor");
const DefaultEventController_1 = require("../eventcontroller/DefaultEventController");
const Maybe_1 = require("../maybe/Maybe");
const MeetingSessionStatus_1 = require("../meetingsession/MeetingSessionStatus");
const MeetingSessionStatusCode_1 = require("../meetingsession/MeetingSessionStatusCode");
const MeetingSessionVideoAvailability_1 = require("../meetingsession/MeetingSessionVideoAvailability");
const DefaultPingPong_1 = require("../pingpong/DefaultPingPong");
const DefaultRealtimeController_1 = require("../realtimecontroller/DefaultRealtimeController");
const AsyncScheduler_1 = require("../scheduler/AsyncScheduler");
const DefaultSessionStateController_1 = require("../sessionstatecontroller/DefaultSessionStateController");
const SessionStateControllerAction_1 = require("../sessionstatecontroller/SessionStateControllerAction");
const SessionStateControllerState_1 = require("../sessionstatecontroller/SessionStateControllerState");
const SessionStateControllerTransitionResult_1 = require("../sessionstatecontroller/SessionStateControllerTransitionResult");
const DefaultSignalingClient_1 = require("../signalingclient/DefaultSignalingClient");
const SignalingProtocol_js_1 = require("../signalingprotocol/SignalingProtocol.js");
const DefaultStatsCollector_1 = require("../statscollector/DefaultStatsCollector");
const AttachMediaInputTask_1 = require("../task/AttachMediaInputTask");
const CleanRestartedSessionTask_1 = require("../task/CleanRestartedSessionTask");
const CleanStoppedSessionTask_1 = require("../task/CleanStoppedSessionTask");
const CreatePeerConnectionTask_1 = require("../task/CreatePeerConnectionTask");
const CreateSDPTask_1 = require("../task/CreateSDPTask");
const FinishGatheringICECandidatesTask_1 = require("../task/FinishGatheringICECandidatesTask");
const JoinAndReceiveIndexTask_1 = require("../task/JoinAndReceiveIndexTask");
const LeaveAndReceiveLeaveAckTask_1 = require("../task/LeaveAndReceiveLeaveAckTask");
const ListenForVolumeIndicatorsTask_1 = require("../task/ListenForVolumeIndicatorsTask");
const MonitorTask_1 = require("../task/MonitorTask");
const OpenSignalingConnectionTask_1 = require("../task/OpenSignalingConnectionTask");
const ParallelGroupTask_1 = require("../task/ParallelGroupTask");
const ReceiveAudioInputTask_1 = require("../task/ReceiveAudioInputTask");
const ReceiveTURNCredentialsTask_1 = require("../task/ReceiveTURNCredentialsTask");
const ReceiveVideoInputTask_1 = require("../task/ReceiveVideoInputTask");
const ReceiveVideoStreamIndexTask_1 = require("../task/ReceiveVideoStreamIndexTask");
const SendAndReceiveDataMessagesTask_1 = require("../task/SendAndReceiveDataMessagesTask");
const SerialGroupTask_1 = require("../task/SerialGroupTask");
const SetLocalDescriptionTask_1 = require("../task/SetLocalDescriptionTask");
const SetRemoteDescriptionTask_1 = require("../task/SetRemoteDescriptionTask");
const SubscribeAndReceiveSubscribeAckTask_1 = require("../task/SubscribeAndReceiveSubscribeAckTask");
const TimeoutTask_1 = require("../task/TimeoutTask");
const WaitForAttendeePresenceTask_1 = require("../task/WaitForAttendeePresenceTask");
const DefaultTransceiverController_1 = require("../transceivercontroller/DefaultTransceiverController");
const SimulcastTransceiverController_1 = require("../transceivercontroller/SimulcastTransceiverController");
const DefaultVideoCaptureAndEncodeParameter_1 = require("../videocaptureandencodeparameter/DefaultVideoCaptureAndEncodeParameter");
const AllHighestVideoBandwidthPolicy_1 = require("../videodownlinkbandwidthpolicy/AllHighestVideoBandwidthPolicy");
const VideoAdaptiveProbePolicy_1 = require("../videodownlinkbandwidthpolicy/VideoAdaptiveProbePolicy");
const DefaultVideoStreamIdSet_1 = require("../videostreamidset/DefaultVideoStreamIdSet");
const DefaultVideoStreamIndex_1 = require("../videostreamindex/DefaultVideoStreamIndex");
const SimulcastVideoStreamIndex_1 = require("../videostreamindex/SimulcastVideoStreamIndex");
const DefaultVideoTileController_1 = require("../videotilecontroller/DefaultVideoTileController");
const DefaultVideoTileFactory_1 = require("../videotilefactory/DefaultVideoTileFactory");
const DefaultSimulcastUplinkPolicy_1 = require("../videouplinkbandwidthpolicy/DefaultSimulcastUplinkPolicy");
const NScaleVideoUplinkBandwidthPolicy_1 = require("../videouplinkbandwidthpolicy/NScaleVideoUplinkBandwidthPolicy");
const DefaultVolumeIndicatorAdapter_1 = require("../volumeindicatoradapter/DefaultVolumeIndicatorAdapter");
const AudioVideoControllerState_1 = require("./AudioVideoControllerState");
class DefaultAudioVideoController {
    constructor(configuration, logger, webSocketAdapter, mediaStreamBroker, reconnectController) {
        this._audioProfile = new AudioProfile_1.default();
        this.connectionHealthData = new ConnectionHealthData_1.default();
        this.observerQueue = new Set();
        this.meetingSessionContext = new AudioVideoControllerState_1.default();
        this.enableSimulcast = false;
        this.totalRetryCount = 0;
        this._logger = logger;
        this.sessionStateController = new DefaultSessionStateController_1.default(this._logger);
        this._configuration = configuration;
        this.enableSimulcast =
            configuration.enableUnifiedPlanForChromiumBasedBrowsers &&
                configuration.enableSimulcastForUnifiedPlanChromiumBasedBrowsers &&
                new DefaultBrowserBehavior_1.default().hasChromiumWebRTC();
        this._webSocketAdapter = webSocketAdapter;
        this._realtimeController = new DefaultRealtimeController_1.default();
        this._realtimeController.realtimeSetLocalAttendeeId(configuration.credentials.attendeeId, configuration.credentials.externalUserId);
        this._activeSpeakerDetector = new DefaultActiveSpeakerDetector_1.default(this._realtimeController, configuration.credentials.attendeeId, this.handleHasBandwidthPriority.bind(this));
        this._mediaStreamBroker = mediaStreamBroker;
        this._reconnectController = reconnectController;
        this._videoTileController = new DefaultVideoTileController_1.default(new DefaultVideoTileFactory_1.default(), this, this._logger);
        this._audioMixController = new DefaultAudioMixController_1.default(this._logger);
        this.meetingSessionContext.logger = this._logger;
        this._eventController = new DefaultEventController_1.default(this);
    }
    get configuration() {
        return this._configuration;
    }
    get realtimeController() {
        return this._realtimeController;
    }
    get activeSpeakerDetector() {
        return this._activeSpeakerDetector;
    }
    get videoTileController() {
        return this._videoTileController;
    }
    get audioMixController() {
        return this._audioMixController;
    }
    get eventController() {
        return this._eventController;
    }
    get logger() {
        return this._logger;
    }
    get rtcPeerConnection() {
        return (this.meetingSessionContext && this.meetingSessionContext.peer) || null;
    }
    get mediaStreamBroker() {
        return this._mediaStreamBroker;
    }
    getRTCPeerConnectionStats(selector) {
        if (!this.rtcPeerConnection) {
            return null;
        }
        return this.rtcPeerConnection.getStats(selector);
    }
    setAudioProfile(audioProfile) {
        this._audioProfile = audioProfile;
    }
    addObserver(observer) {
        this.logger.info('adding meeting observer');
        this.observerQueue.add(observer);
    }
    removeObserver(observer) {
        this.logger.info('removing meeting observer');
        this.observerQueue.delete(observer);
    }
    forEachObserver(observerFunc) {
        for (const observer of this.observerQueue) {
            new AsyncScheduler_1.default().start(() => {
                if (this.observerQueue.has(observer)) {
                    observerFunc(observer);
                }
            });
        }
    }
    start() {
        this.sessionStateController.perform(SessionStateControllerAction_1.default.Connect, () => {
            this.actionConnect(false);
        });
    }
    actionConnect(reconnecting) {
        return __awaiter(this, void 0, void 0, function* () {
            this.connectionHealthData.reset();
            this.meetingSessionContext = new AudioVideoControllerState_1.default();
            this.meetingSessionContext.logger = this.logger;
            this.meetingSessionContext.eventController = this.eventController;
            this.meetingSessionContext.browserBehavior = new DefaultBrowserBehavior_1.default({
                enableUnifiedPlanForChromiumBasedBrowsers: this.configuration
                    .enableUnifiedPlanForChromiumBasedBrowsers,
            });
            this.meetingSessionContext.meetingSessionConfiguration = this.configuration;
            this.meetingSessionContext.signalingClient = new DefaultSignalingClient_1.default(this._webSocketAdapter, this.logger);
            this.meetingSessionContext.mediaStreamBroker = this._mediaStreamBroker;
            this.meetingSessionContext.realtimeController = this._realtimeController;
            this.meetingSessionContext.audioMixController = this._audioMixController;
            this.meetingSessionContext.audioVideoController = this;
            if (this.enableSimulcast) {
                this.meetingSessionContext.transceiverController = new SimulcastTransceiverController_1.default(this.logger, this.meetingSessionContext.browserBehavior);
            }
            else {
                this.meetingSessionContext.transceiverController = new DefaultTransceiverController_1.default(this.logger, this.meetingSessionContext.browserBehavior);
            }
            this.meetingSessionContext.volumeIndicatorAdapter = new DefaultVolumeIndicatorAdapter_1.default(this.logger, this._realtimeController, DefaultAudioVideoController.MIN_VOLUME_DECIBELS, DefaultAudioVideoController.MAX_VOLUME_DECIBELS);
            this.meetingSessionContext.videoTileController = this._videoTileController;
            this.meetingSessionContext.videoDownlinkBandwidthPolicy = this.configuration.videoDownlinkBandwidthPolicy;
            this.meetingSessionContext.videoUplinkBandwidthPolicy = this.configuration.videoUplinkBandwidthPolicy;
            this.meetingSessionContext.enableSimulcast = this.enableSimulcast;
            if (this.enableSimulcast) {
                const simulcastPolicy = new DefaultSimulcastUplinkPolicy_1.default(this.configuration.credentials.attendeeId, this.meetingSessionContext.logger);
                simulcastPolicy.addObserver(this);
                this.meetingSessionContext.videoUplinkBandwidthPolicy = simulcastPolicy;
                this.meetingSessionContext.videoDownlinkBandwidthPolicy = new VideoAdaptiveProbePolicy_1.default(this.logger, this.meetingSessionContext.videoTileController);
                this.meetingSessionContext.videoStreamIndex = new SimulcastVideoStreamIndex_1.default(this.logger);
            }
            else {
                this.meetingSessionContext.enableSimulcast = false;
                this.meetingSessionContext.videoStreamIndex = new DefaultVideoStreamIndex_1.default(this.logger);
                if (!this.meetingSessionContext.videoDownlinkBandwidthPolicy) {
                    this.meetingSessionContext.videoDownlinkBandwidthPolicy = new AllHighestVideoBandwidthPolicy_1.default(this.configuration.credentials.attendeeId);
                }
                if (!this.meetingSessionContext.videoUplinkBandwidthPolicy) {
                    this.meetingSessionContext.videoUplinkBandwidthPolicy = new NScaleVideoUplinkBandwidthPolicy_1.default(this.configuration.credentials.attendeeId);
                }
                this.meetingSessionContext.audioProfile = this._audioProfile;
            }
            this.meetingSessionContext.lastKnownVideoAvailability = new MeetingSessionVideoAvailability_1.default();
            this.meetingSessionContext.videoCaptureAndEncodeParameter = new DefaultVideoCaptureAndEncodeParameter_1.default(0, 0, 0, 0, false);
            this.meetingSessionContext.videosToReceive = new DefaultVideoStreamIdSet_1.default();
            this.meetingSessionContext.videosPaused = new DefaultVideoStreamIdSet_1.default();
            this.meetingSessionContext.statsCollector = new DefaultStatsCollector_1.default(this, this.logger, this.meetingSessionContext.browserBehavior);
            this.meetingSessionContext.connectionMonitor = new SignalingAndMetricsConnectionMonitor_1.default(this, this._realtimeController, this._videoTileController, this.connectionHealthData, new DefaultPingPong_1.default(this.meetingSessionContext.signalingClient, DefaultAudioVideoController.PING_PONG_INTERVAL_MS, this.logger), this.meetingSessionContext.statsCollector);
            this.meetingSessionContext.reconnectController = this._reconnectController;
            this.meetingSessionContext.audioDeviceInformation = {};
            this.meetingSessionContext.videoDeviceInformation = {};
            if (!reconnecting) {
                this.totalRetryCount = 0;
                this._reconnectController.reset();
                this.forEachObserver(observer => {
                    Maybe_1.default.of(observer.audioVideoDidStartConnecting).map(f => f.bind(observer)(false));
                });
                /* istanbul ignore else */
                if (this.eventController) {
                    this.eventController.publishEvent('meetingStartRequested');
                }
            }
            if (this._reconnectController.hasStartedConnectionAttempt()) {
                // This does not reset the reconnect deadline, but declare it's not the first connection.
                this._reconnectController.startedConnectionAttempt(false);
            }
            else {
                this._reconnectController.startedConnectionAttempt(true);
            }
            try {
                yield new SerialGroupTask_1.default(this.logger, this.wrapTaskName('AudioVideoStart'), [
                    new MonitorTask_1.default(this.meetingSessionContext, this.configuration.connectionHealthPolicyConfiguration, this.connectionHealthData),
                    new ReceiveAudioInputTask_1.default(this.meetingSessionContext),
                    new TimeoutTask_1.default(this.logger, new SerialGroupTask_1.default(this.logger, 'Media', [
                        new SerialGroupTask_1.default(this.logger, 'Signaling', [
                            new OpenSignalingConnectionTask_1.default(this.meetingSessionContext),
                            new ListenForVolumeIndicatorsTask_1.default(this.meetingSessionContext),
                            new SendAndReceiveDataMessagesTask_1.default(this.meetingSessionContext),
                            new JoinAndReceiveIndexTask_1.default(this.meetingSessionContext),
                            new ReceiveTURNCredentialsTask_1.default(this.meetingSessionContext),
                            // TODO: ensure index handler does not race with incoming index update
                            new ReceiveVideoStreamIndexTask_1.default(this.meetingSessionContext),
                        ]),
                        new SerialGroupTask_1.default(this.logger, 'Peer', [
                            new CreatePeerConnectionTask_1.default(this.meetingSessionContext),
                            new AttachMediaInputTask_1.default(this.meetingSessionContext),
                            new CreateSDPTask_1.default(this.meetingSessionContext),
                            new SetLocalDescriptionTask_1.default(this.meetingSessionContext),
                            new FinishGatheringICECandidatesTask_1.default(this.meetingSessionContext),
                            new SubscribeAndReceiveSubscribeAckTask_1.default(this.meetingSessionContext),
                            this.meetingSessionContext.meetingSessionConfiguration.attendeePresenceTimeoutMs > 0
                                ? new TimeoutTask_1.default(this.logger, new ParallelGroupTask_1.default(this.logger, 'FinalizeConnection', [
                                    new WaitForAttendeePresenceTask_1.default(this.meetingSessionContext),
                                    new SetRemoteDescriptionTask_1.default(this.meetingSessionContext),
                                ]), this.meetingSessionContext.meetingSessionConfiguration.attendeePresenceTimeoutMs)
                                : new SetRemoteDescriptionTask_1.default(this.meetingSessionContext),
                        ]),
                    ]), this.configuration.connectionTimeoutMs),
                ]).run();
                this.sessionStateController.perform(SessionStateControllerAction_1.default.FinishConnecting, () => {
                    /* istanbul ignore else */
                    if (this.eventController) {
                        this.eventController.publishEvent('meetingStartSucceeded', {
                            maxVideoTileCount: this.meetingSessionContext.maxVideoTileCount,
                            poorConnectionCount: this.meetingSessionContext.poorConnectionCount,
                            retryCount: this.totalRetryCount,
                            signalingOpenDurationMs: this.meetingSessionContext.signalingOpenDurationMs,
                        });
                    }
                    this.meetingSessionContext.startTimeMs = Date.now();
                    this.actionFinishConnecting();
                });
            }
            catch (error) {
                this.sessionStateController.perform(SessionStateControllerAction_1.default.Fail, () => __awaiter(this, void 0, void 0, function* () {
                    const status = new MeetingSessionStatus_1.default(this.getMeetingStatusCode(error) || MeetingSessionStatusCode_1.default.TaskFailed);
                    yield this.actionDisconnect(status, true, error);
                    if (!this.handleMeetingSessionStatus(status, error)) {
                        this.notifyStop(status, error);
                    }
                }));
            }
            this.connectionHealthData.setConnectionStartTime();
        });
    }
    actionFinishConnecting() {
        this.meetingSessionContext.videoDuplexMode = SignalingProtocol_js_1.SdkStreamServiceType.RX;
        if (!this.meetingSessionContext.enableSimulcast) {
            this.enforceBandwidthLimitationForSender(this.meetingSessionContext.videoCaptureAndEncodeParameter.encodeBitrates()[0]);
        }
        this.forEachObserver(observer => {
            Maybe_1.default.of(observer.audioVideoDidStart).map(f => f.bind(observer)());
        });
        this._reconnectController.reset();
    }
    stop() {
        this.sessionStateController.perform(SessionStateControllerAction_1.default.Disconnect, () => {
            this.actionDisconnect(new MeetingSessionStatus_1.default(MeetingSessionStatusCode_1.default.Left), false, null);
        });
    }
    actionDisconnect(status, reconnecting, error) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield new SerialGroupTask_1.default(this.logger, this.wrapTaskName('AudioVideoStop'), [
                    new TimeoutTask_1.default(this.logger, new LeaveAndReceiveLeaveAckTask_1.default(this.meetingSessionContext), this.configuration.connectionTimeoutMs),
                ]).run();
            }
            catch (stopError) {
                this.logger.info('fail to stop');
            }
            try {
                yield new SerialGroupTask_1.default(this.logger, this.wrapTaskName('AudioVideoClean'), [
                    new TimeoutTask_1.default(this.logger, new CleanStoppedSessionTask_1.default(this.meetingSessionContext), this.configuration.connectionTimeoutMs),
                ]).run();
            }
            catch (cleanError) {
                this.logger.info('fail to clean');
            }
            this.sessionStateController.perform(SessionStateControllerAction_1.default.FinishDisconnecting, () => {
                if (!reconnecting) {
                    this.notifyStop(status, error);
                }
            });
        });
    }
    update() {
        const result = this.sessionStateController.perform(SessionStateControllerAction_1.default.Update, () => {
            this.actionUpdate(true);
        });
        return (result === SessionStateControllerTransitionResult_1.default.Transitioned ||
            result === SessionStateControllerTransitionResult_1.default.DeferredTransition);
    }
    restartLocalVideo(callback) {
        const restartVideo = () => __awaiter(this, void 0, void 0, function* () {
            if (this._videoTileController.hasStartedLocalVideoTile()) {
                this.logger.info('stopping local video tile prior to local video restart');
                this._videoTileController.stopLocalVideoTile();
                this.logger.info('preparing local video restart update');
                yield this.actionUpdate(false);
                this.logger.info('starting local video tile for local video restart');
                this._videoTileController.startLocalVideoTile();
            }
            this.logger.info('finalizing local video restart update');
            yield this.actionUpdate(true);
            callback();
        });
        const result = this.sessionStateController.perform(SessionStateControllerAction_1.default.Update, () => {
            restartVideo();
        });
        return (result === SessionStateControllerTransitionResult_1.default.Transitioned ||
            result === SessionStateControllerTransitionResult_1.default.DeferredTransition);
    }
    restartLocalAudio(callback) {
        return __awaiter(this, void 0, void 0, function* () {
            let audioStream = null;
            try {
                audioStream = yield this.mediaStreamBroker.acquireAudioInputStream();
            }
            catch (error) {
                this.logger.info('could not acquire audio stream from mediaStreamBroker');
            }
            if (!audioStream || audioStream.getAudioTracks().length < 1) {
                throw new Error('could not acquire audio track');
            }
            this.connectionHealthData.reset();
            this.connectionHealthData.setConnectionStartTime();
            const audioTrack = audioStream.getAudioTracks()[0];
            if (!this.meetingSessionContext || !this.meetingSessionContext.peer) {
                throw new Error('no active meeting and peer connection');
            }
            let replaceTrackSuccess = false;
            if (this.meetingSessionContext.browserBehavior.requiresUnifiedPlan()) {
                replaceTrackSuccess = yield this.meetingSessionContext.transceiverController.replaceAudioTrack(audioTrack);
            }
            else {
                replaceTrackSuccess = yield DefaultTransceiverController_1.default.replaceAudioTrackForSender(this.meetingSessionContext.localAudioSender, audioTrack);
            }
            this.meetingSessionContext.activeAudioInput = audioStream;
            callback();
            if (replaceTrackSuccess) {
                return Promise.resolve();
            }
            else {
                return Promise.reject();
            }
        });
    }
    actionUpdate(notify) {
        return __awaiter(this, void 0, void 0, function* () {
            // TODO: do not block other updates while waiting for video input
            try {
                yield new SerialGroupTask_1.default(this.logger, this.wrapTaskName('AudioVideoUpdate'), [
                    new ReceiveVideoInputTask_1.default(this.meetingSessionContext),
                    new TimeoutTask_1.default(this.logger, new SerialGroupTask_1.default(this.logger, 'UpdateSession', [
                        new AttachMediaInputTask_1.default(this.meetingSessionContext),
                        new CreateSDPTask_1.default(this.meetingSessionContext),
                        new SetLocalDescriptionTask_1.default(this.meetingSessionContext),
                        new FinishGatheringICECandidatesTask_1.default(this.meetingSessionContext),
                        new SubscribeAndReceiveSubscribeAckTask_1.default(this.meetingSessionContext),
                        new SetRemoteDescriptionTask_1.default(this.meetingSessionContext),
                    ]), this.configuration.connectionTimeoutMs),
                ]).run();
                if (notify) {
                    this.sessionStateController.perform(SessionStateControllerAction_1.default.FinishUpdating, () => {
                        this.actionFinishUpdating();
                    });
                }
            }
            catch (error) {
                this.sessionStateController.perform(SessionStateControllerAction_1.default.FinishUpdating, () => {
                    const status = new MeetingSessionStatus_1.default(this.getMeetingStatusCode(error) || MeetingSessionStatusCode_1.default.TaskFailed);
                    if (status.statusCode() !== MeetingSessionStatusCode_1.default.IncompatibleSDP) {
                        this.logger.info('failed to update audio-video session');
                    }
                    this.handleMeetingSessionStatus(status, error);
                });
            }
        });
    }
    notifyStop(status, error) {
        this.forEachObserver(observer => {
            Maybe_1.default.of(observer.audioVideoDidStop).map(f => f.bind(observer)(status));
        });
        /* istanbul ignore else */
        if (this.eventController) {
            const { signalingOpenDurationMs, poorConnectionCount, startTimeMs, } = this.meetingSessionContext;
            const attributes = {
                maxVideoTileCount: this.meetingSessionContext.maxVideoTileCount,
                meetingDurationMs: startTimeMs === null ? 0 : Math.round(Date.now() - startTimeMs),
                meetingStatus: MeetingSessionStatusCode_1.default[status.statusCode()],
                signalingOpenDurationMs,
                poorConnectionCount,
                retryCount: this.totalRetryCount,
            };
            if (attributes.meetingDurationMs === 0) {
                attributes.meetingErrorMessage = (error && error.message) || '';
                delete attributes.meetingDurationMs;
                this.eventController.publishEvent('meetingStartFailed', attributes);
            }
            else if (status.isFailure() || status.isAudioConnectionFailure()) {
                attributes.meetingErrorMessage = (error && error.message) || '';
                this.eventController.publishEvent('meetingFailed', attributes);
            }
            else {
                this.eventController.publishEvent('meetingEnded', attributes);
            }
        }
    }
    actionFinishUpdating() {
        // we do not update parameter for simulcast since they are updated in AttachMediaInputTask
        if (!this.meetingSessionContext.enableSimulcast) {
            const maxBitrateKbps = this.meetingSessionContext.videoCaptureAndEncodeParameter.encodeBitrates()[0];
            this.enforceBandwidthLimitationForSender(maxBitrateKbps);
        }
        this.logger.info('updated audio-video session');
    }
    reconnect(status, error) {
        const willRetry = this._reconnectController.retryWithBackoff(() => __awaiter(this, void 0, void 0, function* () {
            if (this.sessionStateController.state() === SessionStateControllerState_1.default.NotConnected) {
                this.sessionStateController.perform(SessionStateControllerAction_1.default.Connect, () => {
                    this.actionConnect(true);
                });
            }
            else {
                this.sessionStateController.perform(SessionStateControllerAction_1.default.Reconnect, () => {
                    this.actionReconnect();
                });
            }
            this.totalRetryCount += 1;
        }), () => {
            this.logger.info('canceled retry');
        });
        if (!willRetry) {
            this.sessionStateController.perform(SessionStateControllerAction_1.default.Fail, () => {
                this.actionDisconnect(status, false, error);
            });
        }
        return willRetry;
    }
    actionReconnect() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this._reconnectController.hasStartedConnectionAttempt()) {
                this._reconnectController.startedConnectionAttempt(false);
                this.forEachObserver(observer => {
                    Maybe_1.default.of(observer.audioVideoDidStartConnecting).map(f => f.bind(observer)(true));
                });
            }
            this.connectionHealthData.reset();
            try {
                yield new SerialGroupTask_1.default(this.logger, this.wrapTaskName('AudioVideoReconnect'), [
                    new TimeoutTask_1.default(this.logger, new SerialGroupTask_1.default(this.logger, 'Media', [
                        new CleanRestartedSessionTask_1.default(this.meetingSessionContext),
                        new SerialGroupTask_1.default(this.logger, 'Signaling', [
                            new OpenSignalingConnectionTask_1.default(this.meetingSessionContext),
                            new JoinAndReceiveIndexTask_1.default(this.meetingSessionContext),
                            new ReceiveTURNCredentialsTask_1.default(this.meetingSessionContext),
                        ]),
                        new CreatePeerConnectionTask_1.default(this.meetingSessionContext),
                    ]), this.configuration.connectionTimeoutMs),
                    // TODO: Do we need ReceiveVideoInputTask in the reconnect operation?
                    new ReceiveVideoInputTask_1.default(this.meetingSessionContext),
                    new TimeoutTask_1.default(this.logger, new SerialGroupTask_1.default(this.logger, 'UpdateSession', [
                        new AttachMediaInputTask_1.default(this.meetingSessionContext),
                        new CreateSDPTask_1.default(this.meetingSessionContext),
                        new SetLocalDescriptionTask_1.default(this.meetingSessionContext),
                        new FinishGatheringICECandidatesTask_1.default(this.meetingSessionContext),
                        new SubscribeAndReceiveSubscribeAckTask_1.default(this.meetingSessionContext),
                        new SetRemoteDescriptionTask_1.default(this.meetingSessionContext),
                    ]), this.configuration.connectionTimeoutMs),
                ]).run();
                this.sessionStateController.perform(SessionStateControllerAction_1.default.FinishConnecting, () => {
                    /* istanbul ignore else */
                    if (this.eventController) {
                        this.eventController.pushMeetingState('meetingReconnected');
                    }
                    this.actionFinishConnecting();
                });
            }
            catch (error) {
                // To perform the "Reconnect" action again, the session should be in the "Connected" state.
                this.sessionStateController.perform(SessionStateControllerAction_1.default.FinishConnecting, () => {
                    this.logger.info('failed to reconnect audio-video session');
                    const status = new MeetingSessionStatus_1.default(this.getMeetingStatusCode(error) || MeetingSessionStatusCode_1.default.TaskFailed);
                    this.handleMeetingSessionStatus(status, error);
                });
            }
            this.connectionHealthData.setConnectionStartTime();
        });
    }
    wrapTaskName(taskName) {
        return `${taskName}/${this.configuration.meetingId}/${this.configuration.credentials.attendeeId}`;
    }
    getMeetingStatusCode(error) {
        const matched = /the meeting status code: (\d+)/.exec(error && error.message);
        if (matched && matched.length > 1) {
            return Number(matched[1]);
        }
        else {
            return null;
        }
    }
    enforceBandwidthLimitationForSender(maxBitrateKbps) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.meetingSessionContext.browserBehavior.requiresUnifiedPlan()) {
                yield this.meetingSessionContext.transceiverController.setVideoSendingBitrateKbps(maxBitrateKbps);
            }
            else {
                yield DefaultTransceiverController_1.default.setVideoSendingBitrateKbpsForSender(this.meetingSessionContext.localVideoSender, maxBitrateKbps, this.meetingSessionContext.logger);
            }
        });
    }
    handleMeetingSessionStatus(status, error) {
        this.logger.info(`handling status: ${MeetingSessionStatusCode_1.default[status.statusCode()]}`);
        if (!status.isTerminal()) {
            if (this.meetingSessionContext.statsCollector) {
                this.meetingSessionContext.statsCollector.logMeetingSessionStatus(status);
            }
        }
        if (status.statusCode() === MeetingSessionStatusCode_1.default.IncompatibleSDP) {
            this.restartLocalVideo(() => {
                this.logger.info('handled incompatible SDP by attempting to restart video');
            });
            return true;
        }
        if (status.statusCode() === MeetingSessionStatusCode_1.default.VideoCallSwitchToViewOnly) {
            this._videoTileController.removeLocalVideoTile();
            this.forEachObserver((observer) => {
                Maybe_1.default.of(observer.videoSendDidBecomeUnavailable).map(f => f.bind(observer)());
            });
            return false;
        }
        if (status.isTerminal()) {
            this.logger.error('session will not be reconnected');
            if (this.meetingSessionContext.reconnectController) {
                this.meetingSessionContext.reconnectController.disableReconnect();
            }
        }
        if (status.isFailure() || status.isTerminal()) {
            if (this.meetingSessionContext.reconnectController) {
                const willRetry = this.reconnect(status, error);
                if (willRetry) {
                    this.logger.warn(`will retry due to status code ${MeetingSessionStatusCode_1.default[status.statusCode()]}${error ? ` and error: ${error.message}` : ``}`);
                }
                else {
                    this.logger.error(`failed with status code ${MeetingSessionStatusCode_1.default[status.statusCode()]}${error ? ` and error: ${error.message}` : ``}`);
                }
                return willRetry;
            }
        }
        return false;
    }
    setVideoMaxBandwidthKbps(maxBandwidthKbps) {
        if (this.meetingSessionContext && this.meetingSessionContext.videoUplinkBandwidthPolicy) {
            this.logger.info(`video send has ideal max bandwidth ${maxBandwidthKbps} kbps`);
            this.meetingSessionContext.videoUplinkBandwidthPolicy.setIdealMaxBandwidthKbps(maxBandwidthKbps);
        }
    }
    handleHasBandwidthPriority(hasBandwidthPriority) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.meetingSessionContext &&
                this.meetingSessionContext.videoUplinkBandwidthPolicy &&
                !this.meetingSessionContext.enableSimulcast) {
                const oldMaxBandwidth = this.meetingSessionContext.videoUplinkBandwidthPolicy.maxBandwidthKbps();
                this.meetingSessionContext.videoUplinkBandwidthPolicy.setHasBandwidthPriority(hasBandwidthPriority);
                const newMaxBandwidth = this.meetingSessionContext.videoUplinkBandwidthPolicy.maxBandwidthKbps();
                if (oldMaxBandwidth !== newMaxBandwidth) {
                    this.logger.info(`video send bandwidth priority ${hasBandwidthPriority} max has changed from ${oldMaxBandwidth} kbps to ${newMaxBandwidth} kbps`);
                    yield this.enforceBandwidthLimitationForSender(newMaxBandwidth);
                }
            }
        });
    }
    pauseReceivingStream(streamId) {
        if (!!this.meetingSessionContext && this.meetingSessionContext.signalingClient) {
            this.meetingSessionContext.signalingClient.pause([streamId]);
        }
    }
    resumeReceivingStream(streamId) {
        if (!!this.meetingSessionContext && this.meetingSessionContext.signalingClient) {
            this.meetingSessionContext.signalingClient.resume([streamId]);
        }
    }
    getRemoteVideoSources() {
        const { videoStreamIndex } = this.meetingSessionContext;
        if (!videoStreamIndex) {
            this.logger.info('meeting has not started');
            return [];
        }
        const selfAttendeeId = this.configuration.credentials.attendeeId;
        return videoStreamIndex.allVideoSendingSourcesExcludingSelf(selfAttendeeId);
    }
    encodingSimulcastLayersDidChange(simulcastLayers) {
        this.forEachObserver(observer => {
            Maybe_1.default.of(observer.encodingSimulcastLayersDidChange).map(f => f.bind(observer)(simulcastLayers));
        });
    }
}
exports.default = DefaultAudioVideoController;
DefaultAudioVideoController.MIN_VOLUME_DECIBELS = -42;
DefaultAudioVideoController.MAX_VOLUME_DECIBELS = -14;
DefaultAudioVideoController.PING_PONG_INTERVAL_MS = 10000;
//# sourceMappingURL=DefaultAudioVideoController.js.map