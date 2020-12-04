"use strict";
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
exports.isVideoTransformDevice = void 0;
/**
 * `isVideoTransformDevice` is a type guard for {@link VideoTransformDevice}.
 *
 * @param device the value to check.
 */
function isVideoTransformDevice(device) {
    return (!!device &&
        typeof device === 'object' &&
        'applyProcessors' in device &&
        'stop' in device &&
        'intrinsicDevice' in device);
}
exports.isVideoTransformDevice = isVideoTransformDevice;
//# sourceMappingURL=VideoTransformDevice.js.map