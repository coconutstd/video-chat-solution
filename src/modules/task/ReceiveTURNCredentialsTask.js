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
const MeetingSessionTURNCredentials_1 = require("../meetingsession/MeetingSessionTURNCredentials");
const DefaultModality_1 = require("../modality/DefaultModality");
const Versioning_1 = require("../versioning/Versioning");
const BaseTask_1 = require("./BaseTask");
/*
 * [[ReceiveTURNCredentialsTask]] asynchronously retrieves TURN credentials.
 */
class ReceiveTURNCredentialsTask extends BaseTask_1.default {
    constructor(context) {
        super(context.logger);
        this.context = context;
        this.taskName = 'ReceiveTURNCredentialsTask';
        this.url = context.meetingSessionConfiguration.urls.turnControlURL;
        this.meetingId = context.meetingSessionConfiguration.meetingId;
        this.joinToken = context.meetingSessionConfiguration.credentials.joinToken;
    }
    cancel() {
        const error = new Error(`canceling ${this.name()}`);
        this.cancelPromise && this.cancelPromise(error);
    }
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.context.turnCredentials) {
                this.context.logger.info('TURN credentials available, skipping credentials fetch');
                return;
            }
            this.context.logger.error('missing TURN credentials - falling back to fetch');
            if (!this.url) {
                this.context.logger.info('TURN control url not supplied, skipping credentials fetch');
                return;
            }
            const options = {
                method: 'POST',
                mode: 'cors',
                cache: 'no-cache',
                credentials: 'omit',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Chime-Auth-Token': '_aws_wt_session=' + new DefaultModality_1.default(this.joinToken).base(),
                },
                redirect: 'follow',
                referrer: 'no-referrer',
                body: JSON.stringify({ meetingId: this.meetingId }),
            };
            this.context.logger.info(`requesting TURN credentials from ${this.url}`);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const responseBodyJson = yield new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                this.cancelPromise = (error) => {
                    reject(error);
                };
                try {
                    const responseBody = yield fetch(Versioning_1.default.urlWithVersion(this.url), options);
                    this.context.logger.info(`received TURN credentials`);
                    if (responseBody.status && responseBody.status === 403) {
                        reject(new Error(`canceling ${this.name()} due to the meeting status code: ${MeetingSessionStatusCode_1.default.TURNCredentialsForbidden}`));
                    }
                    if (responseBody.status && responseBody.status === 404) {
                        reject(new Error(`canceling ${this.name()} due to the meeting status code: ${MeetingSessionStatusCode_1.default.MeetingEnded}`));
                    }
                    resolve(yield responseBody.json());
                }
                catch (error) {
                    reject(error);
                }
            }));
            this.context.turnCredentials = new MeetingSessionTURNCredentials_1.default();
            this.context.turnCredentials.password = responseBodyJson.password;
            this.context.turnCredentials.ttl = responseBodyJson.ttl;
            this.context.turnCredentials.uris = responseBodyJson.uris
                .map((uri) => {
                return this.context.meetingSessionConfiguration.urls.urlRewriter(uri);
            })
                .filter((uri) => {
                return !!uri;
            });
            this.context.turnCredentials.username = responseBodyJson.username;
        });
    }
}
exports.default = ReceiveTURNCredentialsTask;
//# sourceMappingURL=ReceiveTURNCredentialsTask.js.map