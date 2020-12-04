import Logger from '../logger/Logger';
import BaseTask from './BaseTask';
import Task from './Task';
/**
 * [[TimeoutTask]] runs a subtask until it either succeeds or reaches a
 * timeout, at which point the subtask is canceled.
 */
export default class TimeoutTask extends BaseTask {
    private taskToRunBeforeTimeout;
    private timeoutMs;
    protected taskName: string;
    constructor(logger: Logger, taskToRunBeforeTimeout: Task, timeoutMs: number);
    cancel(): void;
    run(): Promise<void>;
}
