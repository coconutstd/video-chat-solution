import Task from './Task';
export default class NoOpTask implements Task {
    cancel(): void;
    name(): string;
    run(): Promise<void>;
    setParent(_parentTask: Task): void;
}
