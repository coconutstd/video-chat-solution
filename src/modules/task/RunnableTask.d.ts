import Logger from '../logger/Logger';
import BaseTask from './BaseTask';
/**
 * [[RunnableTask]] Task wrapper for any Promised-operation
 */
export default class RunnableTask<T> extends BaseTask {
    private fn;
    constructor(logger: Logger, fn: () => Promise<T>, taskName?: string);
    run(): Promise<void>;
}
