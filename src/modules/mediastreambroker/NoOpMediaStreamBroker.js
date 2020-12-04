"use strict";
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * [[NoOpDeviceBroker]] rejects requests to acquire a [[MediaStream]].
 */
class NoOpMediaStreamBroker {
    acquireAudioInputStream() {
        return Promise.reject();
    }
    acquireVideoInputStream() {
        return Promise.reject();
    }
    acquireDisplayInputStream(_streamConstraints) {
        return Promise.reject();
    }
    releaseMediaStream(_mediaStreamToRelease) { }
    bindToAudioVideoController(_audioVideoController) { }
}
exports.default = NoOpMediaStreamBroker;
//# sourceMappingURL=NoOpMediaStreamBroker.js.map