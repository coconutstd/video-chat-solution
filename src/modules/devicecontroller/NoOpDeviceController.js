"use strict";
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
const NoOpMediaStreamBroker_1 = require("../mediastreambroker/NoOpMediaStreamBroker");
class NoOpDeviceController extends NoOpMediaStreamBroker_1.default {
    constructor(_options) {
        super();
    }
    listAudioInputDevices() {
        return Promise.resolve([]);
    }
    listVideoInputDevices() {
        return Promise.resolve([]);
    }
    listAudioOutputDevices() {
        return Promise.resolve([]);
    }
    chooseAudioInputDevice(_device) {
        return Promise.reject();
    }
    chooseVideoInputDevice(_device) {
        return Promise.reject();
    }
    chooseAudioOutputDevice(_deviceId) {
        return Promise.reject();
    }
    addDeviceChangeObserver(_observer) { }
    removeDeviceChangeObserver(_observer) { }
    createAnalyserNodeForAudioInput() {
        return null;
    }
    startVideoPreviewForVideoInput(_element) { }
    stopVideoPreviewForVideoInput(_element) { }
    setDeviceLabelTrigger(_trigger) { }
    mixIntoAudioInput(_stream) {
        return null;
    }
    chooseVideoInputQuality(_width, _height, _frameRate, _maxBandwidthKbps) { }
    getVideoInputQualitySettings() {
        return null;
    }
}
exports.default = NoOpDeviceController;
//# sourceMappingURL=NoOpDeviceController.js.map