"use strict";
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionStateControllerState = void 0;
/**
 * [[SessionStateControllerState]] reflects the current connection state of the session.
 */
var SessionStateControllerState;
(function (SessionStateControllerState) {
    SessionStateControllerState[SessionStateControllerState["NotConnected"] = 0] = "NotConnected";
    SessionStateControllerState[SessionStateControllerState["Connecting"] = 1] = "Connecting";
    SessionStateControllerState[SessionStateControllerState["Connected"] = 2] = "Connected";
    SessionStateControllerState[SessionStateControllerState["Updating"] = 3] = "Updating";
    SessionStateControllerState[SessionStateControllerState["Disconnecting"] = 4] = "Disconnecting";
})(SessionStateControllerState = exports.SessionStateControllerState || (exports.SessionStateControllerState = {}));
exports.default = SessionStateControllerState;
//# sourceMappingURL=SessionStateControllerState.js.map