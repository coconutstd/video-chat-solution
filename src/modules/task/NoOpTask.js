"use strict";
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
class NoOpTask {
    cancel() { }
    name() {
        return 'NoOpTask';
    }
    run() {
        return;
    }
    setParent(_parentTask) { }
}
exports.default = NoOpTask;
//# sourceMappingURL=NoOpTask.js.map