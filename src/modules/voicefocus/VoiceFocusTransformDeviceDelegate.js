"use strict";
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
/** @internal */
class VoiceFocusTransformDeviceDelegate {
    constructor() {
        this.observers = new Set();
    }
    addObserver(observer) {
        this.observers.add(observer);
    }
    removeObserver(observer) {
        this.observers.delete(observer);
    }
    /** @internal */
    onFallback(device, e) {
        var _a;
        for (const observer of this.observers) {
            (_a = observer.voiceFocusFellBackToInnerStream) === null || _a === void 0 ? void 0 : _a.call(observer, device, e);
        }
    }
    onCPUWarning() {
        var _a;
        for (const observer of this.observers) {
            (_a = observer.voiceFocusInsufficientResources) === null || _a === void 0 ? void 0 : _a.call(observer);
        }
    }
}
exports.default = VoiceFocusTransformDeviceDelegate;
//# sourceMappingURL=VoiceFocusTransformDeviceDelegate.js.map