export default class GlobalMetricReport {
    previousMetrics: {
        [id: string]: number;
    };
    currentMetrics: {
        [id: string]: number;
    };
}
