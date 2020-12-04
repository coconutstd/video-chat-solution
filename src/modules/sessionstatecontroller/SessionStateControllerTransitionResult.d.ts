/**
 * Indicates the result of an attempted state transition.
 */
export declare enum SessionStateControllerTransitionResult {
    /**
     * The transition was successful.
     */
    Transitioned = 0,
    /**
     * No transition is available from the current state using that action.
     */
    NoTransitionAvailable = 1,
    /**
     * The transition will be tried on the next state.
     */
    DeferredTransition = 2,
    /**
     * An unexpected error occurred while transitioning to the next state.
     */
    TransitionFailed = 3
}
export default SessionStateControllerTransitionResult;
