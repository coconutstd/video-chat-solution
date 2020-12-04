import Logger from '../logger/Logger';
import SignalingClientObserver from '../signalingclientobserver/SignalingClientObserver';
import { SdkClientMetricFrame, SdkDataMessageFrame, SdkPingPongFrame } from '../signalingprotocol/SignalingProtocol.js';
import WebSocketAdapter from '../websocketadapter/WebSocketAdapter';
import SignalingClient from './SignalingClient';
import SignalingClientConnectionRequest from './SignalingClientConnectionRequest';
import SignalingClientJoin from './SignalingClientJoin';
import SignalingClientSubscribe from './SignalingClientSubscribe';
/**
 * [[DefaultSignalingClient]] implements the SignalingClient interface.
 */
export default class DefaultSignalingClient implements SignalingClient {
    private webSocket;
    private logger;
    private static FRAME_TYPE_RTC;
    private observerQueue;
    private wasOpened;
    private isClosing;
    private connectionRequestQueue;
    private unloadHandler;
    private audioSessionId;
    constructor(webSocket: WebSocketAdapter, logger: Logger);
    registerObserver(observer: SignalingClientObserver): void;
    removeObserver(observer: SignalingClientObserver): void;
    openConnection(request: SignalingClientConnectionRequest): void;
    pingPong(pingPongFrame: SdkPingPongFrame): number;
    join(settings: SignalingClientJoin): void;
    subscribe(settings: SignalingClientSubscribe): void;
    leave(): void;
    sendClientMetrics(clientMetricFrame: SdkClientMetricFrame): void;
    sendDataMessage(messageFrame: SdkDataMessageFrame): void;
    closeConnection(): void;
    ready(): boolean;
    mute(muted: boolean): void;
    pause(streamIds: number[]): void;
    resume(streamIds: number[]): void;
    private resetConnection;
    private sendMessage;
    private receiveMessage;
    private stripFrameTypeRTC;
    private prependWithFrameTypeRTC;
    private serviceConnectionRequestQueue;
    private sendEvent;
    private setUpEventListeners;
    private activatePageUnloadHandler;
    private deactivatePageUnloadHandler;
    private generateNewAudioSessionId;
}
