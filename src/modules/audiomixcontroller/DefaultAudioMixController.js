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
class DefaultAudioMixController {
    constructor(logger) {
        this.logger = logger;
        this.audioDevice = null;
        this.audioElement = null;
        this.audioStream = null;
        this.browserBehavior = new DefaultBrowserBehavior_1.default();
    }
    bindAudioElement(element) {
        return __awaiter(this, void 0, void 0, function* () {
            if (element) {
                this.audioElement = element;
                this.audioElement.autoplay = true;
                return this.bindAudioMix();
            }
            else {
                throw new Error(`Cannot bind audio element: ${element}`);
            }
        });
    }
    unbindAudioElement() {
        if (this.audioElement) {
            this.audioElement.srcObject = null;
            this.audioElement = null;
        }
    }
    bindAudioStream(stream) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            if (stream) {
                this.audioStream = stream;
                try {
                    yield this.bindAudioMix();
                }
                catch (error) {
                    (_a = this.logger) === null || _a === void 0 ? void 0 : _a.error(`Failed to bind audio stream: ${error}`);
                }
            }
        });
    }
    bindAudioDevice(device) {
        return __awaiter(this, void 0, void 0, function* () {
            /**
             * Throw error if browser doesn't even support setSinkId
             * Read more: https://caniuse.com/?search=setSinkId
             */
            if (!this.browserBehavior.supportsSetSinkId()) {
                throw new Error('Cannot select audio output device. This browser does not support setSinkId.');
            }
            if (device) {
                this.audioDevice = device;
                return this.bindAudioMix();
            }
        });
    }
    bindAudioMix() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.audioElement) {
                return;
            }
            if (this.audioStream) {
                this.audioElement.srcObject = this.audioStream;
            }
            // @ts-ignore
            if (typeof this.audioElement.sinkId === 'undefined') {
                throw new Error('Cannot select audio output device. This browser does not support setSinkId.');
            }
            const newSinkId = this.audioDevice ? this.audioDevice.deviceId : '';
            // @ts-ignore
            const oldSinkId = this.audioElement.sinkId;
            if (newSinkId === oldSinkId) {
                return;
            }
            const existingAudioElement = this.audioElement;
            const existingStream = this.audioStream;
            if (this.browserBehavior.hasChromiumWebRTC()) {
                existingAudioElement.srcObject = null;
            }
            try {
                // @ts-ignore
                yield existingAudioElement.setSinkId(newSinkId);
            }
            catch (error) {
                (_a = this.logger) === null || _a === void 0 ? void 0 : _a.error(`Failed to set sinkId for audio element: ${error}`);
                throw error;
            }
            if (this.browserBehavior.hasChromiumWebRTC()) {
                existingAudioElement.srcObject = existingStream;
            }
        });
    }
}
exports.default = DefaultAudioMixController;
//# sourceMappingURL=DefaultAudioMixController.js.map