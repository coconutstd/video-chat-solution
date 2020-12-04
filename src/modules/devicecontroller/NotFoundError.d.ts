import GetUserMediaError from './GetUserMediaError';
export default class NotFoundError extends GetUserMediaError {
    constructor(cause?: Error);
}
