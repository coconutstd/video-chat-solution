"use strict";
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
exports.CheckAudioConnectivityFeedback = void 0;
var CheckAudioConnectivityFeedback;
(function (CheckAudioConnectivityFeedback) {
    CheckAudioConnectivityFeedback[CheckAudioConnectivityFeedback["Succeeded"] = 0] = "Succeeded";
    CheckAudioConnectivityFeedback[CheckAudioConnectivityFeedback["AudioInputRequestFailed"] = 1] = "AudioInputRequestFailed";
    CheckAudioConnectivityFeedback[CheckAudioConnectivityFeedback["AudioInputPermissionDenied"] = 2] = "AudioInputPermissionDenied";
    CheckAudioConnectivityFeedback[CheckAudioConnectivityFeedback["ConnectionFailed"] = 3] = "ConnectionFailed";
    CheckAudioConnectivityFeedback[CheckAudioConnectivityFeedback["AudioNotReceived"] = 4] = "AudioNotReceived";
})(CheckAudioConnectivityFeedback = exports.CheckAudioConnectivityFeedback || (exports.CheckAudioConnectivityFeedback = {}));
exports.default = CheckAudioConnectivityFeedback;
//# sourceMappingURL=CheckAudioConnectivityFeedback.js.map