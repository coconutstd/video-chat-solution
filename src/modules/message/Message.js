"use strict";
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
class Message {
    constructor(type, // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
    headers, payload) {
        this.type = type;
        this.headers = headers;
        this.payload = payload;
    }
}
exports.default = Message;
//# sourceMappingURL=Message.js.map