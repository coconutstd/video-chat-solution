"use strict";
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
class DevicePixelRatioWindowSource {
    devicePixelRatio() {
        if (typeof window === 'undefined' || !window || !window.devicePixelRatio) {
            return 1;
        }
        return window.devicePixelRatio;
    }
}
exports.default = DevicePixelRatioWindowSource;
//# sourceMappingURL=DevicePixelRatioWindowSource.js.map