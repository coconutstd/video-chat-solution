import VideoCaptureAndEncodeParameter from '../videocaptureandencodeparameter/VideoCaptureAndEncodeParameter';
import VideoStreamIndex from '../videostreamindex/VideoStreamIndex';
import VideoUplinkBandwidthPolicy from '../videouplinkbandwidthpolicy/VideoUplinkBandwidthPolicy';
import ConnectionMetrics from './ConnectionMetrics';
export default class NoVideoUplinkBandwidthPolicy implements VideoUplinkBandwidthPolicy {
    constructor();
    updateConnectionMetric(_metrics: ConnectionMetrics): void;
    chooseMediaTrackConstraints(): MediaTrackConstraints;
    chooseEncodingParameters(): Map<string, RTCRtpEncodingParameters>;
    updateIndex(_videoIndex: VideoStreamIndex): void;
    wantsResubscribe(): boolean;
    chooseCaptureAndEncodeParameters(): VideoCaptureAndEncodeParameter;
    maxBandwidthKbps(): number;
    setIdealMaxBandwidthKbps(_idealMaxBandwidthKbps: number): void;
    setHasBandwidthPriority(_hasBandwidthPriority: boolean): void;
}
