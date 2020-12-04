"use strict";
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
exports.AudioLogEvent = void 0;
var AudioLogEvent;
(function (AudioLogEvent) {
    AudioLogEvent[AudioLogEvent["DeviceChanged"] = 0] = "DeviceChanged";
    AudioLogEvent[AudioLogEvent["MutedLocal"] = 1] = "MutedLocal";
    AudioLogEvent[AudioLogEvent["UnmutedLocal"] = 2] = "UnmutedLocal";
    AudioLogEvent[AudioLogEvent["Connected"] = 3] = "Connected";
    AudioLogEvent[AudioLogEvent["ConnectFailed"] = 4] = "ConnectFailed";
    AudioLogEvent[AudioLogEvent["RedmicStartLoss"] = 5] = "RedmicStartLoss";
    AudioLogEvent[AudioLogEvent["RedmicEndLoss"] = 6] = "RedmicEndLoss";
})(AudioLogEvent = exports.AudioLogEvent || (exports.AudioLogEvent = {}));
exports.default = AudioLogEvent;
//# sourceMappingURL=AudioLogEvent.js.map