import BackoffPolicy from '../backoff/Backoff';
import ReconnectController from './ReconnectController';
export default class DefaultReconnectController implements ReconnectController {
    private reconnectTimeoutMs;
    private backoffPolicy;
    private shouldReconnect;
    private onlyRestartPeerConnection;
    private firstConnectionAttempted;
    private firstConnectionAttemptTimestampMs;
    private lastActiveTimestampMs;
    private _isFirstConnection;
    private backoffTimer;
    private backoffCancel;
    constructor(reconnectTimeoutMs: number, backoffPolicy: BackoffPolicy);
    private timeSpentReconnectingMs;
    private hasPastReconnectDeadline;
    reset(): void;
    startedConnectionAttempt(isFirstConnection: boolean): void;
    hasStartedConnectionAttempt(): boolean;
    isFirstConnection(): boolean;
    disableReconnect(): void;
    enableRestartPeerConnection(): void;
    cancel(): void;
    retryWithBackoff(retryFunc: () => void, cancelFunc: () => void): boolean;
    shouldOnlyRestartPeerConnection(): boolean;
    clone(): DefaultReconnectController;
    setLastActiveTimestampMs(timestampMs: number): void;
}
