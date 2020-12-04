"use strict";
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const AsyncScheduler_1 = require("../scheduler/AsyncScheduler");
const IntervalScheduler_1 = require("../scheduler/IntervalScheduler");
class MediaDeviceProxyHandler {
    constructor() {
        this.scheduler = null;
        this.devices = null;
        this.deviceChangeListeners = new Set();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any,@typescript-eslint/explicit-module-boundary-types
        this.get = (target, property, receiver) => {
            if (!Reflect.has(target, property)) {
                return undefined;
            }
            if (!('ondevicechange' in navigator.mediaDevices)) {
                if (property === 'addEventListener') {
                    return this.patchAddEventListener(target, property, receiver);
                }
                else if (property === 'removeEventListener') {
                    return this.patchRemoveEventListener(target, property, receiver);
                }
            }
            const value = Reflect.get(target, property, receiver);
            return typeof value === 'function' ? value.bind(target) : value;
        };
        this.patchAddEventListener = (target, property, 
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        receiver) => {
            const value = Reflect.get(target, property, receiver);
            return (type, listener, options) => {
                if (type === 'devicechange') {
                    this.deviceChangeListeners.add(listener);
                    if (!this.scheduler) {
                        this.scheduler = new IntervalScheduler_1.default(MediaDeviceProxyHandler.INTERVAL_MS);
                        this.scheduler.start(this.pollDeviceLists);
                    }
                }
                else {
                    return Reflect.apply(value, target, [type, listener, options]);
                }
            };
        };
        this.patchRemoveEventListener = (target, property, 
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        receiver) => {
            const value = Reflect.get(target, property, receiver);
            return (type, listener, options) => {
                if (type === 'devicechange') {
                    this.deviceChangeListeners.delete(listener);
                    if (this.deviceChangeListeners.size === 0 && this.scheduler) {
                        this.scheduler.stop();
                        this.scheduler = null;
                    }
                }
                else {
                    return Reflect.apply(value, target, [type, listener, options]);
                }
            };
        };
        this.pollDeviceLists = () => __awaiter(this, void 0, void 0, function* () {
            const newDevices = yield this.sortedDeviceList();
            if (this.devices) {
                const changed = newDevices.length !== this.devices.length ||
                    newDevices.some((device, index) => {
                        return device.deviceId !== this.devices[index].deviceId;
                    });
                if (changed) {
                    this.handleDeviceChangeEvent();
                }
            }
            this.devices = newDevices;
        });
    }
    sortedDeviceList() {
        return __awaiter(this, void 0, void 0, function* () {
            // @ts-ignore
            const newDevices = yield navigator.mediaDevices.enumerateDevices();
            return newDevices.sort((device1, device2) => {
                if (device1.deviceId < device2.deviceId) {
                    return 1;
                }
                else if (device1.deviceId > device2.deviceId) {
                    return -1;
                }
                else {
                    return 0;
                }
            });
        });
    }
    handleDeviceChangeEvent() {
        for (const listener of this.deviceChangeListeners) {
            new AsyncScheduler_1.default().start(() => {
                /* istanbul ignore else */
                if (this.deviceChangeListeners.has(listener)) {
                    const event = new Event('devicechange');
                    if (typeof listener === 'function') {
                        listener(event);
                    }
                    else {
                        listener.handleEvent(event);
                    }
                }
            });
        }
    }
}
exports.default = MediaDeviceProxyHandler;
MediaDeviceProxyHandler.INTERVAL_MS = 1000;
//# sourceMappingURL=MediaDeviceProxyHandler.js.map