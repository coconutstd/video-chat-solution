import GetUserMediaError from './GetUserMediaError';
export default class OverconstrainedError extends GetUserMediaError {
    constraint?: string;
    constructor(cause?: Error, constraint?: string);
}
