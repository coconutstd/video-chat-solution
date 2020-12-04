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
const BaseTask_1 = require("./BaseTask");
const TaskStatus_1 = require("./TaskStatus");
/**
 * [[SerialGroupTask]] runs a set of tasks in series. When canceled, it stops
 * any currently running task and runs no further tasks in the group.
 */
class SerialGroupTask extends BaseTask_1.default {
    constructor(logger, taskName, tasksToRunSerially) {
        super(logger);
        this.taskName = taskName;
        this.tasksToRunSerially = tasksToRunSerially;
        this.currentTask = null;
        for (const task of tasksToRunSerially) {
            task.setParent(this);
        }
    }
    cancel() {
        if (this.currentTask) {
            this.logger.info(`canceling serial group task ${this.name()} subtask ${this.currentTask.name()}`);
            this.currentTask.cancel();
        }
    }
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            for (const task of this.tasksToRunSerially) {
                if (this.getStatus() === TaskStatus_1.default.CANCELED) {
                    this.logAndThrow(`serial group task ${this.name()} was canceled`);
                }
                try {
                    this.logger.info(`serial group task ${this.name()} running subtask ${task.name()}`);
                    this.currentTask = task;
                    yield task.run();
                    this.logger.info(`serial group task ${this.name()} completed subtask ${task.name()}`);
                }
                catch (err) {
                    this.logAndThrow(`serial group task ${this.name()} was canceled due to subtask ` +
                        `${this.currentTask.name()} error: ${err.message}`);
                }
                finally {
                    this.currentTask = null;
                }
            }
            this.logger.info(`serial group task ${this.name()} completed`);
        });
    }
}
exports.default = SerialGroupTask;
//# sourceMappingURL=SerialGroupTask.js.map