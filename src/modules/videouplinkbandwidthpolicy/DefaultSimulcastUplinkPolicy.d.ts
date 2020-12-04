import Logger from '../logger/Logger';
import SimulcastLayers from '../simulcastlayers/SimulcastLayers';
import DefaultVideoAndEncodeParameter from '../videocaptureandencodeparameter/DefaultVideoCaptureAndEncodeParameter';
import VideoStreamIndex from '../videostreamindex/VideoStreamIndex';
import ConnectionMetrics from './ConnectionMetrics';
import SimulcastUplinkObserver from './SimulcastUplinkObserver';
import SimulcastUplinkPolicy from './SimulcastUplinkPolicy';
declare const enum ActiveStreams {
    kHi = 0,
    kHiAndLow = 1,
    kMidAndLow = 2,
    kLow = 3
}
/**
 * [[DefaultSimulcastUplinkPolicy]] determines capture and encode
 *  parameters that reacts to estimated uplink bandwidth
 */
export default class DefaultSimulcastUplinkPolicy implements SimulcastUplinkPolicy {
    private selfAttendeeId;
    private logger;
    static readonly defaultUplinkBandwidthKbps: number;
    static readonly startupDurationMs: number;
    static readonly holdDownDurationMs: number;
    static readonly defaultMaxFrameRate = 15;
    static readonly kHiDisabledRate = 700;
    static readonly kMidDisabledRate = 240;
    private numSenders;
    private numParticipants;
    private optimalParameters;
    private parametersInEffect;
    private newQualityMap;
    private currentQualityMap;
    private newActiveStreams;
    private currentActiveStreams;
    private lastUplinkBandwidthKbps;
    private startTimeMs;
    private lastUpdatedMs;
    private videoIndex;
    private currLocalDescriptions;
    private nextLocalDescriptions;
    private activeStreamsToPublish;
    private observerQueue;
    constructor(selfAttendeeId: string, logger: Logger);
    updateConnectionMetric({ uplinkKbps }: ConnectionMetrics): void;
    private calculateEncodingParameters;
    chooseMediaTrackConstraints(): MediaTrackConstraints;
    chooseEncodingParameters(): Map<string, RTCRtpEncodingParameters>;
    updateIndex(videoIndex: VideoStreamIndex): void;
    wantsResubscribe(): boolean;
    private compareEncodingParameter;
    private encodingParametersEqual;
    chooseCaptureAndEncodeParameters(): DefaultVideoAndEncodeParameter;
    private captureWidth;
    private captureHeight;
    private captureFrameRate;
    maxBandwidthKbps(): number;
    setIdealMaxBandwidthKbps(_idealMaxBandwidthKbps: number): void;
    setHasBandwidthPriority(_hasBandwidthPriority: boolean): void;
    private fillEncodingParamWithBitrates;
    private getQualityMapString;
    getEncodingSimulcastLayer(activeStreams: ActiveStreams): SimulcastLayers;
    private publishEncodingSimulcastLayer;
    addObserver(observer: SimulcastUplinkObserver): void;
    removeObserver(observer: SimulcastUplinkObserver): void;
    forEachObserver(observerFunc: (observer: SimulcastUplinkObserver) => void): void;
}
export {};
