"use strict";
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
const SessionStateControllerAction_1 = require("./SessionStateControllerAction");
const SessionStateControllerDeferPriority_1 = require("./SessionStateControllerDeferPriority");
const SessionStateControllerState_1 = require("./SessionStateControllerState");
const SessionStateControllerTransitionResult_1 = require("./SessionStateControllerTransitionResult");
class DefaultSessionStateController {
    constructor(logger) {
        this.logger = logger;
        this.currentState = SessionStateControllerState_1.SessionStateControllerState.NotConnected;
        this.deferredAction = null;
        this.deferredWork = null;
    }
    perform(action, work) {
        const state = this.currentState;
        if (state === SessionStateControllerState_1.SessionStateControllerState.NotConnected &&
            action === SessionStateControllerAction_1.SessionStateControllerAction.Connect) {
            this.transition(SessionStateControllerState_1.SessionStateControllerState.Connecting, action);
        }
        else if (state === SessionStateControllerState_1.SessionStateControllerState.Connecting &&
            action === SessionStateControllerAction_1.SessionStateControllerAction.Fail) {
            this.transition(SessionStateControllerState_1.SessionStateControllerState.Disconnecting, action);
        }
        else if (state === SessionStateControllerState_1.SessionStateControllerState.Connecting &&
            action === SessionStateControllerAction_1.SessionStateControllerAction.FinishConnecting) {
            this.transition(SessionStateControllerState_1.SessionStateControllerState.Connected, action);
        }
        else if (state === SessionStateControllerState_1.SessionStateControllerState.Connected &&
            action === SessionStateControllerAction_1.SessionStateControllerAction.Disconnect) {
            this.transition(SessionStateControllerState_1.SessionStateControllerState.Disconnecting, action);
        }
        else if (state === SessionStateControllerState_1.SessionStateControllerState.Connected &&
            action === SessionStateControllerAction_1.SessionStateControllerAction.Reconnect) {
            this.transition(SessionStateControllerState_1.SessionStateControllerState.Connecting, action);
        }
        else if (state === SessionStateControllerState_1.SessionStateControllerState.Connected &&
            action === SessionStateControllerAction_1.SessionStateControllerAction.Fail) {
            this.transition(SessionStateControllerState_1.SessionStateControllerState.Disconnecting, action);
        }
        else if (state === SessionStateControllerState_1.SessionStateControllerState.Connected &&
            action === SessionStateControllerAction_1.SessionStateControllerAction.Update) {
            this.transition(SessionStateControllerState_1.SessionStateControllerState.Updating, action);
        }
        else if (state === SessionStateControllerState_1.SessionStateControllerState.Updating &&
            action === SessionStateControllerAction_1.SessionStateControllerAction.Fail) {
            this.transition(SessionStateControllerState_1.SessionStateControllerState.Disconnecting, action);
        }
        else if (state === SessionStateControllerState_1.SessionStateControllerState.Updating &&
            action === SessionStateControllerAction_1.SessionStateControllerAction.FinishUpdating) {
            this.transition(SessionStateControllerState_1.SessionStateControllerState.Connected, action);
        }
        else if (state === SessionStateControllerState_1.SessionStateControllerState.Disconnecting &&
            action === SessionStateControllerAction_1.SessionStateControllerAction.FinishDisconnecting) {
            this.transition(SessionStateControllerState_1.SessionStateControllerState.NotConnected, action);
        }
        else if (this.canDefer(action)) {
            this.logger.info(`deferring transition from ${SessionStateControllerState_1.SessionStateControllerState[this.currentState]} with ${SessionStateControllerAction_1.SessionStateControllerAction[action]}`);
            this.deferAction(action, work);
            return SessionStateControllerTransitionResult_1.SessionStateControllerTransitionResult.DeferredTransition;
        }
        else {
            this.logger.warn(`no transition found from ${SessionStateControllerState_1.SessionStateControllerState[this.currentState]} with ${SessionStateControllerAction_1.SessionStateControllerAction[action]}`);
            return SessionStateControllerTransitionResult_1.SessionStateControllerTransitionResult.NoTransitionAvailable;
        }
        try {
            work();
        }
        catch (e) {
            this.logger.error(`error during state ${SessionStateControllerState_1.SessionStateControllerState[this.currentState]} with action ${SessionStateControllerAction_1.SessionStateControllerAction[action]}: ${e}`);
            this.logger.info(`rolling back transition to ${SessionStateControllerState_1.SessionStateControllerState[state]}`);
            this.currentState = state;
            return SessionStateControllerTransitionResult_1.SessionStateControllerTransitionResult.TransitionFailed;
        }
        this.performDeferredAction();
        return SessionStateControllerTransitionResult_1.SessionStateControllerTransitionResult.Transitioned;
    }
    state() {
        return this.currentState;
    }
    transition(newState, action) {
        this.logger.info(`transitioning from ${SessionStateControllerState_1.SessionStateControllerState[this.currentState]} to ${SessionStateControllerState_1.SessionStateControllerState[newState]} with ${SessionStateControllerAction_1.SessionStateControllerAction[action]}`);
        this.currentState = newState;
    }
    deferPriority(action) {
        switch (action) {
            case SessionStateControllerAction_1.SessionStateControllerAction.Disconnect:
                return SessionStateControllerDeferPriority_1.SessionStateControllerDeferPriority.VeryHigh;
            case SessionStateControllerAction_1.SessionStateControllerAction.Fail:
                return SessionStateControllerDeferPriority_1.SessionStateControllerDeferPriority.High;
            case SessionStateControllerAction_1.SessionStateControllerAction.Reconnect:
                return SessionStateControllerDeferPriority_1.SessionStateControllerDeferPriority.Medium;
            case SessionStateControllerAction_1.SessionStateControllerAction.Update:
                return SessionStateControllerDeferPriority_1.SessionStateControllerDeferPriority.Low;
            default:
                return SessionStateControllerDeferPriority_1.SessionStateControllerDeferPriority.DoNotDefer;
        }
    }
    deferAction(action, work) {
        if (this.deferredAction !== null &&
            this.deferPriority(this.deferredAction) > this.deferPriority(action)) {
            return;
        }
        this.deferredAction = action;
        this.deferredWork = work;
    }
    canDefer(action) {
        return (this.deferPriority(action) !== SessionStateControllerDeferPriority_1.SessionStateControllerDeferPriority.DoNotDefer &&
            (this.currentState === SessionStateControllerState_1.SessionStateControllerState.Connecting ||
                this.currentState === SessionStateControllerState_1.SessionStateControllerState.Updating));
    }
    performDeferredAction() {
        if (!this.deferredAction) {
            return;
        }
        const deferredAction = this.deferredAction;
        const deferredWork = this.deferredWork;
        this.deferredAction = null;
        this.deferredWork = null;
        this.logger.info(`performing deferred action ${SessionStateControllerAction_1.SessionStateControllerAction[deferredAction]}`);
        if (this.perform(deferredAction, deferredWork) !==
            SessionStateControllerTransitionResult_1.SessionStateControllerTransitionResult.Transitioned) {
            this.logger.info(`unable to perform deferred action ${SessionStateControllerAction_1.SessionStateControllerAction[deferredAction]} in state ${SessionStateControllerState_1.SessionStateControllerState[this.currentState]}`);
        }
    }
}
exports.default = DefaultSessionStateController;
//# sourceMappingURL=DefaultSessionStateController.js.map