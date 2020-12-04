"use strict";
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
const SignalingProtocol_js_1 = require("../signalingprotocol/SignalingProtocol.js");
const DefaultVideoStreamIdSet_1 = require("../videostreamidset/DefaultVideoStreamIdSet");
const VideoStreamDescription_1 = require("./VideoStreamDescription");
/**
 * [[DefaultVideoStreamIndex]] implements [[VideoStreamIndex]] to facilitate video stream subscription
 * and includes query functions for stream id and attendee id.
 */
class DefaultVideoStreamIndex {
    constructor(logger) {
        this.logger = logger;
        this.currentIndex = null;
        this.indexForSubscribe = null;
        this.currentSubscribeAck = null;
        // These are based on the index at the time of the last Subscribe Ack
        this.subscribeTrackToStreamMap = null;
        this.subscribeStreamToAttendeeMap = null;
        this.subscribeStreamToExternalUserIdMap = null;
        this.subscribeSsrcToStreamMap = null;
        // These are based on the most up to date index
        this.streamToAttendeeMap = null;
        this.streamToExternalUserIdMap = null;
        this.videoStreamDescription = new VideoStreamDescription_1.default();
        this.videoStreamDescription.trackLabel = 'AmazonChimeExpressVideo';
        this.videoStreamDescription.streamId = 2;
        this.videoStreamDescription.groupId = 2;
    }
    localStreamDescriptions() {
        // localStreamDescriptions are used to construct IndexFrame
        // old behavior for single video is to have streamId and groupId trackLabel fixed as the follows
        return [this.videoStreamDescription.clone()];
    }
    remoteStreamDescriptions() {
        if (!this.currentIndex || !this.currentIndex.sources) {
            return [];
        }
        const streamInfos = [];
        this.currentIndex.sources.forEach(source => {
            const description = new VideoStreamDescription_1.default();
            description.attendeeId = source.attendeeId;
            description.groupId = source.groupId;
            description.streamId = source.streamId;
            description.maxBitrateKbps = source.maxBitrateKbps;
            description.avgBitrateKbps = Math.floor(source.avgBitrateBps / 1000);
            streamInfos.push(description);
        });
        return streamInfos;
    }
    integrateUplinkPolicyDecision(param) {
        if (!!param && param.length) {
            const encodingParam = param[0];
            this.videoStreamDescription.maxBitrateKbps = encodingParam.maxBitrate / 1000;
            this.videoStreamDescription.maxFrameRate = encodingParam.maxFramerate;
        }
    }
    integrateIndexFrame(indexFrame) {
        this.currentIndex = indexFrame;
        this.streamToAttendeeMap = null;
        this.streamToExternalUserIdMap = null;
    }
    subscribeFrameSent() {
        // This is called just as a Subscribe is being sent.  Save corresponding Index
        this.indexForSubscribe = this.currentIndex;
    }
    integrateSubscribeAckFrame(subscribeAck) {
        this.currentSubscribeAck = subscribeAck;
        // These are valid until the next Subscribe Ack even if the index is updated
        this.subscribeTrackToStreamMap = this.buildTrackToStreamMap(this.currentSubscribeAck);
        this.subscribeSsrcToStreamMap = this.buildSSRCToStreamMap(this.currentSubscribeAck);
        this.subscribeStreamToAttendeeMap = this.buildStreamToAttendeeMap(this.indexForSubscribe);
        this.subscribeStreamToExternalUserIdMap = this.buildStreamExternalUserIdMap(this.indexForSubscribe);
    }
    integrateBitratesFrame(bitrates) {
        if (this.currentIndex) {
            for (const bitrate of bitrates.bitrates) {
                const source = this.currentIndex.sources.find(source => source.streamId === bitrate.sourceStreamId);
                if (source !== undefined) {
                    source.avgBitrateBps = bitrate.avgBitrateBps;
                }
            }
        }
    }
    allStreams() {
        const set = new DefaultVideoStreamIdSet_1.default();
        if (this.currentIndex) {
            for (const source of this.currentIndex.sources) {
                set.add(source.streamId);
            }
        }
        return set;
    }
    allVideoSendingSourcesExcludingSelf(selfAttendeeId) {
        const videoSources = [];
        const attendeeSet = new Set();
        if (this.currentIndex) {
            if (this.currentIndex.sources && this.currentIndex.sources.length) {
                for (const stream of this.currentIndex.sources) {
                    const { attendeeId, externalUserId, mediaType } = stream;
                    if (attendeeId !== selfAttendeeId && mediaType === SignalingProtocol_js_1.SdkStreamMediaType.VIDEO) {
                        if (!attendeeSet.has(attendeeId)) {
                            videoSources.push({ attendee: { attendeeId, externalUserId } });
                            attendeeSet.add(attendeeId);
                        }
                    }
                }
            }
        }
        return videoSources;
    }
    streamSelectionUnderBandwidthConstraint(selfAttendeeId, largeTileAttendeeIds, smallTileAttendeeIds, bandwidthKbps) {
        const newAttendees = new Set();
        if (this.currentIndex) {
            for (const stream of this.currentIndex.sources) {
                if (stream.attendeeId === selfAttendeeId || stream.mediaType !== SignalingProtocol_js_1.SdkStreamMediaType.VIDEO) {
                    continue;
                }
                if (!largeTileAttendeeIds.has(stream.attendeeId) &&
                    !smallTileAttendeeIds.has(stream.attendeeId)) {
                    newAttendees.add(stream.attendeeId);
                }
            }
        }
        const attendeeToStreamDescriptorMap = this.buildAttendeeToSortedStreamDescriptorMapExcludingSelf(selfAttendeeId);
        const selectionMap = new Map();
        let usage = 0;
        attendeeToStreamDescriptorMap.forEach((streams, attendeeId) => {
            selectionMap.set(attendeeId, streams[0]);
            usage += streams[0].maxBitrateKbps;
        });
        usage = this.trySelectHighBitrateForAttendees(attendeeToStreamDescriptorMap, largeTileAttendeeIds, usage, bandwidthKbps, selectionMap);
        this.trySelectHighBitrateForAttendees(attendeeToStreamDescriptorMap, newAttendees, usage, bandwidthKbps, selectionMap);
        const streamSelectionSet = new DefaultVideoStreamIdSet_1.default();
        for (const source of selectionMap.values()) {
            streamSelectionSet.add(source.streamId);
        }
        return streamSelectionSet;
    }
    highestQualityStreamFromEachGroupExcludingSelf(selfAttendeeId) {
        const set = new DefaultVideoStreamIdSet_1.default();
        if (this.currentIndex) {
            const maxes = new Map();
            for (const source of this.currentIndex.sources) {
                if (source.attendeeId === selfAttendeeId || source.mediaType !== SignalingProtocol_js_1.SdkStreamMediaType.VIDEO) {
                    continue;
                }
                if (!maxes.has(source.groupId) ||
                    source.maxBitrateKbps > maxes.get(source.groupId).maxBitrateKbps) {
                    maxes.set(source.groupId, source);
                }
            }
            for (const source of maxes.values()) {
                set.add(source.streamId);
            }
        }
        return set;
    }
    numberOfVideoPublishingParticipantsExcludingSelf(selfAttendeeId) {
        return this.highestQualityStreamFromEachGroupExcludingSelf(selfAttendeeId).array().length;
    }
    numberOfParticipants() {
        if (!!this.currentIndex.numParticipants) {
            return this.currentIndex.numParticipants;
        }
        return -1;
    }
    attendeeIdForTrack(trackId) {
        const streamId = this.streamIdForTrack(trackId);
        if (streamId === undefined || !this.subscribeStreamToAttendeeMap) {
            this.logger.warn(`no attendee found for track ${trackId}`);
            return '';
        }
        const attendeeId = this.subscribeStreamToAttendeeMap.get(streamId);
        if (!attendeeId) {
            this.logger.info(`track ${trackId} (stream ${streamId}) does not correspond to a known attendee`);
            return '';
        }
        return attendeeId;
    }
    externalUserIdForTrack(trackId) {
        const streamId = this.streamIdForTrack(trackId);
        if (streamId === undefined || !this.subscribeStreamToExternalUserIdMap) {
            this.logger.warn(`no external user id found for track ${trackId}`);
            return '';
        }
        const externalUserId = this.subscribeStreamToExternalUserIdMap.get(streamId);
        if (!externalUserId) {
            this.logger.info(`track ${trackId} (stream ${streamId}) does not correspond to a known externalUserId`);
            return '';
        }
        return externalUserId;
    }
    attendeeIdForStreamId(streamId) {
        if (!this.streamToAttendeeMap) {
            if (this.currentIndex) {
                this.streamToAttendeeMap = this.buildStreamToAttendeeMap(this.currentIndex);
            }
            else {
                return '';
            }
        }
        const attendeeId = this.streamToAttendeeMap.get(streamId);
        if (!attendeeId) {
            this.logger.info(`stream ${streamId}) does not correspond to a known attendee`);
            return '';
        }
        return attendeeId;
    }
    groupIdForStreamId(streamId) {
        for (const source of this.currentIndex.sources) {
            if (source.streamId === streamId) {
                return source.groupId;
            }
        }
        // If wasn't found in current index, then it could be in index used in last subscribe
        if (!!this.indexForSubscribe) {
            for (const source of this.indexForSubscribe.sources) {
                if (source.streamId === streamId) {
                    return source.groupId;
                }
            }
        }
        return undefined;
    }
    StreamIdsInSameGroup(streamId1, streamId2) {
        if (this.groupIdForStreamId(streamId1) === this.groupIdForStreamId(streamId2)) {
            return true;
        }
        return false;
    }
    streamIdForTrack(trackId) {
        if (!this.subscribeTrackToStreamMap) {
            return undefined;
        }
        return this.subscribeTrackToStreamMap.get(trackId);
    }
    streamIdForSSRC(ssrcId) {
        if (!this.subscribeSsrcToStreamMap) {
            return undefined;
        }
        return this.subscribeSsrcToStreamMap.get(ssrcId);
    }
    streamsPausedAtSource() {
        const paused = new DefaultVideoStreamIdSet_1.default();
        if (this.currentIndex) {
            for (const streamId of this.currentIndex.pausedAtSourceIds) {
                paused.add(streamId);
            }
        }
        return paused;
    }
    buildTrackToStreamMap(subscribeAck) {
        const map = new Map();
        this.logger.debug(() => `trackMap ${JSON.stringify(subscribeAck.tracks)}`);
        for (const trackMapping of subscribeAck.tracks) {
            if (trackMapping.trackLabel.length > 0 && trackMapping.streamId > 0) {
                map.set(trackMapping.trackLabel, trackMapping.streamId);
            }
        }
        return map;
    }
    buildSSRCToStreamMap(subscribeAck) {
        const map = new Map();
        this.logger.debug(() => `ssrcMap ${JSON.stringify(subscribeAck.tracks)}`);
        for (const trackMapping of subscribeAck.tracks) {
            if (trackMapping.trackLabel.length > 0 && trackMapping.streamId > 0) {
                map.set(trackMapping.ssrc, trackMapping.streamId);
            }
        }
        return map;
    }
    buildStreamToAttendeeMap(indexFrame) {
        const map = new Map();
        if (indexFrame) {
            for (const source of indexFrame.sources) {
                map.set(source.streamId, source.attendeeId);
            }
        }
        return map;
    }
    buildStreamExternalUserIdMap(indexFrame) {
        const map = new Map();
        if (indexFrame) {
            for (const source of indexFrame.sources) {
                if (!!source.externalUserId) {
                    map.set(source.streamId, source.externalUserId);
                }
            }
        }
        return map;
    }
    trySelectHighBitrateForAttendees(attendeeToStreamDescriptorMap, highAttendees, currentUsage, bandwidthKbps, currentSelectionRef) {
        for (const attendeeId of highAttendees) {
            if (currentUsage >= bandwidthKbps) {
                break;
            }
            if (attendeeToStreamDescriptorMap.has(attendeeId)) {
                const streams = attendeeToStreamDescriptorMap.get(attendeeId);
                for (const l of streams.reverse()) {
                    if (currentUsage - currentSelectionRef.get(attendeeId).maxBitrateKbps + l.maxBitrateKbps <
                        bandwidthKbps) {
                        currentUsage =
                            currentUsage - currentSelectionRef.get(attendeeId).maxBitrateKbps + l.maxBitrateKbps;
                        currentSelectionRef.set(attendeeId, l);
                        break;
                    }
                }
            }
        }
        return currentUsage;
    }
    buildAttendeeToSortedStreamDescriptorMapExcludingSelf(selfAttendeeId) {
        const attendeeToStreamDescriptorMap = new Map();
        if (this.currentIndex) {
            for (const source of this.currentIndex.sources) {
                if (source.attendeeId === selfAttendeeId || source.mediaType !== SignalingProtocol_js_1.SdkStreamMediaType.VIDEO) {
                    continue;
                }
                if (attendeeToStreamDescriptorMap.has(source.attendeeId)) {
                    attendeeToStreamDescriptorMap.get(source.attendeeId).push(source);
                }
                else {
                    attendeeToStreamDescriptorMap.set(source.attendeeId, [source]);
                }
            }
        }
        attendeeToStreamDescriptorMap.forEach((streams, _attendeeId) => {
            streams.sort((stream1, stream2) => {
                if (stream1.maxBitrateKbps > stream2.maxBitrateKbps) {
                    return 1;
                }
                else if (stream1.maxBitrateKbps < stream2.maxBitrateKbps) {
                    return -1;
                }
                else {
                    return 0;
                }
            });
        });
        return attendeeToStreamDescriptorMap;
    }
}
exports.default = DefaultVideoStreamIndex;
//# sourceMappingURL=DefaultVideoStreamIndex.js.map