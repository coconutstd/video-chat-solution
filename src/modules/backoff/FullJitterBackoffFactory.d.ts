import Backoff from './Backoff';
import BackoffFactory from './BackoffFactory';
export default class FullJitterBackoffFactory implements BackoffFactory {
    private fixedWaitMs;
    private shortBackoffMs;
    private longBackoffMs;
    constructor(fixedWaitMs: number, shortBackoffMs: number, longBackoffMs: number);
    create(): Backoff;
    createWithLimit(limit: number): Backoff;
}
