export default class VideoQualitySettings {
    videoWidth: number;
    videoHeight: number;
    videoFrameRate: number;
    videoMaxBandwidthKbps: number;
    constructor(videoWidth: number, videoHeight: number, videoFrameRate: number, videoMaxBandwidthKbps: number);
}
