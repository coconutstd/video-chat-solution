/**
 * [[ConnectionMonitor]] updates health data based on incoming metrics.
 */
export default interface ConnectionMonitor {
    /**
     * Starts the ConnectionMonitor.
     */
    start(): void;
    /**
     * Stops the ConnectionMonitor.
     */
    stop(): void;
}
