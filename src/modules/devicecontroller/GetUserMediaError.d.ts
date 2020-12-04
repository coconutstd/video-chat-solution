export default class GetUserMediaError extends Error {
    cause?: Error;
    constructor(cause?: Error, message?: string);
}
