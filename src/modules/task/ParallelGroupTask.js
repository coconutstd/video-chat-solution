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
/**
 * [[ParallelGroupTask]] runs a set of tasks in parallel. When canceled, it
 * stops any currently running tasks.
 */
class ParallelGroupTask extends BaseTask_1.default {
    constructor(logger, taskName, tasksToRunParallel) {
        super(logger);
        this.taskName = taskName;
        this.tasksToRunParallel = tasksToRunParallel;
        for (const task of tasksToRunParallel) {
            task.setParent(this);
        }
    }
    cancel() {
        for (const task of this.tasksToRunParallel) {
            this.logger.info(`canceling parallel group task ${this.name()} subtask ${task.name()}`);
            task.cancel();
        }
    }
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            const taskResults = [];
            for (const task of this.tasksToRunParallel) {
                this.logger.info(`parallel group task ${this.name()} running subtask ${task.name()}`);
                taskResults.push(task.run());
            }
            const failures = [];
            for (let i = 0; i < taskResults.length; i++) {
                try {
                    yield taskResults[i];
                }
                catch (err) {
                    failures.push(`task ${this.tasksToRunParallel[i].name()} failed: ${err.message}`);
                }
                this.logger.info(`parallel group task ${this.name()} completed subtask ${this.tasksToRunParallel[i].name()}`);
            }
            if (failures.length > 0) {
                const failureMessage = failures.join(', ');
                this.logAndThrow(`parallel group task ${this.name()} failed for tasks: ${failureMessage}`);
            }
            this.logger.info(`parallel group task ${this.name()} completed`);
        });
    }
}
exports.default = ParallelGroupTask;
//# sourceMappingURL=ParallelGroupTask.js.map