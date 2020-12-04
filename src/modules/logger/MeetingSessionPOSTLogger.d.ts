import LogLevel from '../logger/LogLevel';
import MeetingSessionConfiguration from '../meetingsession/MeetingSessionConfiguration';
export default class MeetingSessionPOSTLogger {
    private name;
    private configuration;
    private batchSize;
    private intervalMs;
    private url;
    private level;
    private logCapture;
    private sequenceNumber;
    private lock;
    private intervalScheduler;
    constructor(name: string, configuration: MeetingSessionConfiguration, batchSize: number, intervalMs: number, url: string, level?: LogLevel);
    debug(debugFunction: () => string): void;
    info(msg: string): void;
    warn(msg: string): void;
    error(msg: string): void;
    setLogLevel(level: LogLevel): void;
    getLogLevel(): LogLevel;
    getLogCaptureSize(): number;
    startLogPublishScheduler(batchSize: number): void;
    stop(): void;
    private makeRequestBody;
    private log;
}
