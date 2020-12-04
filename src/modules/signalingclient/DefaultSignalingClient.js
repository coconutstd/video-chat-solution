"use strict";
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
const DefaultBrowserBehavior_1 = require("../browserbehavior/DefaultBrowserBehavior");
const SignalingProtocol_js_1 = require("../signalingprotocol/SignalingProtocol.js");
const Versioning_1 = require("../versioning/Versioning");
const WebSocketReadyState_1 = require("../websocketadapter/WebSocketReadyState");
const SignalingClientEvent_1 = require("./SignalingClientEvent");
const SignalingClientEventType_1 = require("./SignalingClientEventType");
/**
 * [[DefaultSignalingClient]] implements the SignalingClient interface.
 */
class DefaultSignalingClient {
    constructor(webSocket, logger) {
        this.webSocket = webSocket;
        this.logger = logger;
        this.unloadHandler = null;
        this.observerQueue = new Set();
        this.connectionRequestQueue = [];
        this.resetConnection();
        this.logger.debug(() => 'signaling client init');
        this.audioSessionId = this.generateNewAudioSessionId();
    }
    registerObserver(observer) {
        this.logger.debug(() => 'registering signaling client observer');
        this.observerQueue.add(observer);
    }
    removeObserver(observer) {
        this.logger.debug(() => 'removing signaling client observer');
        this.observerQueue.delete(observer);
    }
    openConnection(request) {
        this.logger.info('adding connection request to queue: ' + request.url());
        this.connectionRequestQueue.push(request);
        this.closeConnection();
    }
    pingPong(pingPongFrame) {
        this.logger.debug(() => 'sending ping');
        const message = SignalingProtocol_js_1.SdkSignalFrame.create();
        message.type = SignalingProtocol_js_1.SdkSignalFrame.Type.PING_PONG;
        message.pingPong = pingPongFrame;
        this.sendMessage(message);
        return message.timestampMs;
    }
    join(settings) {
        this.logger.info('sending join');
        const joinFrame = SignalingProtocol_js_1.SdkJoinFrame.create();
        joinFrame.protocolVersion = 2;
        joinFrame.maxNumOfVideos = settings.maxVideos;
        joinFrame.flags = SignalingProtocol_js_1.SdkJoinFlags.HAS_STREAM_UPDATE;
        // Only Chrome currently supports the new send side bandwidth estimation
        const browserBehavior = new DefaultBrowserBehavior_1.default();
        if (browserBehavior.hasChromiumWebRTC()) {
            joinFrame.flags |= SignalingProtocol_js_1.SdkJoinFlags.USE_SEND_SIDE_BWE;
        }
        joinFrame.flags |= settings.sendBitrates ? SignalingProtocol_js_1.SdkJoinFlags.SEND_BITRATES : 0;
        joinFrame.clientDetails = SignalingProtocol_js_1.SdkClientDetails.create({
            platformName: browserBehavior.name(),
            platformVersion: browserBehavior.version(),
            clientSource: Versioning_1.default.sdkName,
            chimeSdkVersion: Versioning_1.default.sdkVersion,
        });
        joinFrame.audioSessionId = this.audioSessionId;
        const message = SignalingProtocol_js_1.SdkSignalFrame.create();
        message.type = SignalingProtocol_js_1.SdkSignalFrame.Type.JOIN;
        message.join = joinFrame;
        this.sendMessage(message);
    }
    subscribe(settings) {
        const subscribeFrame = SignalingProtocol_js_1.SdkSubscribeFrame.create();
        subscribeFrame.sendStreams = [];
        subscribeFrame.sdpOffer = settings.sdpOffer;
        subscribeFrame.audioCheckin = settings.audioCheckin;
        subscribeFrame.audioHost = settings.audioHost;
        subscribeFrame.audioMuted = settings.audioMuted;
        if (settings.connectionTypeHasVideo) {
            subscribeFrame.receiveStreamIds = settings.receiveStreamIds;
        }
        subscribeFrame.duplex = SignalingProtocol_js_1.SdkStreamServiceType.RX;
        if (!settings.audioCheckin) {
            const audioStream = SignalingProtocol_js_1.SdkStreamDescriptor.create();
            audioStream.mediaType = SignalingProtocol_js_1.SdkStreamMediaType.AUDIO;
            audioStream.trackLabel = 'AmazonChimeExpressAudio';
            audioStream.attendeeId = settings.attendeeId;
            audioStream.streamId = 1;
            audioStream.groupId = 1;
            audioStream.framerate = 15;
            audioStream.maxBitrateKbps = 600;
            audioStream.avgBitrateBps = 400000;
            subscribeFrame.sendStreams.push(audioStream);
        }
        if (settings.localVideoEnabled) {
            subscribeFrame.duplex = SignalingProtocol_js_1.SdkStreamServiceType.DUPLEX;
            for (let i = 0; i < settings.videoStreamDescriptions.length; i++) {
                // Non-simulcast use DefaultVideoStreamIndex.localStreamDescriptions
                // which is the exact old behavior
                const streamDescription = settings.videoStreamDescriptions[i].clone();
                streamDescription.attendeeId = settings.attendeeId;
                subscribeFrame.sendStreams.push(streamDescription.toStreamDescriptor());
            }
        }
        const message = SignalingProtocol_js_1.SdkSignalFrame.create();
        message.type = SignalingProtocol_js_1.SdkSignalFrame.Type.SUBSCRIBE;
        message.sub = subscribeFrame;
        this.sendMessage(message);
    }
    leave() {
        const message = SignalingProtocol_js_1.SdkSignalFrame.create();
        message.type = SignalingProtocol_js_1.SdkSignalFrame.Type.LEAVE;
        message.leave = SignalingProtocol_js_1.SdkLeaveFrame.create();
        this.sendMessage(message);
        this.logger.debug(() => {
            return 'sent leave';
        });
    }
    sendClientMetrics(clientMetricFrame) {
        const message = SignalingProtocol_js_1.SdkSignalFrame.create();
        message.type = SignalingProtocol_js_1.SdkSignalFrame.Type.CLIENT_METRIC;
        message.clientMetric = clientMetricFrame;
        this.sendMessage(message);
    }
    sendDataMessage(messageFrame) {
        const message = SignalingProtocol_js_1.SdkSignalFrame.create();
        message.type = SignalingProtocol_js_1.SdkSignalFrame.Type.DATA_MESSAGE;
        message.dataMessage = messageFrame;
        this.sendMessage(message);
    }
    closeConnection() {
        if (this.webSocket.readyState() !== WebSocketReadyState_1.default.None &&
            this.webSocket.readyState() !== WebSocketReadyState_1.default.Closed) {
            this.isClosing = true;
            this.sendEvent(new SignalingClientEvent_1.default(this, SignalingClientEventType_1.default.WebSocketClosing, null));
            this.webSocket.close();
            this.deactivatePageUnloadHandler();
        }
        else {
            this.logger.info('no existing connection needs closing');
            this.serviceConnectionRequestQueue();
        }
    }
    ready() {
        return (this.webSocket.readyState() === WebSocketReadyState_1.default.Open && !this.isClosing && this.wasOpened);
    }
    mute(muted) {
        const message = SignalingProtocol_js_1.SdkSignalFrame.create();
        message.type = SignalingProtocol_js_1.SdkSignalFrame.Type.AUDIO_CONTROL;
        const audioControl = SignalingProtocol_js_1.SdkAudioControlFrame.create();
        audioControl.muted = muted;
        message.audioControl = audioControl;
        this.sendMessage(message);
    }
    pause(streamIds) {
        const message = SignalingProtocol_js_1.SdkSignalFrame.create();
        message.type = SignalingProtocol_js_1.SdkSignalFrame.Type.PAUSE;
        message.pause = SignalingProtocol_js_1.SdkPauseResumeFrame.create();
        message.pause.streamIds = streamIds;
        this.sendMessage(message);
    }
    resume(streamIds) {
        const message = SignalingProtocol_js_1.SdkSignalFrame.create();
        message.type = SignalingProtocol_js_1.SdkSignalFrame.Type.RESUME;
        message.pause = SignalingProtocol_js_1.SdkPauseResumeFrame.create();
        message.pause.streamIds = streamIds;
        this.sendMessage(message);
    }
    resetConnection() {
        this.webSocket.destroy();
        this.wasOpened = false;
    }
    sendMessage(message) {
        message.timestampMs = Date.now();
        this.logger.debug(() => `sending: ${JSON.stringify(message)}`);
        const buffer = this.prependWithFrameTypeRTC(SignalingProtocol_js_1.SdkSignalFrame.encode(message).finish());
        if (this.ready()) {
            if (!this.webSocket.send(buffer)) {
                this.sendEvent(new SignalingClientEvent_1.default(this, SignalingClientEventType_1.default.WebSocketSendMessageFailure, null));
                return;
            }
            this.sendEvent(new SignalingClientEvent_1.default(this, SignalingClientEventType_1.default.WebSocketSentMessage, null));
        }
        else {
            this.sendEvent(new SignalingClientEvent_1.default(this, SignalingClientEventType_1.default.WebSocketSkippedMessage, null));
        }
    }
    receiveMessage(inBuffer) {
        let message;
        try {
            message = SignalingProtocol_js_1.SdkSignalFrame.decode(inBuffer);
        }
        catch (e) {
            this.logger.info(`failed to decode: ${inBuffer}`);
            this.sendEvent(new SignalingClientEvent_1.default(this, SignalingClientEventType_1.default.ProtocolDecodeFailure, null));
            return;
        }
        this.logger.debug(() => `received: ${JSON.stringify(message)}`);
        if (this.webSocket.readyState() === WebSocketReadyState_1.default.Open) {
            this.sendEvent(new SignalingClientEvent_1.default(this, SignalingClientEventType_1.default.ReceivedSignalFrame, message));
        }
        else {
            this.logger.info(`skipping notification of message since WebSocket is not open: ${JSON.stringify(message)}`);
        }
    }
    stripFrameTypeRTC(inBuffer) {
        const frameType = inBuffer[0];
        // TODO: change server frame type to send 0x05
        if (frameType !== DefaultSignalingClient.FRAME_TYPE_RTC && frameType !== 0x02) {
            this.logger.warn(`expected FrameTypeRTC for message but got ${frameType}`);
        }
        return inBuffer.slice(1);
    }
    prependWithFrameTypeRTC(inBuffer) {
        const outBuffer = new Uint8Array(inBuffer.length + 1);
        outBuffer[0] = DefaultSignalingClient.FRAME_TYPE_RTC;
        outBuffer.set(inBuffer, 1);
        return outBuffer;
    }
    serviceConnectionRequestQueue() {
        if (this.connectionRequestQueue.length === 0) {
            this.logger.info('no connection requests to service');
            return;
        }
        const request = this.connectionRequestQueue.shift();
        this.logger.info(`opening connection to ${request.url()}`);
        this.isClosing = false;
        this.webSocket.create(request.url(), request.protocols());
        this.setUpEventListeners();
        this.sendEvent(new SignalingClientEvent_1.default(this, SignalingClientEventType_1.default.WebSocketConnecting, null));
    }
    sendEvent(event) {
        switch (event.type) {
            case SignalingClientEventType_1.default.WebSocketMessage:
            case SignalingClientEventType_1.default.ReceivedSignalFrame:
            case SignalingClientEventType_1.default.WebSocketSentMessage:
                this.logger.debug(() => `notifying event: ${SignalingClientEventType_1.default[event.type]}`);
                break;
            case SignalingClientEventType_1.default.WebSocketSkippedMessage:
                this.logger.debug(() => `notifying event: ${SignalingClientEventType_1.default[event.type]}, websocket state=${WebSocketReadyState_1.default[this.webSocket.readyState()]}`);
                break;
            default:
                this.logger.info(`notifying event: ${SignalingClientEventType_1.default[event.type]}`);
                break;
        }
        for (const observer of this.observerQueue) {
            observer.handleSignalingClientEvent(event);
        }
    }
    setUpEventListeners() {
        this.webSocket.addEventListener('open', () => {
            this.activatePageUnloadHandler();
            this.wasOpened = true;
            this.sendEvent(new SignalingClientEvent_1.default(this, SignalingClientEventType_1.default.WebSocketOpen, null));
        });
        this.webSocket.addEventListener('message', (event) => {
            this.sendEvent(new SignalingClientEvent_1.default(this, SignalingClientEventType_1.default.WebSocketMessage, null));
            this.receiveMessage(this.stripFrameTypeRTC(new Uint8Array(event.data)));
        });
        this.webSocket.addEventListener('close', (event) => {
            this.deactivatePageUnloadHandler();
            this.resetConnection();
            this.sendEvent(new SignalingClientEvent_1.default(this, SignalingClientEventType_1.default.WebSocketClosed, null, event.code, event.reason));
            this.serviceConnectionRequestQueue();
        });
        this.webSocket.addEventListener('error', () => {
            if (this.isClosing && !this.wasOpened) {
                this.logger.info('ignoring error closing signaling while connecting');
                return;
            }
            if (this.wasOpened) {
                this.logger.error('received error while connected');
                this.sendEvent(new SignalingClientEvent_1.default(this, SignalingClientEventType_1.default.WebSocketError, null));
            }
            else {
                this.logger.error('failed to connect');
                this.sendEvent(new SignalingClientEvent_1.default(this, SignalingClientEventType_1.default.WebSocketFailed, null));
            }
        });
    }
    activatePageUnloadHandler() {
        this.unloadHandler = () => {
            this.leave();
        };
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const GlobalAny = global;
        GlobalAny['window'] &&
            GlobalAny['window']['addEventListener'] &&
            window.addEventListener('unload', this.unloadHandler);
    }
    deactivatePageUnloadHandler() {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const GlobalAny = global;
        GlobalAny['window'] &&
            GlobalAny['window']['addEventListener'] &&
            window.removeEventListener('unload', this.unloadHandler);
        this.unloadHandler = null;
    }
    generateNewAudioSessionId() {
        const num = new Uint32Array(1);
        const randomNum = window.crypto.getRandomValues(num);
        return randomNum[0];
    }
}
exports.default = DefaultSignalingClient;
DefaultSignalingClient.FRAME_TYPE_RTC = 0x5;
//# sourceMappingURL=DefaultSignalingClient.js.map