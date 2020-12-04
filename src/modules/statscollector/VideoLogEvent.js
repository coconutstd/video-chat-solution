"use strict";
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
exports.VideoLogEvent = void 0;
var VideoLogEvent;
(function (VideoLogEvent) {
    VideoLogEvent[VideoLogEvent["InputAttached"] = 0] = "InputAttached";
    VideoLogEvent[VideoLogEvent["SendingFailed"] = 1] = "SendingFailed";
    VideoLogEvent[VideoLogEvent["SendingSuccess"] = 2] = "SendingSuccess";
})(VideoLogEvent = exports.VideoLogEvent || (exports.VideoLogEvent = {}));
exports.default = VideoLogEvent;
//# sourceMappingURL=VideoLogEvent.js.map