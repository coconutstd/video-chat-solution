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
const ua_parser_js_1 = require("ua-parser-js");
const Versioning_1 = require("../versioning/Versioning");
class DefaultEventController {
    constructor(audioVideoController) {
        var _a, _b, _c, _d, _e, _f, _g;
        this.audioVideoController = audioVideoController;
        /** @internal */
        this.meetingHistoryStates = [];
        try {
            this.parserResult =
                navigator && navigator.userAgent ? new ua_parser_js_1.UAParser(navigator.userAgent).getResult() : null;
        }
        catch (error) {
            audioVideoController.logger.error(error.message);
        }
        this.browserMajorVersion =
            ((_c = (_b = (_a = this.parserResult) === null || _a === void 0 ? void 0 : _a.browser) === null || _b === void 0 ? void 0 : _b.version) === null || _c === void 0 ? void 0 : _c.split('.')[0]) || DefaultEventController.UNAVAILABLE;
        this.browserName = ((_d = this.parserResult) === null || _d === void 0 ? void 0 : _d.browser.name) || DefaultEventController.UNAVAILABLE;
        this.browserVersion = ((_e = this.parserResult) === null || _e === void 0 ? void 0 : _e.browser.version) || DefaultEventController.UNAVAILABLE;
        this.deviceName =
            [((_f = this.parserResult) === null || _f === void 0 ? void 0 : _f.device.vendor) || '', ((_g = this.parserResult) === null || _g === void 0 ? void 0 : _g.device.model) || '']
                .join(' ')
                .trim() || DefaultEventController.UNAVAILABLE;
    }
    publishEvent(name, attributes) {
        return __awaiter(this, void 0, void 0, function* () {
            const timestampMs = Date.now();
            yield this.pushMeetingState(name, timestampMs);
            // Make a single frozen copy of the event, reusing the object returned by
            // `getAttributes` to avoid copying too much.
            const eventAttributes = Object.freeze(Object.assign(this.getAttributes(timestampMs), attributes));
            this.audioVideoController.forEachObserver((observer) => {
                if (observer.eventDidReceive) {
                    observer.eventDidReceive(name, eventAttributes);
                }
            });
        });
    }
    pushMeetingState(state, timestampMs = Date.now()) {
        return __awaiter(this, void 0, void 0, function* () {
            this.meetingHistoryStates.push({
                name: state,
                timestampMs,
            });
        });
    }
    getAttributes(timestampMs) {
        var _a, _b;
        return {
            attendeeId: this.audioVideoController.configuration.credentials.attendeeId,
            browserMajorVersion: this.browserMajorVersion,
            browserName: this.browserName,
            browserVersion: this.browserVersion,
            deviceName: this.deviceName,
            externalMeetingId: typeof this.audioVideoController.configuration.externalMeetingId === 'string'
                ? this.audioVideoController.configuration.externalMeetingId
                : '',
            externalUserId: this.audioVideoController.configuration.credentials.externalUserId,
            meetingHistory: this.meetingHistoryStates,
            meetingId: this.audioVideoController.configuration.meetingId,
            osName: ((_a = this.parserResult) === null || _a === void 0 ? void 0 : _a.os.name) || DefaultEventController.UNAVAILABLE,
            osVersion: ((_b = this.parserResult) === null || _b === void 0 ? void 0 : _b.os.version) || DefaultEventController.UNAVAILABLE,
            sdkVersion: Versioning_1.default.sdkVersion,
            sdkName: Versioning_1.default.sdkName,
            timestampMs,
        };
    }
}
exports.default = DefaultEventController;
/** @internal */
DefaultEventController.UNAVAILABLE = 'Unavailable';
//# sourceMappingURL=DefaultEventController.js.map