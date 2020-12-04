"use strict";
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
class NoOpVideoElementFactory {
    create() {
        const element = {
            clientWidth: 400,
            clientHeight: 300,
            width: 400,
            height: 300,
            videoWidth: 400,
            videoHeight: 300,
            style: {
                transform: '',
            },
            hasAttribute: () => {
                return false;
            },
            removeAttribute: () => { },
            setAttribute: () => { },
            srcObject: false,
            pause: () => { },
        };
        // @ts-ignore
        return element;
    }
}
exports.default = NoOpVideoElementFactory;
//# sourceMappingURL=NoOpVideoElementFactory.js.map