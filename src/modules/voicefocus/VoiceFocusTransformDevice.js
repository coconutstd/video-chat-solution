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
const DefaultBrowserBehavior_1 = require("../browserbehavior/DefaultBrowserBehavior");
/**
 * A device that augments an {@link Device} to apply Amazon Voice Focus
 * noise suppression to an audio input.
 */
class VoiceFocusTransformDevice {
    /** @internal */
    constructor(device, voiceFocus, delegate, nodeOptions, failed = false, node = undefined, browserBehavior = new DefaultBrowserBehavior_1.default()) {
        this.device = device;
        this.voiceFocus = voiceFocus;
        this.delegate = delegate;
        this.nodeOptions = nodeOptions;
        this.failed = failed;
        this.node = node;
        this.browserBehavior = browserBehavior;
    }
    /**
     * Return the inner device as provided during construction, or updated via
     * {@link chooseNewInnerDevice}. Do not confuse this method with {@link intrinsicDevice}.
     */
    getInnerDevice() {
        return this.device;
    }
    /**
     * Disable the audio node while muted to reduce CPU usage.
     *
     * @param muted whether the audio device should be muted.
     */
    mute(muted) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.node) {
                return;
            }
            if (muted) {
                yield this.node.disable();
            }
            else {
                yield this.node.enable();
            }
        });
    }
    /**
     * Dispose of the inner workings of the transform device. After this method is called
     * you will need to create a new device to use Amazon Voice Focus again.
     */
    stop() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.node) {
                return;
            }
            this.node.disconnect();
            yield this.node.stop();
        });
    }
    /**
     * If you wish to choose a different inner device, but continue to use Amazon Voice Focus, you
     * can use this method to efficiently create a new device that will reuse
     * the same internal state. Only one of the two devices can be used at a time: switch
     * between them using {@link DeviceController.chooseAudioInputDevice}.
     *
     * If the same device is passed as is currently in use, `this` is returned.
     *
     * @param inner The new inner device to use.
     * @param enabled (optional) Whether to toggle the enabled state of the device.
     */
    chooseNewInnerDevice(inner) {
        return __awaiter(this, void 0, void 0, function* () {
            // If the new device is 'default', always recreate. Chrome can switch out
            // the real device underneath us.
            if (this.device === inner && !isDefaultDevice(inner)) {
                return this;
            }
            return new VoiceFocusTransformDevice(inner, this.voiceFocus, this.delegate, this.nodeOptions, this.failed, this.node, this.browserBehavior);
        });
    }
    intrinsicDevice() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.failed) {
                return this.device;
            }
            // Turn the Device into constraints with appropriate AGC settings.
            const trackConstraints = {
                echoCancellation: true,
                // @ts-ignore
                googEchoCancellation: true,
                // @ts-ignore
                googEchoCancellation2: true,
                noiseSuppression: false,
                // @ts-ignore
                googNoiseSuppression: false,
                // @ts-ignore
                googHighpassFilter: false,
                // @ts-ignore
                googNoiseSuppression2: false,
            };
            let useBuiltInAGC;
            if (this.nodeOptions && this.nodeOptions.agc !== undefined) {
                useBuiltInAGC = this.nodeOptions.agc.useBuiltInAGC;
            }
            else {
                useBuiltInAGC = true;
            }
            trackConstraints.autoGainControl = useBuiltInAGC;
            // @ts-ignore
            trackConstraints.googAutoGainControl = useBuiltInAGC;
            // @ts-ignore
            trackConstraints.googAutoGainControl2 = useBuiltInAGC;
            // Empty string and null.
            if (!this.device) {
                return trackConstraints;
            }
            // Device ID.
            if (typeof this.device === 'string') {
                /* istanbul ignore if */
                if (this.browserBehavior.requiresNoExactMediaStreamConstraints()) {
                    trackConstraints.deviceId = this.device;
                }
                else {
                    trackConstraints.deviceId = { exact: this.device };
                }
                return trackConstraints;
            }
            // It's a stream.
            if (this.device.id) {
                // Nothing we can do.
                return this.device;
            }
            // It's constraints.
            return Object.assign(Object.assign({}, this.device), trackConstraints);
        });
    }
    createAudioNode(context) {
        return __awaiter(this, void 0, void 0, function* () {
            const agc = { useVoiceFocusAGC: false };
            const options = Object.assign({ enabled: true, agc }, this.nodeOptions);
            try {
                this.node = yield this.voiceFocus.createNode(context, options);
                const start = this.node;
                const end = this.node;
                return { start, end };
            }
            catch (e) {
                // It's better to return some audio stream than nothing.
                this.failed = true;
                this.delegate.onFallback(this, e);
                throw e;
            }
        });
    }
    /**
     * Add an observer to receive notifications about Amazon Voice Focus lifecycle events.
     * See {@link VoiceFocusTransformDeviceObserver} for details.
     * If the observer has already been added, this method call has no effect.
     */
    addObserver(observer) {
        this.delegate.addObserver(observer);
    }
    /**
     * Remove an existing observer. If the observer has not been previously {@link
     * VoiceFocusTransformDevice.addObserver|added}, this method call has no effect.
     */
    removeObserver(observer) {
        this.delegate.removeObserver(observer);
    }
}
function isDefaultDevice(device) {
    if (device === 'default') {
        return true;
    }
    if (!device || typeof device !== 'object') {
        return false;
    }
    if ('deviceId' in device && device.deviceId === 'default') {
        return true;
    }
    if ('id' in device && device.id === 'default') {
        return true;
    }
    return false;
}
exports.default = VoiceFocusTransformDevice;
//# sourceMappingURL=VoiceFocusTransformDevice.js.map