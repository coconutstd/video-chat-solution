import DataMessage from '../datamessage/DataMessage';
import RealtimeAttendeePositionInFrame from './RealtimeAttendeePositionInFrame';
import RealtimeController from './RealtimeController';
/**
 * [[DefaultRealtimeController]] is written to adhere to the following tenets to
 * make privacy and performance bugs significantly less likely.
 *
 * 1. Any call to the object is guaranteed to succeed from the caller's
 *    perspective to the maximum extent that this can be ensured. However, all
 *    failures of the object are reported as fatal errors. For example, if local
 *    mute fails, then that is a privacy issue and we must tear down the
 *    connection and try starting over.
 *
 * 2. State is owned by the object and is considered authoritative at all times.
 *    For example, if [[realtimeIsLocalAudioMuted]] is true then the user *is*
 *    muted.
 *
 * 3. Callbacks are fired synchronously and do their work synchronously. Any
 *    unnecessary asynchronous implementation only invites latency and
 *    increases the surface error for potential errors.
 *
 * 4. Mutation only occurs when state changes. All state-changing functions are
 *    idempotent.
 *
 * 5. Every conditional branch gets its own if statement and test coverage is
 *    100% for this object.
 *
 * 6. Function parameters and returns use primitives only (no classes or enums).
 *    This minimizes the number of dependencies that consumers have to take on
 *    and allows the object to be more easily wrapped. Values are normalized
 *    where possible.
 *
 * 7. The object takes no other non-realtime dependencies.
 *
 * 8. Interface functions begin with `realtime` to make boundaries between the
 *    RealtimeController interface and the UI or business logic explicit and
 *    auditable.
 *
 * 9. Local state overrides remote state but not vice-versa. For example, if
 *    locally muted with an active audio input and a remote state indicates the
 *    same user is unmuted because the muted state has not yet propagated, then
 *    the volume indicator update for the user would show the remote mute state
 *    as muted. However, if locally muted without an active audio input and a
 *    remote state indicates the user is unmuted (since they are dialed in), the
 *    remote state persists but does not override the local state so
 *    [[realtimeIsLocalAudioMuted]] still returns true.
 */
export default class DefaultRealtimeController implements RealtimeController {
    private readonly state;
    realtimeSetLocalAttendeeId(attendeeId: string, externalUserId: string): void;
    realtimeSetAttendeeIdPresence(attendeeId: string, present: boolean, externalUserId: string | null, dropped: boolean | null, posInFrame: RealtimeAttendeePositionInFrame | null): void;
    realtimeSubscribeToAttendeeIdPresence(callback: (attendeeId: string, present: boolean, externalUserId?: string, dropped?: boolean, posInFrame?: RealtimeAttendeePositionInFrame | null) => void): void;
    realtimeUnsubscribeToAttendeeIdPresence(callback: (attendeeId: string, present: boolean, externalUserId?: string, dropped?: boolean, posInFrame?: RealtimeAttendeePositionInFrame | null) => void): void;
    realtimeSetLocalAudioInput(audioInput: MediaStream | null): void;
    realtimeSetCanUnmuteLocalAudio(canUnmute: boolean): void;
    realtimeSubscribeToSetCanUnmuteLocalAudio(callback: (canUnmute: boolean) => void): void;
    realtimeUnsubscribeToSetCanUnmuteLocalAudio(callback: (canUnmute: boolean) => void): void;
    realtimeCanUnmuteLocalAudio(): boolean;
    realtimeMuteLocalAudio(): void;
    realtimeUnmuteLocalAudio(): boolean;
    realtimeSubscribeToMuteAndUnmuteLocalAudio(callback: (muted: boolean) => void): void;
    realtimeUnsubscribeToMuteAndUnmuteLocalAudio(callback: (muted: boolean) => void): void;
    realtimeIsLocalAudioMuted(): boolean;
    realtimeSubscribeToVolumeIndicator(attendeeId: string, callback: (attendeeId: string, volume: number | null, muted: boolean | null, signalStrength: number | null, externalUserId?: string) => void): void;
    realtimeUnsubscribeFromVolumeIndicator(attendeeId: string): void;
    realtimeUpdateVolumeIndicator(attendeeId: string, volume: number | null, muted: boolean | null, signalStrength: number | null, externalUserId: string | null): void;
    realtimeSubscribeToLocalSignalStrengthChange(callback: (signalStrength: number) => void): void;
    realtimeUnsubscribeToLocalSignalStrengthChange(callback: (signalStrength: number) => void): void;
    realtimeSubscribeToSendDataMessage(callback: (topic: string, data: Uint8Array | string | any, lifetimeMs?: number) => void): void;
    realtimeUnsubscribeFromSendDataMessage(callback: (topic: string, data: Uint8Array | string | any, lifetimeMs?: number) => void): void;
    realtimeSendDataMessage(topic: string, data: Uint8Array | string | any, // eslint-disable-line @typescript-eslint/no-explicit-any
    lifetimeMs?: number): void;
    realtimeSubscribeToReceiveDataMessage(topic: string, callback: (dataMessage: DataMessage) => void): void;
    realtimeUnsubscribeFromReceiveDataMessage(topic: string): void;
    realtimeReceiveDataMessage(dataMessage: DataMessage): void;
    realtimeSubscribeToFatalError(callback: (error: Error) => void): void;
    realtimeUnsubscribeToFatalError(callback: (error: Error) => void): void;
    private setAudioInputEnabled;
    private applyLocalMuteOverride;
    private sendVolumeIndicatorChange;
    private sendLocalSignalStrengthChange;
    private getVolumeIndicatorState;
    private stateIsEmpty;
    private onError;
}
