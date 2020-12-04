"use strict";
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
const BaseTask_1 = require("./BaseTask");
/**
 * [[RunnableTask]] Task wrapper for any Promised-operation
 */
class RunnableTask extends BaseTask_1.default {
    constructor(logger, fn, taskName = 'RunnableTask') {
        super(logger);
        this.fn = fn;
        this.taskName = taskName;
    }
    run() {
        return this.fn().then(() => { });
    }
}
exports.default = RunnableTask;
//# sourceMappingURL=RunnableTask.js.map