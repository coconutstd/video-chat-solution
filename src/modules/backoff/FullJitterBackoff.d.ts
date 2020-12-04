import Backoff from './Backoff';
/**
 * Implements the [Full Jitter algorithm](
 * https://aws.amazon.com/blogs/architecture/exponential-backoff-and-jitter/)
 * and also allows for specifying a fixed wait added to the full jitter backoff
 * (which can be zero).
 */
export default class FullJitterBackoff implements Backoff {
    private fixedWaitMs;
    private shortBackoffMs;
    private longBackoffMs;
    private currentRetry;
    constructor(fixedWaitMs: number, shortBackoffMs: number, longBackoffMs: number);
    reset(): void;
    nextBackoffAmountMs(): number;
}
