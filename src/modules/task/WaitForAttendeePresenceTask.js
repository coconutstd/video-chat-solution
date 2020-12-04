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
const MeetingSessionStatusCode_1 = require("../meetingsession/MeetingSessionStatusCode");
const BaseTask_1 = require("./BaseTask");
/*
 * [[WaitForAttendeePresenceTask]] waits until an attendee presence event happens.
 */
class WaitForAttendeePresenceTask extends BaseTask_1.default {
    constructor(context) {
        super(context.logger);
        this.context = context;
        this.taskName = 'WaitForAttendeePresenceTask';
    }
    cancel() {
        const error = new Error(`canceling ${this.name()} due to the meeting status code: ${MeetingSessionStatusCode_1.default.NoAttendeePresent}`);
        this.cancelPromise && this.cancelPromise(error);
    }
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            const attendeeId = this.context.meetingSessionConfiguration.credentials.attendeeId;
            return new Promise((resolve, reject) => {
                const handler = (presentAttendeeId, present, _externalUserId, _dropped, _pos) => {
                    if (attendeeId === presentAttendeeId && present) {
                        this.context.realtimeController.realtimeUnsubscribeToAttendeeIdPresence(handler);
                        resolve();
                    }
                };
                this.cancelPromise = (error) => {
                    this.context.realtimeController.realtimeUnsubscribeToAttendeeIdPresence(handler);
                    reject(error);
                };
                this.context.realtimeController.realtimeSubscribeToAttendeeIdPresence(handler);
            });
        });
    }
}
exports.default = WaitForAttendeePresenceTask;
//# sourceMappingURL=WaitForAttendeePresenceTask.js.map