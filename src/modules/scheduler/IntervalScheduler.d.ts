import Scheduler from './Scheduler';
/**
 * [[IntervalScheduler]] calls the callback every intervalMs milliseconds.
 */
export default class IntervalScheduler implements Scheduler {
    private intervalMs;
    timer: any;
    constructor(intervalMs: number);
    start(callback: () => void): void;
    stop(): void;
}
