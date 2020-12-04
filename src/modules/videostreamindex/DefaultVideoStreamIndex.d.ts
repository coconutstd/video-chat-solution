import Logger from '../logger/Logger';
import { ISdkBitrateFrame, SdkIndexFrame, SdkSubscribeAckFrame } from '../signalingprotocol/SignalingProtocol.js';
import VideoSource from '../videosource/VideoSource';
import DefaultVideoStreamIdSet from '../videostreamidset/DefaultVideoStreamIdSet';
import VideoStreamIndex from '../videostreamindex/VideoStreamIndex';
import VideoStreamDescription from './VideoStreamDescription';
/**
 * [[DefaultVideoStreamIndex]] implements [[VideoStreamIndex]] to facilitate video stream subscription
 * and includes query functions for stream id and attendee id.
 */
export default class DefaultVideoStreamIndex implements VideoStreamIndex {
    protected logger: Logger;
    protected currentIndex: SdkIndexFrame | null;
    protected indexForSubscribe: SdkIndexFrame | null;
    protected currentSubscribeAck: SdkSubscribeAckFrame | null;
    protected subscribeTrackToStreamMap: Map<string, number> | null;
    protected subscribeStreamToAttendeeMap: Map<number, string> | null;
    protected subscribeStreamToExternalUserIdMap: Map<number, string> | null;
    protected subscribeSsrcToStreamMap: Map<number, number> | null;
    protected streamToAttendeeMap: Map<number, string> | null;
    protected streamToExternalUserIdMap: Map<number, string> | null;
    private videoStreamDescription;
    constructor(logger: Logger);
    localStreamDescriptions(): VideoStreamDescription[];
    remoteStreamDescriptions(): VideoStreamDescription[];
    integrateUplinkPolicyDecision(param: RTCRtpEncodingParameters[]): void;
    integrateIndexFrame(indexFrame: SdkIndexFrame): void;
    subscribeFrameSent(): void;
    integrateSubscribeAckFrame(subscribeAck: SdkSubscribeAckFrame): void;
    integrateBitratesFrame(bitrates: ISdkBitrateFrame): void;
    allStreams(): DefaultVideoStreamIdSet;
    allVideoSendingSourcesExcludingSelf(selfAttendeeId: string): VideoSource[];
    streamSelectionUnderBandwidthConstraint(selfAttendeeId: string, largeTileAttendeeIds: Set<string>, smallTileAttendeeIds: Set<string>, bandwidthKbps: number): DefaultVideoStreamIdSet;
    highestQualityStreamFromEachGroupExcludingSelf(selfAttendeeId: string): DefaultVideoStreamIdSet;
    numberOfVideoPublishingParticipantsExcludingSelf(selfAttendeeId: string): number;
    numberOfParticipants(): number;
    attendeeIdForTrack(trackId: string): string;
    externalUserIdForTrack(trackId: string): string;
    attendeeIdForStreamId(streamId: number): string;
    groupIdForStreamId(streamId: number): number;
    StreamIdsInSameGroup(streamId1: number, streamId2: number): boolean;
    streamIdForTrack(trackId: string): number;
    streamIdForSSRC(ssrcId: number): number;
    streamsPausedAtSource(): DefaultVideoStreamIdSet;
    private buildTrackToStreamMap;
    private buildSSRCToStreamMap;
    private buildStreamToAttendeeMap;
    private buildStreamExternalUserIdMap;
    private trySelectHighBitrateForAttendees;
    private buildAttendeeToSortedStreamDescriptorMapExcludingSelf;
}
