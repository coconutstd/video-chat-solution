"use strict";
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
class DefaultDevicePixelRatioMonitor {
    constructor(devicePixelRatioSource, logger) {
        this.devicePixelRatioSource = devicePixelRatioSource;
        this.mediaQueryListener = () => {
            this.observerQueue.forEach(tileObserver => {
                tileObserver.devicePixelRatioChanged(this.devicePixelRatioSource.devicePixelRatio());
            });
        };
        this.observerQueue = new Set();
        if (typeof window !== 'undefined') {
            const mediaQueryList = matchMedia(`(resolution: ${this.devicePixelRatioSource.devicePixelRatio()}dppx)`);
            if (typeof mediaQueryList.addEventListener === 'function') {
                mediaQueryList.addEventListener('change', this.mediaQueryListener);
            }
            else if (typeof mediaQueryList.addListener === 'function') {
                mediaQueryList.addListener(this.mediaQueryListener);
            }
            else {
                logger.warn('ignoring DefaultDevicePixelRatioMonitor');
            }
        }
    }
    registerObserver(observer) {
        this.observerQueue.add(observer);
        observer.devicePixelRatioChanged(this.devicePixelRatioSource.devicePixelRatio());
    }
    removeObserver(observer) {
        this.observerQueue.delete(observer);
    }
}
exports.default = DefaultDevicePixelRatioMonitor;
//# sourceMappingURL=DefaultDevicePixelRatioMonitor.js.map