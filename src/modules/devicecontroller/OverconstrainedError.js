"use strict";
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
const GetUserMediaError_1 = require("./GetUserMediaError");
class OverconstrainedError extends GetUserMediaError_1.default {
    constructor(cause, constraint) {
        super(cause);
        this.constraint = constraint;
    }
}
exports.default = OverconstrainedError;
//# sourceMappingURL=OverconstrainedError.js.map