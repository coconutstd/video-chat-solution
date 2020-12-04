"use strict";
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAudioTransformDevice = void 0;
/**
 * `isAudioTransformDevice` is a type guard for {@link AudioTransformDevice}.
 *
 * @param device the value to check.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any,@typescript-eslint/explicit-module-boundary-types
function isAudioTransformDevice(device) {
    return (!!device &&
        typeof device === 'object' &&
        'mute' in device &&
        'stop' in device &&
        'intrinsicDevice' in device);
}
exports.isAudioTransformDevice = isAudioTransformDevice;
//# sourceMappingURL=AudioTransformDevice.js.map