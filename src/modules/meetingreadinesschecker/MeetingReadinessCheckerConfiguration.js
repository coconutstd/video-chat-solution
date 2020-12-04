"use strict";
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * [[MeetingReadinessCheckerConfiguration]] includes custom settings used for MeetingReadinessChecker
 */
class MeetingReadinessCheckerConfiguration {
    constructor() {
        /**
         * Specify how long to wait for each check in a test.
         * If null, it will use the default value.
         */
        this.timeoutMs = 10000;
        /**
         * Specify the wait time before checking again when a check condition is not met.
         * If null, it will use the default value.
         */
        this.waitDurationMs = 3000;
    }
}
exports.default = MeetingReadinessCheckerConfiguration;
//# sourceMappingURL=MeetingReadinessCheckerConfiguration.js.map