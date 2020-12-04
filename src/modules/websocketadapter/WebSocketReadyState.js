"use strict";
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebSocketReadyState = void 0;
var WebSocketReadyState;
(function (WebSocketReadyState) {
    WebSocketReadyState[WebSocketReadyState["None"] = 0] = "None";
    WebSocketReadyState[WebSocketReadyState["Connecting"] = 1] = "Connecting";
    WebSocketReadyState[WebSocketReadyState["Open"] = 2] = "Open";
    WebSocketReadyState[WebSocketReadyState["Closing"] = 3] = "Closing";
    WebSocketReadyState[WebSocketReadyState["Closed"] = 4] = "Closed";
})(WebSocketReadyState = exports.WebSocketReadyState || (exports.WebSocketReadyState = {}));
exports.default = WebSocketReadyState;
//# sourceMappingURL=WebSocketReadyState.js.map