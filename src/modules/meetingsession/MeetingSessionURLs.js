"use strict";
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * [[MeetingSessionURLs]] contains the URLs that will be used to reach the
 * meeting service.
 */
class MeetingSessionURLs {
    constructor() {
        /**
         * The audio host URL of the session
         */
        this._audioHostURL = null;
        /**
         * The screen data URL of the session
         */
        this._screenDataURL = null;
        /**
         * The screen sharing URL of the session
         */
        this._screenSharingURL = null;
        /**
         * The screen viewing URL of the session
         */
        this._screenViewingURL = null;
        /**
         * The signaling URL of the session
         */
        this._signalingURL = null;
        /**
         * The TURN control URL of the session
         */
        this._turnControlURL = null;
        /**
         * Function to transform URLs. Use this to rewrite URLs to traverse proxies.
         * The default implementation returns the original URL unchanged.
         */
        this.urlRewriter = (url) => {
            return url;
        };
    }
    /**
     * Gets the audio host URL after applying the urlRewriter function.
     */
    get audioHostURL() {
        return this.urlRewriter(this._audioHostURL);
    }
    /**
     * Sets the raw audio host URL.
     */
    set audioHostURL(value) {
        this._audioHostURL = value;
    }
    /**
     * Gets the screen data URL after applying the urlRewriter function.
     */
    get screenDataURL() {
        return this.urlRewriter(this._screenDataURL);
    }
    /**
     * Sets the raw screen data URL.
     */
    set screenDataURL(value) {
        this._screenDataURL = value;
    }
    /**
     * Gets the screen sharing URL after applying the urlRewriter function.
     */
    get screenSharingURL() {
        return this.urlRewriter(this._screenSharingURL);
    }
    /**
     * Sets the raw screen sharing URL.
     */
    set screenSharingURL(value) {
        this._screenSharingURL = value;
    }
    /**
     * Gets the screen viewing URL after applying the urlRewriter function.
     */
    get screenViewingURL() {
        return this.urlRewriter(this._screenViewingURL);
    }
    /**
     * Sets the raw screen viewing URL.
     */
    set screenViewingURL(value) {
        this._screenViewingURL = value;
    }
    /**
     * Gets the signaling URL after applying the urlRewriter function.
     */
    get signalingURL() {
        return this.urlRewriter(this._signalingURL);
    }
    /**
     * Sets the raw signaling URL.
     */
    set signalingURL(value) {
        this._signalingURL = value;
    }
    /**
     * Gets the TURN control URL after applying the urlRewriter function.
     */
    get turnControlURL() {
        return this.urlRewriter(this._turnControlURL);
    }
    /**
     * Sets the raw TURN control URL.
     */
    set turnControlURL(value) {
        this._turnControlURL = value;
    }
}
exports.default = MeetingSessionURLs;
//# sourceMappingURL=MeetingSessionURLs.js.map