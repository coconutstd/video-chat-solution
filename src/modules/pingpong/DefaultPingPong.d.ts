import Logger from '../logger/Logger';
import PingPongObserver from '../pingpongobserver/PingPongObserver';
import IntervalScheduler from '../scheduler/IntervalScheduler';
import SignalingClient from '../signalingclient/SignalingClient';
import SignalingClientEvent from '../signalingclient/SignalingClientEvent';
import SignalingClientObserver from '../signalingclientobserver/SignalingClientObserver';
import PingPong from './PingPong';
/**
 * [[DefaultPingPong]] implements the PingPong and SignalingClientObserver interface.
 */
export default class DefaultPingPong implements SignalingClientObserver, PingPong {
    private signalingClient;
    private intervalMs;
    private logger;
    private observerQueue;
    intervalScheduler: IntervalScheduler;
    pingTimestampLocalMs: number;
    pingId: number;
    consecutivePongsUnaccountedFor: number;
    constructor(signalingClient: SignalingClient, intervalMs: number, logger: Logger);
    addObserver(observer: PingPongObserver): void;
    removeObserver(observer: PingPongObserver): void;
    forEachObserver(observerFunc: (observer: PingPongObserver) => void): void;
    start(): void;
    stop(): void;
    private startPingInterval;
    private stopPingInterval;
    private ping;
    private pong;
    handleSignalingClientEvent(event: SignalingClientEvent): void;
}
