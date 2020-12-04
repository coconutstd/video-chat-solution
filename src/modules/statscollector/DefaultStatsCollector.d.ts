import AudioVideoController from '../audiovideocontroller/AudioVideoController';
import BrowserBehavior from '../browserbehavior/BrowserBehavior';
import DefaultClientMetricReport from '../clientmetricreport/DefaultClientMetricReport';
import Logger from '../logger/Logger';
import MeetingSessionLifecycleEvent from '../meetingsession/MeetingSessionLifecycleEvent';
import MeetingSessionLifecycleEventCondition from '../meetingsession/MeetingSessionLifecycleEventCondition';
import MeetingSessionStatus from '../meetingsession/MeetingSessionStatus';
import SignalingClient from '../signalingclient/SignalingClient';
import VideoStreamIndex from '../videostreamindex/VideoStreamIndex';
import AudioLogEvent from './AudioLogEvent';
import StatsCollector from './StatsCollector';
import VideoLogEvent from './VideoLogEvent';
declare type RawMetricReport = any;
export default class DefaultStatsCollector implements StatsCollector {
    private audioVideoController;
    private logger;
    private browserBehavior;
    private readonly interval;
    private static readonly INTERVAL_MS;
    private static readonly FIREFOX_UPDATED_GET_STATS_VERSION;
    private static readonly CLIENT_TYPE;
    private intervalScheduler;
    private signalingClient;
    private videoStreamIndex;
    private clientMetricReport;
    constructor(audioVideoController: AudioVideoController, logger: Logger, browserBehavior: BrowserBehavior, interval?: number);
    toAttribute(str: string): string;
    private toSuffix;
    metricsAddTime: (_name: string, _duration: number, _attributes?: {
        [id: string]: string;
    }) => void;
    metricsLogEvent: (_name: string, _attributes: {
        [id: string]: string;
    }) => void;
    logLatency(eventName: string, timeMs: number, attributes?: {
        [id: string]: string;
    }): void;
    logStateTimeout(stateName: string, attributes?: {
        [id: string]: string;
    }): void;
    logAudioEvent(eventName: AudioLogEvent, attributes?: {
        [id: string]: string;
    }): void;
    logVideoEvent(eventName: VideoLogEvent, attributes?: {
        [id: string]: string;
    }): void;
    private logEventTime;
    logMeetingSessionStatus(status: MeetingSessionStatus): void;
    logLifecycleEvent(lifecycleEvent: MeetingSessionLifecycleEvent, condition: MeetingSessionLifecycleEventCondition): void;
    private logEvent;
    /**
     * WEBRTC METRICS COLLECTION.
     */
    start(signalingClient: SignalingClient, videoStreamIndex: VideoStreamIndex, clientMetricReport?: DefaultClientMetricReport): boolean;
    stop(): void;
    /**
     * Convert raw metrics to client metric report.
     */
    private updateMetricValues;
    private processRawMetricReports;
    /**
     * Protobuf packaging.
     */
    private addMetricFrame;
    private addGlobalMetricsToProtobuf;
    private addStreamMetricsToProtobuf;
    private makeClientMetricProtobuf;
    private sendClientMetricProtobuf;
    /**
     * Helper functions.
     */
    private isStreamRawMetricReport;
    private getMediaType;
    private getDirectionType;
    /**
     * Metric report filter.
     */
    isValidChromeRawMetric(rawMetricReport: RawMetricReport): boolean;
    isValidStandardRawMetric(rawMetricReport: RawMetricReport): boolean;
    isValidSsrc(rawMetricReport: RawMetricReport): boolean;
    isValidRawMetricReport(rawMetricReport: RawMetricReport): boolean;
    filterRawMetricReports(rawMetricReports: RawMetricReport[]): RawMetricReport[];
    private handleRawMetricReports;
    /**
     * Get raw webrtc metrics.
     */
    private getStatsWrapper;
    private compareMajorVersion;
}
export {};
