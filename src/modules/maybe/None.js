"use strict";
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
const Maybe_1 = require("./Maybe");
class None {
    constructor() {
        this.isSome = false;
        this.isNone = true;
    }
    get() {
        throw new Error('value is null');
    }
    getOrElse(value) {
        return value;
    }
    map(_f) {
        return new None();
    }
    flatMap(_f) {
        return new None();
    }
    defaulting(value) {
        return Maybe_1.default.of(this.getOrElse(value));
    }
    static of() {
        return new None();
    }
}
exports.default = None;
//# sourceMappingURL=None.js.map