import Logger from '../logger/Logger';
import BaseTask from './BaseTask';
import Task from './Task';
/**
 * [[SerialGroupTask]] runs a set of tasks in series. When canceled, it stops
 * any currently running task and runs no further tasks in the group.
 */
export default class SerialGroupTask extends BaseTask {
    protected taskName: string;
    private tasksToRunSerially;
    private currentTask;
    constructor(logger: Logger, taskName: string, tasksToRunSerially: Task[]);
    cancel(): void;
    run(): Promise<void>;
}
