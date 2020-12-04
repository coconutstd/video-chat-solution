/**
 * [[SessionStateControllerAction]] is a state-changing action to perform.
 */
export declare enum SessionStateControllerAction {
    Connect = 0,
    FinishConnecting = 1,
    Update = 2,
    FinishUpdating = 3,
    Reconnect = 4,
    Disconnect = 5,
    Fail = 6,
    FinishDisconnecting = 7
}
export default SessionStateControllerAction;
