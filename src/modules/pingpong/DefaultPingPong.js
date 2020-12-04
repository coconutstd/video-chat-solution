"use strict";
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
const Maybe_1 = require("../maybe/Maybe");
const AsyncScheduler_1 = require("../scheduler/AsyncScheduler");
const IntervalScheduler_1 = require("../scheduler/IntervalScheduler");
const SignalingClientEventType_1 = require("../signalingclient/SignalingClientEventType");
const SignalingProtocol_js_1 = require("../signalingprotocol/SignalingProtocol.js");
/**
 * [[DefaultPingPong]] implements the PingPong and SignalingClientObserver interface.
 */
class DefaultPingPong {
    constructor(signalingClient, intervalMs, logger) {
        this.signalingClient = signalingClient;
        this.intervalMs = intervalMs;
        this.logger = logger;
        this.observerQueue = new Set();
        this.consecutivePongsUnaccountedFor = 0;
        this.intervalScheduler = new IntervalScheduler_1.default(this.intervalMs);
        this.pingId = 0;
    }
    addObserver(observer) {
        this.logger.info('adding a ping-pong observer');
        this.observerQueue.add(observer);
    }
    removeObserver(observer) {
        this.logger.info('removing a ping-pong observer');
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
        this.stop();
        this.signalingClient.registerObserver(this);
        if (this.signalingClient.ready()) {
            this.startPingInterval();
        }
    }
    stop() {
        this.stopPingInterval();
        this.signalingClient.removeObserver(this);
    }
    startPingInterval() {
        this.intervalScheduler.start(() => {
            this.ping();
        });
        this.ping();
    }
    stopPingInterval() {
        this.intervalScheduler.stop();
        this.pingId = 0;
        this.consecutivePongsUnaccountedFor = 0;
    }
    ping() {
        if (this.consecutivePongsUnaccountedFor > 0) {
            this.logger.warn(`missed pong ${this.consecutivePongsUnaccountedFor} time(s)`);
            this.forEachObserver((observer) => {
                Maybe_1.default.of(observer.didMissPongs).map(f => f.bind(observer)(this.consecutivePongsUnaccountedFor));
            });
        }
        this.consecutivePongsUnaccountedFor += 1;
        this.pingId = (this.pingId + 1) & 0xffffffff;
        const ping = SignalingProtocol_js_1.SdkPingPongFrame.create();
        ping.pingId = this.pingId;
        ping.type = SignalingProtocol_js_1.SdkPingPongType.PING;
        this.pingTimestampLocalMs = this.signalingClient.pingPong(ping);
        this.logger.debug(() => {
            return `sent ping ${this.pingId}`;
        });
    }
    pong(pingId) {
        const pong = SignalingProtocol_js_1.SdkPingPongFrame.create();
        pong.pingId = pingId;
        pong.type = SignalingProtocol_js_1.SdkPingPongType.PONG;
        this.signalingClient.pingPong(pong);
    }
    handleSignalingClientEvent(event) {
        switch (event.type) {
            case SignalingClientEventType_1.default.WebSocketOpen:
                this.startPingInterval();
                break;
            case SignalingClientEventType_1.default.WebSocketFailed:
            case SignalingClientEventType_1.default.WebSocketError:
                this.logger.warn(`stopped pinging (${SignalingClientEventType_1.default[event.type]})`);
                this.stopPingInterval();
                break;
            case SignalingClientEventType_1.default.WebSocketClosing:
            case SignalingClientEventType_1.default.WebSocketClosed:
                this.logger.info(`stopped pinging (${SignalingClientEventType_1.default[event.type]})`);
                this.stopPingInterval();
                break;
            case SignalingClientEventType_1.default.ReceivedSignalFrame:
                if (event.message.type !== SignalingProtocol_js_1.SdkSignalFrame.Type.PING_PONG) {
                    break;
                }
                if (event.message.pingPong.type === SignalingProtocol_js_1.SdkPingPongType.PONG) {
                    const pingId = event.message.pingPong.pingId;
                    if (pingId !== this.pingId) {
                        this.logger.warn(`unexpected ping id ${pingId} (expected ${this.pingId})`);
                        break;
                    }
                    this.consecutivePongsUnaccountedFor = 0;
                    let pongTimestampRemoteMs;
                    if (typeof event.message.timestampMs === 'number') {
                        pongTimestampRemoteMs = event.message.timestampMs;
                    }
                    else {
                        break;
                    }
                    this.logger.debug(() => {
                        return `received pong ${pingId} with timestamp ${pongTimestampRemoteMs}`;
                    });
                    const pongTimestampLocalMs = event.timestampMs;
                    const pingPongLocalIntervalMs = pongTimestampLocalMs - this.pingTimestampLocalMs;
                    const estimatedPingTimestampRemoteMs = Math.round(pongTimestampRemoteMs - pingPongLocalIntervalMs / 2);
                    const estimatedClockSkewMs = this.pingTimestampLocalMs - estimatedPingTimestampRemoteMs;
                    this.logger.info(`local clock skew estimate=${estimatedClockSkewMs}ms from ping-pong time=${pingPongLocalIntervalMs}ms`);
                    this.forEachObserver((observer) => {
                        Maybe_1.default.of(observer.didReceivePong).map(f => f.bind(observer)(pingId, estimatedClockSkewMs, pingPongLocalIntervalMs));
                    });
                }
                else {
                    this.pong(event.message.pingPong.pingId);
                }
                break;
        }
    }
}
exports.default = DefaultPingPong;
//# sourceMappingURL=DefaultPingPong.js.map