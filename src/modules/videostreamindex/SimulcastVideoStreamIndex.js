"use strict";
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
const SignalingProtocol_js_1 = require("../signalingprotocol/SignalingProtocol.js");
const DefaultVideoStreamIndex_1 = require("./DefaultVideoStreamIndex");
const VideoStreamDescription_1 = require("./VideoStreamDescription");
/**
 * [[SimulcastTransceiverController]] implements [[VideoStreamIndex]] to facilitate video stream
 * subscription and includes query functions for stream id and attendee id.
 */
class SimulcastVideoStreamIndex extends DefaultVideoStreamIndex_1.default {
    constructor(logger) {
        super(logger);
        this.streamIdToBitrateKbpsMap = new Map();
        this._localStreamInfos = [];
        this._lastBitRateMsgTime = Date.now();
    }
    localStreamDescriptions() {
        const clonedDescriptions = [];
        this._localStreamInfos.forEach(desc => {
            clonedDescriptions.push(desc.clone());
        });
        return clonedDescriptions;
    }
    integrateUplinkPolicyDecision(encodingParams) {
        // Reuse local streams (that might already have stream IDs allocated) until
        // there are no more and then add as many new local streams as needed
        let hasStreamsToReuse = true;
        let localStreamIndex = 0;
        for (let i = 0; i < encodingParams.length; i++) {
            const targetMaxBitrateKbps = encodingParams[i].maxBitrate / 1000;
            const targetMaxFrameRate = encodingParams[i].maxFramerate;
            if (!hasStreamsToReuse || i === this._localStreamInfos.length) {
                hasStreamsToReuse = false;
                const newInfo = new VideoStreamDescription_1.default();
                newInfo.maxBitrateKbps = targetMaxBitrateKbps;
                newInfo.maxFrameRate = targetMaxFrameRate;
                newInfo.disabledByUplinkPolicy = targetMaxBitrateKbps === 0 ? true : false;
                if (targetMaxBitrateKbps !== 0) {
                    newInfo.timeEnabled = Date.now();
                }
                this._localStreamInfos.push(newInfo);
                localStreamIndex++;
                continue;
            }
            if (this._localStreamInfos[localStreamIndex].maxBitrateKbps === 0 &&
                targetMaxBitrateKbps > 0) {
                this._localStreamInfos[localStreamIndex].timeEnabled = Date.now();
            }
            this._localStreamInfos[localStreamIndex].maxBitrateKbps = targetMaxBitrateKbps;
            this._localStreamInfos[localStreamIndex].maxFrameRate = targetMaxFrameRate;
            this._localStreamInfos[localStreamIndex].disabledByUplinkPolicy =
                targetMaxBitrateKbps === 0 ? true : false;
            if (this._localStreamInfos[localStreamIndex].disabledByUplinkPolicy === true) {
                this._localStreamInfos[localStreamIndex].disabledByWebRTC = false;
            }
            localStreamIndex++;
        }
        if (hasStreamsToReuse) {
            // splice is zero-based, remove stream starting from localStreamIndex
            this._localStreamInfos.splice(localStreamIndex);
        }
    }
    integrateBitratesFrame(bitrateFrame) {
        super.integrateBitratesFrame(bitrateFrame);
        const stillSending = new Set();
        const existingSet = new Set(this.streamIdToBitrateKbpsMap.keys());
        for (const bitrateMsg of bitrateFrame.bitrates) {
            stillSending.add(bitrateMsg.sourceStreamId);
            this.streamIdToBitrateKbpsMap.set(bitrateMsg.sourceStreamId, Math.trunc(bitrateMsg.avgBitrateBps / 1000));
        }
        for (const id of existingSet) {
            if (!stillSending.has(id)) {
                const avgBitrateBps = this.streamIdToBitrateKbpsMap.get(id);
                if (avgBitrateBps === SimulcastVideoStreamIndex.UNSEEN_STREAM_BITRATE) {
                    this.streamIdToBitrateKbpsMap.set(id, SimulcastVideoStreamIndex.RECENTLY_INACTIVE_STREAM_BITRATE);
                }
                else {
                    this.streamIdToBitrateKbpsMap.set(id, SimulcastVideoStreamIndex.NOT_SENDING_STREAM_BITRATE);
                }
            }
        }
        for (let i = 0; i < this._localStreamInfos.length; i++) {
            this._localStreamInfos[i].disabledByWebRTC = false;
            const streamId = this._localStreamInfos[i].streamId;
            if (this._localStreamInfos[i].disabledByUplinkPolicy) {
                continue;
            }
            if (this.streamIdToBitrateKbpsMap.has(streamId)) {
                const avgBitrateKbps = this.streamIdToBitrateKbpsMap.get(streamId);
                if (avgBitrateKbps === SimulcastVideoStreamIndex.NOT_SENDING_STREAM_BITRATE &&
                    this._lastBitRateMsgTime - this._localStreamInfos[i].timeEnabled >
                        SimulcastVideoStreamIndex.BitratesMsgFrequencyMs) {
                    this._localStreamInfos[i].disabledByWebRTC = true;
                }
            }
            else {
                // Do not flag as disabled if it was recently enabled
                if (this._lastBitRateMsgTime - this._localStreamInfos[i].timeEnabled >
                    SimulcastVideoStreamIndex.BitratesMsgFrequencyMs) {
                    this._localStreamInfos[i].disabledByWebRTC = true;
                }
            }
        }
        this._lastBitRateMsgTime = Date.now();
        this.logLocalStreamDescriptions();
    }
    logLocalStreamDescriptions() {
        let msg = '';
        for (const desc of this._localStreamInfos) {
            msg += `streamId=${desc.streamId} maxBitrate=${desc.maxBitrateKbps} disabledByWebRTC=${desc.disabledByWebRTC} disabledByUplink=${desc.disabledByUplinkPolicy}\n`;
        }
        this.logger.debug(() => {
            return msg;
        });
    }
    integrateIndexFrame(indexFrame) {
        super.integrateIndexFrame(indexFrame);
        const newIndexStreamIdSet = new Set();
        const existingSet = new Set(this.streamIdToBitrateKbpsMap.keys());
        for (const stream of this.currentIndex.sources) {
            if (stream.mediaType !== SignalingProtocol_js_1.SdkStreamMediaType.VIDEO) {
                continue;
            }
            newIndexStreamIdSet.add(stream.streamId);
            if (!this.streamIdToBitrateKbpsMap.has(stream.streamId)) {
                this.streamIdToBitrateKbpsMap.set(stream.streamId, SimulcastVideoStreamIndex.UNSEEN_STREAM_BITRATE);
            }
        }
        for (const id of existingSet) {
            if (!newIndexStreamIdSet.has(id)) {
                this.streamIdToBitrateKbpsMap.delete(id);
            }
        }
    }
    integrateSubscribeAckFrame(subscribeAck) {
        super.integrateSubscribeAckFrame(subscribeAck);
        if (!subscribeAck.allocations || subscribeAck.allocations === undefined) {
            return;
        }
        let localStreamStartIndex = 0;
        for (const allocation of subscribeAck.allocations) {
            // track label is what we offered to the server
            if (this._localStreamInfos.length < localStreamStartIndex + 1) {
                this.logger.info('simulcast: allocation has more than number of local streams');
                break;
            }
            this._localStreamInfos[localStreamStartIndex].groupId = allocation.groupId;
            this._localStreamInfos[localStreamStartIndex].streamId = allocation.streamId;
            if (!this.streamIdToBitrateKbpsMap.has(allocation.streamId)) {
                this.streamIdToBitrateKbpsMap.set(allocation.streamId, SimulcastVideoStreamIndex.UNSEEN_STREAM_BITRATE);
            }
            localStreamStartIndex++;
        }
    }
}
exports.default = SimulcastVideoStreamIndex;
// First time when the bitrate of a stream id is missing from bitrate message, mark it as UNSEEN
SimulcastVideoStreamIndex.UNSEEN_STREAM_BITRATE = -2;
// Second time when the bitrate is missing, mark it as recently inactive
SimulcastVideoStreamIndex.RECENTLY_INACTIVE_STREAM_BITRATE = -1;
// Third time when bitrate is missing, mark it as not sending
SimulcastVideoStreamIndex.NOT_SENDING_STREAM_BITRATE = 0;
SimulcastVideoStreamIndex.BitratesMsgFrequencyMs = 4000;
//# sourceMappingURL=SimulcastVideoStreamIndex.js.map