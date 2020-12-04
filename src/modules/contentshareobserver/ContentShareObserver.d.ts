export default interface ContentShareObserver {
    /**
     * Called when a content share session is started.
     */
    contentShareDidStart?(): void;
    /**
     * Called when a content share session is stopped.
     */
    contentShareDidStop?(): void;
    /**
     * Called when a content share session is paused.
     */
    contentShareDidPause?(): void;
    /**
     * Called when a content share session is unpaused.
     */
    contentShareDidUnpause?(): void;
}
