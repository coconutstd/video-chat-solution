declare type MetricsData = {
    [key: string]: number;
};
interface CurrentAndPreviousMetrics {
    current: MetricsData;
    previous: MetricsData;
}
declare enum StreamDirection {
    'Downstream' = "Downstream",
    'Upstream' = "Upstream"
}
declare type SSRCToMetricsData = {
    [key: string]: CurrentAndPreviousMetrics;
};
export default class WebRTCStatsCollector {
    static MAX_UPSTREAMS_COUNT: number;
    static MAX_DOWNSTREAMS_COUNT: number;
    static CLEANUP_INTERVAL: number;
    upstreamMetrics: SSRCToMetricsData;
    static upstreamMetricsKeyStatsToShow: {
        [key: string]: string;
    };
    downstreamTileIndexToTrackId: {
        [key: string]: string;
    };
    downstreamMetrics: {
        [key: string]: SSRCToMetricsData;
    };
    static downstreamMetricsKeyStatsToShow: {
        [key: string]: string;
    };
    cleanUpStaleUpstreamMetricsData: () => void;
    processWebRTCStatReportForTileIndex: (rtcStatsReport: RTCStatsReport, tileIndex: number) => void;
    resetStats: () => void;
    showUpstreamStats(tileIndex: number): void;
    showDownstreamStats(tileIndex: number): void;
    showStats: (tileIndex: number, streamDirection: StreamDirection, keyStatstoShow: {
        [key: string]: string;
    }, metricsData: SSRCToMetricsData) => void;
}
export {};
