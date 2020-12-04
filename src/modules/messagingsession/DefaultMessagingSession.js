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
const FullJitterBackoff_1 = require("../backoff/FullJitterBackoff");
const Message_1 = require("../message/Message");
const DefaultReconnectController_1 = require("../reconnectcontroller/DefaultReconnectController");
const AsyncScheduler_1 = require("../scheduler/AsyncScheduler");
const DefaultSigV4_1 = require("../sigv4/DefaultSigV4");
const DefaultWebSocketAdapter_1 = require("../websocketadapter/DefaultWebSocketAdapter");
const WebSocketReadyState_1 = require("../websocketadapter/WebSocketReadyState");
class DefaultMessagingSession {
    constructor(configuration, logger, webSocket, reconnectController, sigV4) {
        this.configuration = configuration;
        this.logger = logger;
        this.webSocket = webSocket;
        this.reconnectController = reconnectController;
        this.sigV4 = sigV4;
        this.observerQueue = new Set();
        if (!this.webSocket) {
            this.webSocket = new DefaultWebSocketAdapter_1.default(this.logger);
        }
        if (!this.reconnectController) {
            this.reconnectController = new DefaultReconnectController_1.default(configuration.reconnectTimeoutMs, new FullJitterBackoff_1.default(configuration.reconnectFixedWaitMs, configuration.reconnectShortBackoffMs, configuration.reconnectLongBackoffMs));
        }
        if (!this.sigV4) {
            this.sigV4 = new DefaultSigV4_1.default(this.configuration.chimeClient, this.configuration.awsClient);
        }
    }
    addObserver(observer) {
        this.logger.info('adding messaging observer');
        this.observerQueue.add(observer);
    }
    removeObserver(observer) {
        this.logger.info('removing messaging observer');
        this.observerQueue.delete(observer);
    }
    start() {
        if (this.isClosed()) {
            this.startConnecting(false);
        }
        else {
            this.logger.info('messaging session already started');
        }
    }
    stop() {
        if (!this.isClosed()) {
            this.isClosing = true;
            this.webSocket.close();
        }
        else {
            this.logger.info('no existing connection needs closing');
        }
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
    setUpEventListeners() {
        this.webSocket.addEventListener('open', () => {
            this.openEventHandler();
        });
        this.webSocket.addEventListener('message', (event) => {
            this.receiveMessageHandler(event.data);
        });
        this.webSocket.addEventListener('close', (event) => {
            this.closeEventHandler(event);
        });
        this.webSocket.addEventListener('error', () => {
            this.logger.error(`WebSocket error`);
        });
    }
    startConnecting(reconnecting) {
        const signedUrl = this.prepareWebSocketUrl();
        this.logger.info(`opening connection to ${signedUrl}`);
        if (!reconnecting) {
            this.reconnectController.reset();
        }
        if (this.reconnectController.hasStartedConnectionAttempt()) {
            this.reconnectController.startedConnectionAttempt(false);
        }
        else {
            this.reconnectController.startedConnectionAttempt(true);
        }
        this.webSocket.create(signedUrl, [], true);
        this.forEachObserver(observer => {
            if (observer.messagingSessionDidStartConnecting) {
                observer.messagingSessionDidStartConnecting(reconnecting);
            }
        });
        this.setUpEventListeners();
    }
    prepareWebSocketUrl() {
        const queryParams = new Map();
        queryParams.set('userArn', [this.configuration.userArn]);
        queryParams.set('sessionId', [this.configuration.messagingSessionId]);
        return this.sigV4.signURL('GET', 'wss', 'chime', this.configuration.endpointUrl, '/connect', '', queryParams);
    }
    isClosed() {
        return (this.webSocket.readyState() === WebSocketReadyState_1.default.None ||
            this.webSocket.readyState() === WebSocketReadyState_1.default.Closed);
    }
    openEventHandler() {
        this.reconnectController.reset();
        this.isFirstMessageReceived = false;
    }
    receiveMessageHandler(data) {
        try {
            const jsonData = JSON.parse(data);
            const messageType = jsonData.Headers['x-amz-chime-event-type'];
            const message = new Message_1.default(messageType, jsonData.Headers, jsonData.Payload || null);
            if (!this.isFirstMessageReceived) {
                // Since backend does authorization after the websocket open we cannot rely on open event for didStart
                // as the socket will close if authorization fail after it open. So we trigger didStart on first message event
                // instead
                this.forEachObserver(observer => {
                    if (observer.messagingSessionDidStart) {
                        observer.messagingSessionDidStart();
                    }
                });
                this.isFirstMessageReceived = true;
            }
            this.forEachObserver(observer => {
                if (observer.messagingSessionDidReceiveMessage) {
                    observer.messagingSessionDidReceiveMessage(message);
                }
            });
        }
        catch (error) {
            this.logger.error(`Messaging parsing failed: ${error}`);
        }
    }
    closeEventHandler(event) {
        this.logger.info(`WebSocket close: ${event.code} ${event.reason}`);
        this.webSocket.destroy();
        if (!this.isClosing &&
            this.canReconnect(event.code) &&
            this.reconnectController.retryWithBackoff(() => __awaiter(this, void 0, void 0, function* () {
                this.startConnecting(true);
            }), null)) {
            return;
        }
        this.isClosing = false;
        if (this.isFirstMessageReceived) {
            this.forEachObserver(observer => {
                if (observer.messagingSessionDidStop) {
                    observer.messagingSessionDidStop(event);
                }
            });
        }
    }
    canReconnect(closeCode) {
        // 4003 is Kicked closing event from the back end
        return (closeCode === 1001 ||
            closeCode === 1006 ||
            (closeCode >= 1011 && closeCode <= 1014) ||
            (closeCode > 4000 && closeCode !== 4002 && closeCode !== 4003 && closeCode !== 4401));
    }
}
exports.default = DefaultMessagingSession;
//# sourceMappingURL=DefaultMessagingSession.js.map