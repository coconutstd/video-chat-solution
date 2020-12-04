"use strict";
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
class DeviceSelection {
    constructor() {
        this.groupId = '';
    }
    matchesConstraints(constraints) {
        return JSON.stringify(this.constraints) === JSON.stringify(constraints);
    }
}
exports.default = DeviceSelection;
//# sourceMappingURL=DeviceSelection.js.map