"use strict";
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
const DefaultDevicePixelRatioMonitor_1 = require("../devicepixelratiomonitor/DefaultDevicePixelRatioMonitor");
const DevicePixelRatioWindowSource_1 = require("../devicepixelratiosource/DevicePixelRatioWindowSource");
const Maybe_1 = require("../maybe/Maybe");
class DefaultVideoTileController {
    constructor(tileFactory, audioVideoController, logger) {
        this.tileFactory = tileFactory;
        this.audioVideoController = audioVideoController;
        this.logger = logger;
        this.tileMap = new Map();
        this.nextTileId = 1;
        this.currentLocalTile = null;
        this.currentPausedTilesByIds = new Set();
        this.devicePixelRatioMonitor = new DefaultDevicePixelRatioMonitor_1.default(new DevicePixelRatioWindowSource_1.default(), logger);
    }
    bindVideoElement(tileId, videoElement) {
        const tile = this.getVideoTile(tileId);
        if (tile === null) {
            this.logger.warn(`Ignoring video element binding for unknown tile id ${tileId}`);
            return;
        }
        tile.bindVideoElement(videoElement);
    }
    unbindVideoElement(tileId) {
        this.bindVideoElement(tileId, null);
    }
    startLocalVideoTile() {
        const tile = this.findOrCreateLocalVideoTile();
        this.currentLocalTile.stateRef().localTileStarted = true;
        this.audioVideoController.update();
        return tile.id();
    }
    stopLocalVideoTile() {
        if (!this.currentLocalTile) {
            return;
        }
        this.currentLocalTile.stateRef().localTileStarted = false;
        this.currentLocalTile.bindVideoStream(this.audioVideoController.configuration.credentials.attendeeId, true, null, null, null, null, this.audioVideoController.configuration.credentials.externalUserId);
        this.audioVideoController.update();
    }
    hasStartedLocalVideoTile() {
        return !!(this.currentLocalTile && this.currentLocalTile.stateRef().localTileStarted);
    }
    removeLocalVideoTile() {
        if (this.currentLocalTile) {
            this.removeVideoTile(this.currentLocalTile.id());
        }
    }
    getLocalVideoTile() {
        return this.currentLocalTile;
    }
    pauseVideoTile(tileId) {
        const tile = this.getVideoTile(tileId);
        if (tile) {
            if (!this.currentPausedTilesByIds.has(tileId)) {
                this.audioVideoController.pauseReceivingStream(tile.stateRef().streamId);
                this.currentPausedTilesByIds.add(tileId);
            }
            tile.pause();
        }
    }
    unpauseVideoTile(tileId) {
        const tile = this.getVideoTile(tileId);
        if (tile) {
            if (this.currentPausedTilesByIds.has(tileId)) {
                this.audioVideoController.resumeReceivingStream(tile.stateRef().streamId);
                this.currentPausedTilesByIds.delete(tileId);
            }
            tile.unpause();
        }
    }
    getVideoTile(tileId) {
        return this.tileMap.has(tileId) ? this.tileMap.get(tileId) : null;
    }
    getVideoTileArea(tile) {
        const state = tile.state();
        let tileHeight = 0;
        let tileWidth = 0;
        if (state.boundVideoElement) {
            tileHeight = state.boundVideoElement.clientHeight * state.devicePixelRatio;
            tileWidth = state.boundVideoElement.clientWidth * state.devicePixelRatio;
        }
        return tileHeight * tileWidth;
    }
    getAllRemoteVideoTiles() {
        const result = new Array();
        this.tileMap.forEach((tile, tileId) => {
            if (!this.currentLocalTile || tileId !== this.currentLocalTile.id()) {
                result.push(tile);
            }
        });
        return result;
    }
    getAllVideoTiles() {
        return Array.from(this.tileMap.values());
    }
    addVideoTile(localTile = false) {
        const tileId = this.nextTileId;
        this.nextTileId += 1;
        const tile = this.tileFactory.makeTile(tileId, localTile, this, this.devicePixelRatioMonitor);
        this.tileMap.set(tileId, tile);
        return tile;
    }
    removeVideoTile(tileId) {
        if (!this.tileMap.has(tileId)) {
            return;
        }
        const tile = this.tileMap.get(tileId);
        if (this.currentLocalTile === tile) {
            this.currentLocalTile = null;
        }
        tile.destroy();
        this.tileMap.delete(tileId);
        this.audioVideoController.forEachObserver((observer) => {
            Maybe_1.default.of(observer.videoTileWasRemoved).map(f => f.bind(observer)(tileId));
        });
    }
    removeVideoTilesByAttendeeId(attendeeId) {
        const tilesRemoved = [];
        for (const tile of this.getAllVideoTiles()) {
            const state = tile.state();
            if (state.boundAttendeeId === attendeeId) {
                this.removeVideoTile(state.tileId);
                tilesRemoved.push(state.tileId);
            }
        }
        return tilesRemoved;
    }
    removeAllVideoTiles() {
        const tileIds = Array.from(this.tileMap.keys());
        for (const tileId of tileIds) {
            this.removeVideoTile(tileId);
        }
    }
    sendTileStateUpdate(tileState) {
        this.audioVideoController.forEachObserver((observer) => {
            Maybe_1.default.of(observer.videoTileDidUpdate).map(f => f.bind(observer)(tileState));
        });
    }
    haveVideoTilesWithStreams() {
        for (const tile of this.getAllVideoTiles()) {
            if (tile.state().boundVideoStream) {
                return true;
            }
        }
        return false;
    }
    haveVideoTileForAttendeeId(attendeeId) {
        for (const tile of this.getAllVideoTiles()) {
            const state = tile.state();
            if (state.boundAttendeeId === attendeeId) {
                return true;
            }
        }
        return false;
    }
    captureVideoTile(tileId) {
        const tile = this.getVideoTile(tileId);
        if (!tile) {
            return null;
        }
        return tile.capture();
    }
    findOrCreateLocalVideoTile() {
        if (this.currentLocalTile) {
            return this.currentLocalTile;
        }
        this.currentLocalTile = this.addVideoTile(true);
        this.currentLocalTile.bindVideoStream(this.audioVideoController.configuration.credentials.attendeeId, true, null, null, null, null, this.audioVideoController.configuration.credentials.externalUserId);
        return this.currentLocalTile;
    }
}
exports.default = DefaultVideoTileController;
//# sourceMappingURL=DefaultVideoTileController.js.map