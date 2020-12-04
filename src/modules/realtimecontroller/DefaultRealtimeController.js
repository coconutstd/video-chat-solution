"use strict";
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
const RealtimeState_1 = require("./RealtimeState");
const RealtimeVolumeIndicator_1 = require("./RealtimeVolumeIndicator");
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
class DefaultRealtimeController {
    constructor() {
        this.state = new RealtimeState_1.default();
    }
    realtimeSetLocalAttendeeId(attendeeId, externalUserId) {
        this.state.localAttendeeId = attendeeId;
        this.state.localExternalUserId = externalUserId;
    }
    realtimeSetAttendeeIdPresence(attendeeId, present, externalUserId, dropped, posInFrame) {
        try {
            if (present) {
                this.state.attendeeIdToExternalUserId[attendeeId] = externalUserId;
            }
            for (const fn of this.state.attendeeIdChangesCallbacks) {
                fn(attendeeId, present, externalUserId, dropped, posInFrame);
            }
        }
        catch (e) {
            this.onError(e);
        }
    }
    realtimeSubscribeToAttendeeIdPresence(callback) {
        try {
            this.state.attendeeIdChangesCallbacks.push(callback);
        }
        catch (e) {
            this.onError(e);
        }
    }
    realtimeUnsubscribeToAttendeeIdPresence(callback) {
        try {
            const index = this.state.attendeeIdChangesCallbacks.indexOf(callback);
            if (index !== -1) {
                this.state.attendeeIdChangesCallbacks.splice(index, 1);
            }
        }
        catch (e) {
            this.onError(e);
        }
    }
    // Audio Input
    realtimeSetLocalAudioInput(audioInput) {
        try {
            if (this.state.audioInput === audioInput) {
                return;
            }
            this.setAudioInputEnabled(false);
            this.state.audioInput = audioInput;
            this.setAudioInputEnabled(!this.state.muted);
        }
        catch (e) {
            this.onError(e);
        }
    }
    // Muting
    realtimeSetCanUnmuteLocalAudio(canUnmute) {
        try {
            if (this.state.canUnmute === canUnmute) {
                return;
            }
            this.state.canUnmute = canUnmute;
            for (const fn of this.state.setCanUnmuteLocalAudioCallbacks) {
                fn(canUnmute);
            }
        }
        catch (e) {
            this.onError(e);
        }
    }
    realtimeSubscribeToSetCanUnmuteLocalAudio(callback) {
        try {
            this.state.setCanUnmuteLocalAudioCallbacks.push(callback);
        }
        catch (e) {
            this.onError(e);
        }
    }
    realtimeUnsubscribeToSetCanUnmuteLocalAudio(callback) {
        try {
            const index = this.state.setCanUnmuteLocalAudioCallbacks.indexOf(callback);
            if (index !== -1) {
                this.state.setCanUnmuteLocalAudioCallbacks.splice(index, 1);
            }
        }
        catch (e) {
            this.onError(e);
        }
    }
    realtimeCanUnmuteLocalAudio() {
        return this.state.canUnmute;
    }
    realtimeMuteLocalAudio() {
        if (this.state.muted) {
            return;
        }
        try {
            this.setAudioInputEnabled(false);
            this.state.muted = true;
            this.realtimeUpdateVolumeIndicator(this.state.localAttendeeId, null, null, null, this.state.localExternalUserId);
            for (const fn of this.state.muteAndUnmuteLocalAudioCallbacks) {
                fn(true);
            }
        }
        catch (e) {
            this.onError(e);
        }
    }
    realtimeUnmuteLocalAudio() {
        if (!this.state.muted) {
            return true;
        }
        if (!this.state.canUnmute) {
            return false;
        }
        try {
            this.setAudioInputEnabled(true);
            this.state.muted = false;
            this.realtimeUpdateVolumeIndicator(this.state.localAttendeeId, null, null, null, this.state.localExternalUserId);
            for (const fn of this.state.muteAndUnmuteLocalAudioCallbacks) {
                fn(false);
            }
            return true;
        }
        catch (e) {
            this.onError(e);
            return false;
        }
    }
    realtimeSubscribeToMuteAndUnmuteLocalAudio(callback) {
        try {
            this.state.muteAndUnmuteLocalAudioCallbacks.push(callback);
        }
        catch (e) {
            this.onError(e);
        }
    }
    realtimeUnsubscribeToMuteAndUnmuteLocalAudio(callback) {
        try {
            const index = this.state.muteAndUnmuteLocalAudioCallbacks.indexOf(callback);
            if (index !== -1) {
                this.state.muteAndUnmuteLocalAudioCallbacks.splice(index, 1);
            }
        }
        catch (e) {
            this.onError(e);
        }
    }
    realtimeIsLocalAudioMuted() {
        return this.state.muted;
    }
    // Volume Indicators
    realtimeSubscribeToVolumeIndicator(attendeeId, callback) {
        try {
            if (!this.state.volumeIndicatorCallbacks.hasOwnProperty(attendeeId)) {
                this.state.volumeIndicatorCallbacks[attendeeId] = [];
            }
            this.state.volumeIndicatorCallbacks[attendeeId].push(callback);
            this.sendVolumeIndicatorChange(attendeeId, true, true, true, this.state.attendeeIdToExternalUserId[attendeeId]);
        }
        catch (e) {
            this.onError(e);
        }
    }
    realtimeUnsubscribeFromVolumeIndicator(attendeeId) {
        try {
            delete this.state.volumeIndicatorCallbacks[attendeeId];
        }
        catch (e) {
            this.onError(e);
        }
    }
    realtimeUpdateVolumeIndicator(attendeeId, volume, muted, signalStrength, externalUserId) {
        try {
            muted = this.applyLocalMuteOverride(attendeeId, muted);
            const state = this.getVolumeIndicatorState(attendeeId);
            let volumeUpdated = false;
            let mutedUpdated = false;
            let signalStrengthUpdated = false;
            if (muted !== null) {
                if (state.muted !== muted) {
                    state.muted = muted;
                    mutedUpdated = true;
                    if (state.muted && state.volume !== 0.0) {
                        state.volume = 0.0;
                        volumeUpdated = true;
                    }
                }
            }
            if (!state.muted && volume !== null) {
                if (state.volume !== volume) {
                    state.volume = volume;
                    volumeUpdated = true;
                }
                if (state.muted === null) {
                    state.muted = false;
                    mutedUpdated = true;
                }
            }
            if (signalStrength !== null) {
                if (state.signalStrength !== signalStrength) {
                    state.signalStrength = signalStrength;
                    signalStrengthUpdated = true;
                }
            }
            this.sendVolumeIndicatorChange(attendeeId, volumeUpdated, mutedUpdated, signalStrengthUpdated, externalUserId);
        }
        catch (e) {
            this.onError(e);
        }
    }
    realtimeSubscribeToLocalSignalStrengthChange(callback) {
        try {
            this.state.localSignalStrengthChangeCallbacks.push(callback);
            if (this.state.localAttendeeId === null) {
                return;
            }
            this.sendLocalSignalStrengthChange(this.state.localAttendeeId, true);
        }
        catch (e) {
            this.onError(e);
        }
    }
    realtimeUnsubscribeToLocalSignalStrengthChange(callback) {
        try {
            const index = this.state.localSignalStrengthChangeCallbacks.indexOf(callback);
            if (index !== -1) {
                this.state.localSignalStrengthChangeCallbacks.splice(index, 1);
            }
        }
        catch (e) {
            this.onError(e);
        }
    }
    realtimeSubscribeToSendDataMessage(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    callback) {
        try {
            this.state.sendDataMessageCallbacks.push(callback);
        }
        catch (e) {
            this.onError(e);
        }
    }
    realtimeUnsubscribeFromSendDataMessage(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    callback) {
        try {
            const index = this.state.sendDataMessageCallbacks.indexOf(callback);
            if (index !== -1) {
                this.state.sendDataMessageCallbacks.splice(index, 1);
            }
        }
        catch (e) {
            this.onError(e);
        }
    }
    realtimeSendDataMessage(topic, data, // eslint-disable-line @typescript-eslint/no-explicit-any
    lifetimeMs) {
        try {
            for (const fn of this.state.sendDataMessageCallbacks) {
                fn(topic, data, lifetimeMs);
            }
        }
        catch (e) {
            this.onError(e);
        }
    }
    realtimeSubscribeToReceiveDataMessage(topic, callback) {
        try {
            if (this.state.receiveDataMessageCallbacks.has(topic)) {
                this.state.receiveDataMessageCallbacks.get(topic).push(callback);
            }
            else {
                this.state.receiveDataMessageCallbacks.set(topic, [callback]);
            }
        }
        catch (e) {
            this.onError(e);
        }
    }
    realtimeUnsubscribeFromReceiveDataMessage(topic) {
        try {
            this.state.receiveDataMessageCallbacks.delete(topic);
        }
        catch (e) {
            this.onError(e);
        }
    }
    realtimeReceiveDataMessage(dataMessage) {
        try {
            if (this.state.receiveDataMessageCallbacks.has(dataMessage.topic)) {
                for (const fn of this.state.receiveDataMessageCallbacks.get(dataMessage.topic)) {
                    fn(dataMessage);
                }
            }
        }
        catch (e) {
            this.onError(e);
        }
    }
    // Error Handling
    realtimeSubscribeToFatalError(callback) {
        try {
            this.state.fatalErrorCallbacks.push(callback);
        }
        catch (e) {
            this.onError(e);
        }
    }
    realtimeUnsubscribeToFatalError(callback) {
        try {
            const index = this.state.fatalErrorCallbacks.indexOf(callback);
            if (index !== -1) {
                this.state.fatalErrorCallbacks.splice(index, 1);
            }
        }
        catch (e) {
            this.onError(e);
        }
    }
    // Internals
    setAudioInputEnabled(enabled) {
        if (!this.state.audioInput) {
            return;
        }
        for (const track of this.state.audioInput.getTracks()) {
            if (track.enabled === enabled) {
                continue;
            }
            track.enabled = enabled;
        }
    }
    applyLocalMuteOverride(attendeeIdRemote, mutedRemote) {
        const attendeeIdLocal = this.state.localAttendeeId;
        const mutedLocal = this.state.muted;
        if (attendeeIdRemote !== attendeeIdLocal) {
            return mutedRemote;
        }
        if (this.state.audioInput === null) {
            return mutedRemote;
        }
        return mutedLocal;
    }
    sendVolumeIndicatorChange(attendeeId, volumeUpdated, mutedUpdated, signalStrengthUpdated, externalUserId) {
        this.sendLocalSignalStrengthChange(attendeeId, signalStrengthUpdated);
        if (!this.state.volumeIndicatorCallbacks.hasOwnProperty(attendeeId)) {
            return;
        }
        const state = this.getVolumeIndicatorState(attendeeId);
        const updateState = new RealtimeVolumeIndicator_1.default();
        if (volumeUpdated) {
            updateState.volume = state.volume;
        }
        if (mutedUpdated) {
            updateState.muted = state.muted;
        }
        if (signalStrengthUpdated) {
            updateState.signalStrength = state.signalStrength;
        }
        if (this.stateIsEmpty(updateState)) {
            return;
        }
        for (const fn of this.state.volumeIndicatorCallbacks[attendeeId]) {
            fn(attendeeId, updateState.volume, updateState.muted, updateState.signalStrength, externalUserId);
        }
    }
    sendLocalSignalStrengthChange(attendeeId, signalStrengthUpdated) {
        if (!signalStrengthUpdated) {
            return;
        }
        if (attendeeId !== this.state.localAttendeeId) {
            return;
        }
        const state = this.getVolumeIndicatorState(attendeeId);
        const signalStrength = state.signalStrength;
        if (signalStrength === null) {
            return;
        }
        for (const fn of this.state.localSignalStrengthChangeCallbacks) {
            fn(signalStrength);
        }
    }
    getVolumeIndicatorState(id) {
        if (!this.state.volumeIndicatorState.hasOwnProperty(id)) {
            this.state.volumeIndicatorState[id] = new RealtimeVolumeIndicator_1.default();
        }
        return this.state.volumeIndicatorState[id];
    }
    stateIsEmpty(state) {
        return state.volume === null && state.muted === null && state.signalStrength === null;
    }
    onError(error) {
        try {
            // 1) try the fatal error callbacks so that the issue is reported in
            //    logs and to give the handler a chance to clean up and reset.
            for (const callback of this.state.fatalErrorCallbacks) {
                callback(error);
            }
        }
        catch (eventError) {
            try {
                // 2) if the error event fails, fall back to console.error so that
                //    it at least prints out to the console before moving on.
                console.error(error);
                console.error(eventError);
            }
            catch (consoleError) {
                // 3) if all else fails, swallow the error and give up to guarantee
                //    that the API call returns cleanly.
            }
        }
    }
}
exports.default = DefaultRealtimeController;
//# sourceMappingURL=DefaultRealtimeController.js.map