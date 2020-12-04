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
const LogLevel_1 = require("../logger/LogLevel");
const IntervalScheduler_1 = require("../scheduler/IntervalScheduler");
const Log_1 = require("./Log");
class MeetingSessionPOSTLogger {
    constructor(name, configuration, batchSize, intervalMs, url, level = LogLevel_1.default.WARN) {
        this.name = name;
        this.configuration = configuration;
        this.batchSize = batchSize;
        this.intervalMs = intervalMs;
        this.url = url;
        this.level = level;
        this.logCapture = [];
        this.sequenceNumber = 0;
        this.lock = false;
        this.intervalScheduler = new IntervalScheduler_1.default(this.intervalMs);
        this.startLogPublishScheduler(this.batchSize);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const GlobalAny = global;
        GlobalAny['window']['addEventListener'] &&
            window.addEventListener('unload', () => {
                this.stop();
            });
    }
    debug(debugFunction) {
        if (LogLevel_1.default.DEBUG < this.level) {
            return;
        }
        this.log(LogLevel_1.default.DEBUG, debugFunction());
    }
    info(msg) {
        this.log(LogLevel_1.default.INFO, msg);
    }
    warn(msg) {
        this.log(LogLevel_1.default.WARN, msg);
    }
    error(msg) {
        this.log(LogLevel_1.default.ERROR, msg);
    }
    setLogLevel(level) {
        this.level = level;
    }
    getLogLevel() {
        return this.level;
    }
    getLogCaptureSize() {
        return this.logCapture.length;
    }
    startLogPublishScheduler(batchSize) {
        this.intervalScheduler.start(() => __awaiter(this, void 0, void 0, function* () {
            if (this.lock === true || this.getLogCaptureSize() === 0) {
                return;
            }
            this.lock = true;
            const batch = this.logCapture.slice(0, batchSize);
            const body = this.makeRequestBody(batch);
            try {
                const response = yield fetch(this.url, {
                    method: 'POST',
                    body,
                });
                if (response.status === 200) {
                    this.logCapture = this.logCapture.slice(batch.length);
                }
            }
            catch (error) {
                console.warn('[MeetingSessionPOSTLogger] ' + error.message);
            }
            finally {
                this.lock = false;
            }
        }));
    }
    stop() {
        this.intervalScheduler.stop();
        const body = this.makeRequestBody(this.logCapture);
        navigator.sendBeacon(this.url, body);
    }
    makeRequestBody(batch) {
        return JSON.stringify({
            meetingId: this.configuration.meetingId,
            attendeeId: this.configuration.credentials.attendeeId,
            appName: this.name,
            logs: batch,
        });
    }
    log(type, msg) {
        if (type < this.level) {
            return;
        }
        const date = new Date();
        this.logCapture.push(new Log_1.default(this.sequenceNumber, msg, date.getTime(), LogLevel_1.default[type]));
        this.sequenceNumber += 1;
    }
}
exports.default = MeetingSessionPOSTLogger;
//# sourceMappingURL=MeetingSessionPOSTLogger.js.map