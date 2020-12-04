/**
 * [[RemovableObserver]] provides a callback for any cleanup logic.
 */
export default interface RemovableObserver {
    /**
     * Executes any cleanup logic.
     */
    removeObserver(): void;
}
