import Logger from '../logger/Logger';
import { SdkBitrateFrame, SdkIndexFrame, SdkSubscribeAckFrame } from '../signalingprotocol/SignalingProtocol.js';
import DefaultVideoStreamIndex from './DefaultVideoStreamIndex';
import VideoStreamDescription from './VideoStreamDescription';
/**
 * [[SimulcastTransceiverController]] implements [[VideoStreamIndex]] to facilitate video stream
 * subscription and includes query functions for stream id and attendee id.
 */
export default class SimulcastVideoStreamIndex extends DefaultVideoStreamIndex {
    private streamIdToBitrateKbpsMap;
    static readonly UNSEEN_STREAM_BITRATE = -2;
    static readonly RECENTLY_INACTIVE_STREAM_BITRATE = -1;
    static readonly NOT_SENDING_STREAM_BITRATE = 0;
    static readonly BitratesMsgFrequencyMs: number;
    private _localStreamInfos;
    private _lastBitRateMsgTime;
    constructor(logger: Logger);
    localStreamDescriptions(): VideoStreamDescription[];
    integrateUplinkPolicyDecision(encodingParams: RTCRtpEncodingParameters[]): void;
    integrateBitratesFrame(bitrateFrame: SdkBitrateFrame): void;
    private logLocalStreamDescriptions;
    integrateIndexFrame(indexFrame: SdkIndexFrame): void;
    integrateSubscribeAckFrame(subscribeAck: SdkSubscribeAckFrame): void;
}
