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
class CleanRestartedSessionTask extends BaseTask_1.default {
    constructor(context) {
        super(context.logger);
        this.context = context;
        this.taskName = 'CleanRestartedSessionTask';
    }
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.context.peer) {
                this.context.peer.close();
            }
            this.context.transceiverController.reset();
            this.context.localVideoSender = null;
            this.context.peer = null;
            this.context.videoDownlinkBandwidthPolicy.reset();
            this.context.iceCandidateHandler = null;
            this.context.iceCandidates = [];
            this.context.previousSdpOffer = null;
        });
    }
}
exports.default = CleanRestartedSessionTask;
//# sourceMappingURL=CleanRestartedSessionTask.js.map