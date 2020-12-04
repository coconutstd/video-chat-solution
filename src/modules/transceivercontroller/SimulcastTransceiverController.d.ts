import BrowserBehavior from '../browserbehavior/BrowserBehavior';
import Logger from '../logger/Logger';
import DefaultTransceiverController from './DefaultTransceiverController';
export default class SimulcastTransceiverController extends DefaultTransceiverController {
    static readonly LOW_LEVEL_NAME: string;
    static readonly MID_LEVEL_NAME: string;
    static readonly HIGH_LEVEL_NAME: string;
    static readonly NAME_ARR_ASCENDING: string[];
    static readonly BITRATE_ARR_ASCENDING: number[];
    private videoQualityControlParameterMap;
    constructor(logger: Logger, browserBehavior: BrowserBehavior);
    setEncodingParameters(encodingParamMap: Map<string, RTCRtpEncodingParameters>): Promise<void>;
    static replaceAudioTrackForSender(sender: RTCRtpSender, track: MediaStreamTrack): Promise<boolean>;
    setVideoSendingBitrateKbps(_bitrateKbps: number): Promise<void>;
    setupLocalTransceivers(): void;
    private logVideoTransceiverParameters;
}
