import GetUserMediaError from './GetUserMediaError';
export default class PermissionDeniedError extends GetUserMediaError {
    constructor(cause?: Error, message?: string);
}
