"use strict";
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
const MediaDeviceProxyHandler_1 = require("./MediaDeviceProxyHandler");
class DefaultMediaDeviceFactory {
    constructor() {
        this.isMediaDevicesSupported = typeof navigator !== 'undefined' && !!navigator.mediaDevices;
    }
    create() {
        if (!this.isMediaDevicesSupported) {
            throw new Error(`navigator.mediaDevices is not supported`);
        }
        else {
            return new Proxy(navigator.mediaDevices, new MediaDeviceProxyHandler_1.default());
        }
    }
}
exports.default = DefaultMediaDeviceFactory;
//# sourceMappingURL=DefaultMediaDeviceFactory.js.map