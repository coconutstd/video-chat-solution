import GetUserMediaError from './GetUserMediaError';
export default class NotReadableError extends GetUserMediaError {
    constructor(cause?: Error);
}
