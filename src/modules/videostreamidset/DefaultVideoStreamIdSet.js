"use strict";
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * [[DefaultVideoStreamIdSet]] implements [[VideoStreamIdSet]].
 */
class DefaultVideoStreamIdSet {
    constructor(ids) {
        this.ids = new Set(ids);
    }
    add(streamId) {
        this.ids.add(streamId);
    }
    array() {
        const values = Array.from(this.ids.values());
        return values.sort((a, b) => a - b);
    }
    contain(streamId) {
        return this.ids.has(streamId);
    }
    empty() {
        return this.ids.size === 0;
    }
    size() {
        return this.ids.size;
    }
    equal(other) {
        if (!other) {
            return this.ids.size === 0;
        }
        const x = this.array();
        const y = other.array();
        if (x.length !== y.length) {
            return false;
        }
        for (let i = 0; i < x.length; i++) {
            if (x[i] !== y[i]) {
                return false;
            }
        }
        return true;
    }
    clone() {
        return new DefaultVideoStreamIdSet(this.array());
    }
    remove(streamId) {
        this.ids.delete(streamId);
    }
    toJSON() {
        return this.array();
    }
}
exports.default = DefaultVideoStreamIdSet;
//# sourceMappingURL=DefaultVideoStreamIdSet.js.map