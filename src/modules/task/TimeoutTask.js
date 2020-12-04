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
const TimeoutScheduler_1 = require("../scheduler/TimeoutScheduler");
const BaseTask_1 = require("./BaseTask");
/**
 * [[TimeoutTask]] runs a subtask until it either succeeds or reaches a
 * timeout, at which point the subtask is canceled.
 */
class TimeoutTask extends BaseTask_1.default {
    constructor(logger, taskToRunBeforeTimeout, timeoutMs) {
        super(logger);
        this.taskToRunBeforeTimeout = taskToRunBeforeTimeout;
        this.timeoutMs = timeoutMs;
        this.taskName = `Timeout${this.timeoutMs}ms`;
        taskToRunBeforeTimeout.setParent(this);
    }
    cancel() {
        this.logger.info(`canceling timeout task ${this.name()} subtask ${this.taskToRunBeforeTimeout}`);
        this.taskToRunBeforeTimeout.cancel();
    }
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            const timer = new TimeoutScheduler_1.default(this.timeoutMs);
            timer.start(() => {
                this.logger.info(`timeout reached for task ${this.name()}`);
                this.taskToRunBeforeTimeout.cancel();
            });
            try {
                yield this.taskToRunBeforeTimeout.run();
            }
            finally {
                timer.stop();
            }
            this.logger.info(`timeout task ${this.name()} completed`);
        });
    }
}
exports.default = TimeoutTask;
//# sourceMappingURL=TimeoutTask.js.map