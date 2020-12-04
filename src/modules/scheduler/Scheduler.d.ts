/**
 * [[Scheduler]] calls a callback on the schedule determined by the implementation.
 */
export default interface Scheduler {
    /**
     * Schedules the callback according to the implementation.
     */
    start(callback: () => void): void;
    /**
     * Unschedules the callback and prevents it from being called anymore.
     */
    stop(): void;
}
