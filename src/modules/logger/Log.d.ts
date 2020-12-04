export default class Log {
    sequenceNumber: number;
    message: string;
    timestampMs: number;
    logLevel: string;
    constructor(sequenceNumber: number, message: string, timestampMs: number, logLevel: string);
}
