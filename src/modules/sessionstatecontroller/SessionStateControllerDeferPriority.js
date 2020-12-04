"use strict";
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionStateControllerDeferPriority = void 0;
/**
 * [[SessionStateControllerDeferPriority]] indicates the priority level of the action
 * being deferred. For example, stop is more important than update so if forced
 * to pick between the two stop should be chosen.
 */
var SessionStateControllerDeferPriority;
(function (SessionStateControllerDeferPriority) {
    SessionStateControllerDeferPriority[SessionStateControllerDeferPriority["DoNotDefer"] = 0] = "DoNotDefer";
    SessionStateControllerDeferPriority[SessionStateControllerDeferPriority["Low"] = 1] = "Low";
    SessionStateControllerDeferPriority[SessionStateControllerDeferPriority["Medium"] = 2] = "Medium";
    SessionStateControllerDeferPriority[SessionStateControllerDeferPriority["High"] = 3] = "High";
    SessionStateControllerDeferPriority[SessionStateControllerDeferPriority["VeryHigh"] = 4] = "VeryHigh";
})(SessionStateControllerDeferPriority = exports.SessionStateControllerDeferPriority || (exports.SessionStateControllerDeferPriority = {}));
exports.default = SessionStateControllerDeferPriority;
//# sourceMappingURL=SessionStateControllerDeferPriority.js.map