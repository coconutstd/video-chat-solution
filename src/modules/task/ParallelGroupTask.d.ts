import Logger from '../logger/Logger';
import BaseTask from './BaseTask';
import Task from './Task';
/**
 * [[ParallelGroupTask]] runs a set of tasks in parallel. When canceled, it
 * stops any currently running tasks.
 */
export default class ParallelGroupTask extends BaseTask {
    protected taskName: string;
    private tasksToRunParallel;
    constructor(logger: Logger, taskName: string, tasksToRunParallel: Task[]);
    cancel(): void;
    run(): Promise<void>;
}
