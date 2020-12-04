import NoOpLogger from './NoOpLogger';
/**
 * [[NoOpDebugLogger]] does not log any message but does call
 * debug functions by default.
 */
export default class NoOpDebugLogger extends NoOpLogger {
    constructor();
}
