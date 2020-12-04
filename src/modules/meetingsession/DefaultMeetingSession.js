"use strict";
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
const DefaultAudioVideoController_1 = require("../audiovideocontroller/DefaultAudioVideoController");
const DefaultAudioVideoFacade_1 = require("../audiovideofacade/DefaultAudioVideoFacade");
const FullJitterBackoff_1 = require("../backoff/FullJitterBackoff");
const DefaultBrowserBehavior_1 = require("../browserbehavior/DefaultBrowserBehavior");
const ContentShareMediaStreamBroker_1 = require("../contentsharecontroller/ContentShareMediaStreamBroker");
const DefaultContentShareController_1 = require("../contentsharecontroller/DefaultContentShareController");
const DefaultReconnectController_1 = require("../reconnectcontroller/DefaultReconnectController");
const DefaultWebSocketAdapter_1 = require("../websocketadapter/DefaultWebSocketAdapter");
class DefaultMeetingSession {
    constructor(configuration, logger, deviceController) {
        this._configuration = configuration;
        this._logger = logger;
        this.checkBrowserSupportAndFeatureConfiguration();
        this._deviceController = deviceController;
        this.audioVideoController = new DefaultAudioVideoController_1.default(this._configuration, this._logger, new DefaultWebSocketAdapter_1.default(this._logger), deviceController, new DefaultReconnectController_1.default(DefaultMeetingSession.RECONNECT_TIMEOUT_MS, new FullJitterBackoff_1.default(DefaultMeetingSession.RECONNECT_FIXED_WAIT_MS, DefaultMeetingSession.RECONNECT_SHORT_BACKOFF_MS, DefaultMeetingSession.RECONNECT_LONG_BACKOFF_MS)));
        deviceController.bindToAudioVideoController(this.audioVideoController);
        const contentShareMediaStreamBroker = new ContentShareMediaStreamBroker_1.default(this._logger);
        this.contentShareController = new DefaultContentShareController_1.default(contentShareMediaStreamBroker, new DefaultAudioVideoController_1.default(DefaultContentShareController_1.default.createContentShareMeetingSessionConfigure(this._configuration), this._logger, new DefaultWebSocketAdapter_1.default(this._logger), contentShareMediaStreamBroker, new DefaultReconnectController_1.default(DefaultMeetingSession.RECONNECT_TIMEOUT_MS, new FullJitterBackoff_1.default(DefaultMeetingSession.RECONNECT_FIXED_WAIT_MS, DefaultMeetingSession.RECONNECT_SHORT_BACKOFF_MS, DefaultMeetingSession.RECONNECT_LONG_BACKOFF_MS))), this.audioVideoController);
        this.audioVideoFacade = new DefaultAudioVideoFacade_1.default(this.audioVideoController, this.audioVideoController.videoTileController, this.audioVideoController.realtimeController, this.audioVideoController.audioMixController, this._deviceController, this.contentShareController);
    }
    get configuration() {
        return this._configuration;
    }
    get logger() {
        return this._logger;
    }
    get audioVideo() {
        return this.audioVideoFacade;
    }
    get contentShare() {
        return this.contentShareController;
    }
    get deviceController() {
        return this._deviceController;
    }
    checkBrowserSupportAndFeatureConfiguration() {
        const browserBehavior = new DefaultBrowserBehavior_1.default();
        const browser = `${browserBehavior.name()} ${browserBehavior.majorVersion()} (${browserBehavior.version()})`;
        this.logger.info(`browser is ${browser}`);
        if (!browserBehavior.isSupported()) {
            this.logger.warn('this browser is not currently supported. ' +
                'Stability may suffer. ' +
                `Supported browsers are: ${browserBehavior.supportString()}.`);
        }
        if (this._configuration.enableUnifiedPlanForChromiumBasedBrowsers) {
            if (browserBehavior.hasChromiumWebRTC()) {
                this.logger.info('WebRTC unified plan for Chromium-based browsers is enabled');
            }
            else {
                this.logger.info(`WebRTC unified plan is required for ${browserBehavior.name()}`);
            }
        }
        if (this._configuration.enableSimulcastForUnifiedPlanChromiumBasedBrowsers) {
            if (!this._configuration.enableUnifiedPlanForChromiumBasedBrowsers) {
                this._configuration.enableSimulcastForUnifiedPlanChromiumBasedBrowsers = false;
                this.logger.info('Simulcast requires enabling WebRTC Unified Plan for Chromium-based browsers');
            }
            else if (browserBehavior.hasChromiumWebRTC()) {
                this.logger.info(`Simulcast is enabled for ${browserBehavior.name()}`);
            }
            else {
                this._configuration.enableSimulcastForUnifiedPlanChromiumBasedBrowsers = false;
                this.logger.info('Simulcast requires WebRTC Unified Plan and is only supported on Chromium-based browsers');
            }
        }
    }
}
exports.default = DefaultMeetingSession;
DefaultMeetingSession.RECONNECT_TIMEOUT_MS = 120 * 1000;
DefaultMeetingSession.RECONNECT_FIXED_WAIT_MS = 0;
DefaultMeetingSession.RECONNECT_SHORT_BACKOFF_MS = 1 * 1000;
DefaultMeetingSession.RECONNECT_LONG_BACKOFF_MS = 5 * 1000;
//# sourceMappingURL=DefaultMeetingSession.js.map