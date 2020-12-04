import Logger from '../logger/Logger';
import WebSocketAdapter from './WebSocketAdapter';
import WebSocketReadyState from './WebSocketReadyState';
export default class DefaultWebSocketAdapter implements WebSocketAdapter {
    private logger;
    private connection;
    constructor(logger: Logger);
    create(url: string, protocols: string[], isSignedUrl?: boolean): void;
    send(message: Uint8Array | string): boolean;
    close(code?: number, reason?: string): void;
    destroy(): void;
    addEventListener(handler: string, eventListener: EventListener): void;
    readyState(): WebSocketReadyState;
}
