"use strict";
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
const Maybe_1 = require("./Maybe");
class Some {
    constructor(value) {
        this.value = value;
        this.isSome = true;
        this.isNone = false;
    }
    map(f) {
        return Maybe_1.default.of(f(this.value));
    }
    flatMap(f) {
        return f(this.value);
    }
    get() {
        return this.value;
    }
    getOrElse(_value) {
        return this.value;
    }
    defaulting(value) {
        return Maybe_1.default.of(this.getOrElse(value));
    }
    static of(value) {
        if (value === null || value === undefined) {
            throw new Error('value is ${value}');
        }
        return new Some(value);
    }
}
exports.default = Some;
//# sourceMappingURL=Some.js.map