"use strict";
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
/** @internal */
function stringify(args) {
    return args
        .map((v) => {
        if (typeof v === 'object') {
            return JSON.stringify(v);
        }
        return `${v}`;
    })
        .join(' ');
}
/** @internal */
class LoggerAdapter {
    constructor(base) {
        this.base = base;
    }
    debug(...args) {
        this.base.debug(stringify(args));
    }
    info(...args) {
        this.base.info(stringify(args));
    }
    warn(...args) {
        this.base.warn(stringify(args));
    }
    error(...args) {
        this.base.error(stringify(args));
    }
}
exports.default = LoggerAdapter;
//# sourceMappingURL=LoggerAdapter.js.map