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
const TaskStatus_1 = require("./TaskStatus");
/*
 * [[BaseTask]] provides common utilities for task implementations.
 */
class BaseTask {
    constructor(logger) {
        this.logger = logger;
        this.taskName = 'BaseTask';
        this.parentTask = null;
        this.status = TaskStatus_1.default.IDLE;
        this.run = this.baseRun.bind(this, this.run);
        this.cancel = this.baseCancel.bind(this, this.cancel);
    }
    cancel() { }
    name() {
        return this.parentTask ? `${this.parentTask.name()}/${this.taskName}` : this.taskName;
    }
    setParent(parentTask) {
        this.parentTask = parentTask;
    }
    getStatus() {
        return this.status;
    }
    logAndThrow(message) {
        this.logger.info(message);
        throw new Error(message);
    }
    baseRun(originalRun) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const startTime = Date.now();
                this.logger.info(`running task ${this.name()}`);
                switch (this.status) {
                    case TaskStatus_1.default.RUNNING:
                        this.logAndThrow(`${this.name()} is already running`);
                    case TaskStatus_1.default.CANCELED:
                        this.logAndThrow(`${this.name()} was canceled before running`);
                    case TaskStatus_1.default.FINISHED:
                        this.logAndThrow(`${this.name()} was already finished`);
                }
                this.status = TaskStatus_1.default.RUNNING;
                yield originalRun.call(this);
                this.logger.info(`${this.name()} took ${Math.round(Date.now() - startTime)} ms`);
            }
            catch (err) {
                throw err;
            }
            finally {
                if (this.status !== TaskStatus_1.default.CANCELED) {
                    this.status = TaskStatus_1.default.FINISHED;
                }
            }
        });
    }
    baseCancel(originalCancel) {
        if (this.status === TaskStatus_1.default.CANCELED || this.status === TaskStatus_1.default.FINISHED) {
            return;
        }
        this.logger.info(`canceling task ${this.name()}`);
        this.status = TaskStatus_1.default.CANCELED;
        originalCancel.call(this);
    }
}
exports.default = BaseTask;
//# sourceMappingURL=BaseTask.js.map