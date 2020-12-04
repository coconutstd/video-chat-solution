import ClientMetricReport from '../clientmetricreport/ClientMetricReport';
import DefaultVideoStreamIdSet from '../videostreamidset/DefaultVideoStreamIdSet';
import DefaultVideoStreamIndex from '../videostreamindex/DefaultVideoStreamIndex';
import VideoDownlinkBandwidthPolicy from './VideoDownlinkBandwidthPolicy';
export default class NoVideoDownlinkBandwidthPolicy implements VideoDownlinkBandwidthPolicy {
    reset(): void;
    updateIndex(_videoIndex: DefaultVideoStreamIndex): void;
    updateMetrics(_clientMetricReport: ClientMetricReport): void;
    wantsResubscribe(): boolean;
    chooseSubscriptions(): DefaultVideoStreamIdSet;
}
