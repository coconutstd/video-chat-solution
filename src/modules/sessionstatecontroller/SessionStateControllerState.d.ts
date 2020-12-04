/**
 * [[SessionStateControllerState]] reflects the current connection state of the session.
 */
export declare enum SessionStateControllerState {
    NotConnected = 0,
    Connecting = 1,
    Connected = 2,
    Updating = 3,
    Disconnecting = 4
}
export default SessionStateControllerState;
