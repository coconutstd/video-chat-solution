import ClientMetricReport from '../clientmetricreport/DefaultClientMetricReport';
import Logger from '../logger/Logger';
import VideoStreamIdSet from '../videostreamidset/VideoStreamIdSet';
import VideoStreamDescription from '../videostreamindex/VideoStreamDescription';
import VideoStreamIndex from '../videostreamindex/VideoStreamIndex';
import VideoTileController from '../videotilecontroller/VideoTileController';
import VideoDownlinkBandwidthPolicy from './VideoDownlinkBandwidthPolicy';
declare const enum RateProbeState {
    kNotProbing = "Not Probing",
    kProbePending = "Probe Pending",
    kProbing = "Probing"
}
export default class VideoAdaptiveProbePolicy implements VideoDownlinkBandwidthPolicy {
    private logger;
    private tileController;
    private static readonly DEFAULT_BANDWIDTH_KBPS;
    private static readonly STARTUP_PERIOD_MS;
    private static readonly LARGE_RATE_CHANGE_TRIGGER_PERCENT;
    private static readonly TARGET_RATE_CHANGE_TRIGGER_PERCENT;
    private static readonly LOW_BITRATE_THRESHOLD_KBPS;
    private static readonly MIN_TIME_BETWEEN_PROBE;
    private static readonly MIN_TIME_BETWEEN_SUBSCRIBE;
    private static readonly MAX_HOLD_MS_BEFORE_PROBE;
    private static readonly MAX_ALLOWED_PROBE_TIME_MS;
    private logCount;
    private optimalReceiveSet;
    private subscribedReceiveSet;
    private preProbeReceiveSet;
    private downlinkStats;
    private prevDownlinkStats;
    private prevRemoteInfos;
    private videoIndex;
    private rateProbeState;
    private startupPeriod;
    private usingPrevTargetRate;
    private prevTargetRateKbps;
    private lastUpgradeRateKbps;
    private timeFirstEstimate;
    private timeLastSubscribe;
    private timeBeforeAllowSubscribeMs;
    private timeProbePendingStart;
    private timeBeforeAllowProbeMs;
    private timeLastProbe;
    constructor(logger: Logger, tileController: VideoTileController);
    reset(): void;
    updateIndex(videoIndex: VideoStreamIndex): void;
    updateMetrics(clientMetricReport: ClientMetricReport): void;
    wantsResubscribe(): boolean;
    chooseSubscriptions(): VideoStreamIdSet;
    private calculateOptimalReceiveSet;
    determineTargetRate(remoteInfos: VideoStreamDescription[]): number;
    setProbeState(newState: RateProbeState): boolean;
    private upgradeToStream;
    private handleProbe;
    private maybeOverrideOrProbe;
    private calculateSubscribeRate;
    private handlePausedStreams;
    private chooseContent;
    private availStreamsSameAsLast;
    private chosenStreamsSameAsLast;
    private policyStateLogStr;
}
export {};
