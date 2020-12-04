"use strict";
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionStateControllerTransitionResult = void 0;
/**
 * Indicates the result of an attempted state transition.
 */
var SessionStateControllerTransitionResult;
(function (SessionStateControllerTransitionResult) {
    /**
     * The transition was successful.
     */
    SessionStateControllerTransitionResult[SessionStateControllerTransitionResult["Transitioned"] = 0] = "Transitioned";
    /**
     * No transition is available from the current state using that action.
     */
    SessionStateControllerTransitionResult[SessionStateControllerTransitionResult["NoTransitionAvailable"] = 1] = "NoTransitionAvailable";
    /**
     * The transition will be tried on the next state.
     */
    SessionStateControllerTransitionResult[SessionStateControllerTransitionResult["DeferredTransition"] = 2] = "DeferredTransition";
    /**
     * An unexpected error occurred while transitioning to the next state.
     */
    SessionStateControllerTransitionResult[SessionStateControllerTransitionResult["TransitionFailed"] = 3] = "TransitionFailed";
})(SessionStateControllerTransitionResult = exports.SessionStateControllerTransitionResult || (exports.SessionStateControllerTransitionResult = {}));
exports.default = SessionStateControllerTransitionResult;
//# sourceMappingURL=SessionStateControllerTransitionResult.js.map