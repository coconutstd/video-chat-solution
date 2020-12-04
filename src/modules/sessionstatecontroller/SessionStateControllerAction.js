"use strict";
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionStateControllerAction = void 0;
/**
 * [[SessionStateControllerAction]] is a state-changing action to perform.
 */
var SessionStateControllerAction;
(function (SessionStateControllerAction) {
    SessionStateControllerAction[SessionStateControllerAction["Connect"] = 0] = "Connect";
    SessionStateControllerAction[SessionStateControllerAction["FinishConnecting"] = 1] = "FinishConnecting";
    SessionStateControllerAction[SessionStateControllerAction["Update"] = 2] = "Update";
    SessionStateControllerAction[SessionStateControllerAction["FinishUpdating"] = 3] = "FinishUpdating";
    SessionStateControllerAction[SessionStateControllerAction["Reconnect"] = 4] = "Reconnect";
    SessionStateControllerAction[SessionStateControllerAction["Disconnect"] = 5] = "Disconnect";
    SessionStateControllerAction[SessionStateControllerAction["Fail"] = 6] = "Fail";
    SessionStateControllerAction[SessionStateControllerAction["FinishDisconnecting"] = 7] = "FinishDisconnecting";
})(SessionStateControllerAction = exports.SessionStateControllerAction || (exports.SessionStateControllerAction = {}));
exports.default = SessionStateControllerAction;
//# sourceMappingURL=SessionStateControllerAction.js.map