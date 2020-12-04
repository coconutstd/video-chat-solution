/**
 * [[Backoff]] defines how long to wait before the next retry. Implementations
 * of [[Backoff]] provide custom algorithms for calculating the backoff amount.
 */
export default interface Backoff {
    reset(): void;
    nextBackoffAmountMs(): number;
}
