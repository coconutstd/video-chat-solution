"use strict";
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
const None_1 = require("./None");
const Some_1 = require("./Some");
class Maybe {
    static of(value) {
        return value === undefined || value === null ? None_1.default.of() : Some_1.default.of(value);
    }
}
exports.default = Maybe;
//# sourceMappingURL=Maybe.js.map