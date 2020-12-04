import Scheduler from './Scheduler';
/**
 * [[TimeoutScheduler]] calls the callback once after timeoutMs milliseconds.
 */
export default class TimeoutScheduler implements Scheduler {
    private timeoutMs;
    private timer;
    constructor(timeoutMs: number);
    start(callback: () => void): void;
    stop(): void;
}
