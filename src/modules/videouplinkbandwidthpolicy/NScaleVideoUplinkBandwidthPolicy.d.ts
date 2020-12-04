import DefaultVideoAndEncodeParameter from '../videocaptureandencodeparameter/DefaultVideoCaptureAndEncodeParameter';
import VideoStreamIndex from '../videostreamindex/VideoStreamIndex';
import ConnectionMetrics from './ConnectionMetrics';
import VideoUplinkBandwidthPolicy from './VideoUplinkBandwidthPolicy';
/** NScaleVideoUplinkBandwidthPolicy implements capture and encode
 *  parameters that are nearly equivalent to those chosen by the
 *  traditional native clients, except for a modification to
 *  maxBandwidthKbps described below. */
export default class NScaleVideoUplinkBandwidthPolicy implements VideoUplinkBandwidthPolicy {
    private selfAttendeeId;
    private numParticipants;
    private optimalParameters;
    private parametersInEffect;
    private idealMaxBandwidthKbps;
    private hasBandwidthPriority;
    constructor(selfAttendeeId: string);
    updateConnectionMetric(_metrics: ConnectionMetrics): void;
    chooseMediaTrackConstraints(): MediaTrackConstraints;
    chooseEncodingParameters(): Map<string, RTCRtpEncodingParameters>;
    updateIndex(videoIndex: VideoStreamIndex): void;
    wantsResubscribe(): boolean;
    chooseCaptureAndEncodeParameters(): DefaultVideoAndEncodeParameter;
    private captureWidth;
    private captureHeight;
    private captureFrameRate;
    maxBandwidthKbps(): number;
    setIdealMaxBandwidthKbps(idealMaxBandwidthKbps: number): void;
    setHasBandwidthPriority(hasBandwidthPriority: boolean): void;
}
