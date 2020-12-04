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
const DefaultDeviceController_1 = require("../devicecontroller/DefaultDeviceController");
class ContentShareMediaStreamBroker {
    constructor(logger) {
        this.logger = logger;
    }
    get mediaStream() {
        return this._mediaStream;
    }
    set mediaStream(mediaStream) {
        this._mediaStream = mediaStream;
    }
    acquireAudioInputStream() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._mediaStream.getAudioTracks().length === 0) {
                return DefaultDeviceController_1.default.synthesizeAudioDevice(0);
            }
            return this._mediaStream;
        });
    }
    acquireVideoInputStream() {
        return __awaiter(this, void 0, void 0, function* () {
            return this._mediaStream;
        });
    }
    releaseMediaStream(_mediaStreamToRelease) {
        this.logger.warn('release media stream called');
        return;
    }
    acquireDisplayInputStream(streamConstraints) {
        return __awaiter(this, void 0, void 0, function* () {
            if (streamConstraints &&
                streamConstraints.video &&
                // @ts-ignore
                streamConstraints.video.mandatory &&
                // @ts-ignore
                streamConstraints.video.mandatory.chromeMediaSource &&
                // @ts-ignore
                streamConstraints.video.mandatory.chromeMediaSourceId) {
                return navigator.mediaDevices.getUserMedia(streamConstraints);
            }
            // @ts-ignore https://github.com/microsoft/TypeScript/issues/31821
            return navigator.mediaDevices.getDisplayMedia(streamConstraints);
        });
    }
    bindToAudioVideoController(_audioVideoController) {
        throw new Error('unsupported');
    }
    acquireScreenCaptureDisplayInputStream(sourceId, frameRate) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.acquireDisplayInputStream(this.screenCaptureDisplayMediaConstraints(sourceId, frameRate));
        });
    }
    screenCaptureDisplayMediaConstraints(sourceId, frameRate) {
        return {
            audio: !sourceId && new DefaultBrowserBehavior_1.default().getDisplayMediaAudioCaptureSupport()
                ? true
                : false,
            video: Object.assign(Object.assign({}, (!sourceId && {
                frameRate: {
                    max: frameRate ? frameRate : ContentShareMediaStreamBroker.defaultFrameRate,
                },
            })), (sourceId && {
                mandatory: {
                    chromeMediaSource: 'desktop',
                    chromeMediaSourceId: sourceId,
                    maxFrameRate: frameRate ? frameRate : ContentShareMediaStreamBroker.defaultFrameRate,
                },
            })),
        };
    }
    toggleMediaStream(enable) {
        let changed = false;
        if (this.mediaStream) {
            for (let i = 0; i < this.mediaStream.getTracks().length; i++) {
                if (this.mediaStream.getTracks()[i].enabled !== enable) {
                    this.mediaStream.getTracks()[i].enabled = enable;
                    changed = true;
                }
            }
        }
        return changed;
    }
    cleanup() {
        if (this.mediaStream) {
            for (let i = 0; i < this.mediaStream.getTracks().length; i++) {
                this.mediaStream.getTracks()[i].stop();
            }
        }
        this.mediaStream = null;
    }
}
exports.default = ContentShareMediaStreamBroker;
ContentShareMediaStreamBroker.defaultFrameRate = 15;
//# sourceMappingURL=ContentShareMediaStreamBroker.js.map