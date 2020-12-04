"use strict";
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
class GetUserMediaError extends Error {
    constructor(cause, message) {
        super(message || 'Error fetching device.');
        this.cause = cause;
    }
}
exports.default = GetUserMediaError;
//# sourceMappingURL=GetUserMediaError.js.map