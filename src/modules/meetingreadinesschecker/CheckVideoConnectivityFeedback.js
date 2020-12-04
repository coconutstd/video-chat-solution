"use strict";
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
exports.CheckVideoConnectivityFeedback = void 0;
var CheckVideoConnectivityFeedback;
(function (CheckVideoConnectivityFeedback) {
    CheckVideoConnectivityFeedback[CheckVideoConnectivityFeedback["Succeeded"] = 0] = "Succeeded";
    CheckVideoConnectivityFeedback[CheckVideoConnectivityFeedback["VideoInputRequestFailed"] = 1] = "VideoInputRequestFailed";
    CheckVideoConnectivityFeedback[CheckVideoConnectivityFeedback["VideoInputPermissionDenied"] = 2] = "VideoInputPermissionDenied";
    CheckVideoConnectivityFeedback[CheckVideoConnectivityFeedback["ConnectionFailed"] = 3] = "ConnectionFailed";
    CheckVideoConnectivityFeedback[CheckVideoConnectivityFeedback["VideoNotSent"] = 4] = "VideoNotSent";
})(CheckVideoConnectivityFeedback = exports.CheckVideoConnectivityFeedback || (exports.CheckVideoConnectivityFeedback = {}));
exports.default = CheckVideoConnectivityFeedback;
//# sourceMappingURL=CheckVideoConnectivityFeedback.js.map