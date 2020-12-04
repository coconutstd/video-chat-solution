import AudioVideoFacade from '../audiovideofacade/AudioVideoFacade';
import ContentShareController from '../contentsharecontroller/ContentShareController';
import DeviceController from '../devicecontroller/DeviceController';
import Logger from '../logger/Logger';
import DeviceControllerBasedMediaStreamBroker from '../mediastreambroker/DeviceControllerBasedMediaStreamBroker';
import MeetingSession from './MeetingSession';
import MeetingSessionConfiguration from './MeetingSessionConfiguration';
export default class DefaultMeetingSession implements MeetingSession {
    private _configuration;
    private _logger;
    private audioVideoController;
    private contentShareController;
    private _deviceController;
    private audioVideoFacade;
    private static RECONNECT_TIMEOUT_MS;
    private static RECONNECT_FIXED_WAIT_MS;
    private static RECONNECT_SHORT_BACKOFF_MS;
    private static RECONNECT_LONG_BACKOFF_MS;
    constructor(configuration: MeetingSessionConfiguration, logger: Logger, deviceController: DeviceControllerBasedMediaStreamBroker);
    get configuration(): MeetingSessionConfiguration;
    get logger(): Logger;
    get audioVideo(): AudioVideoFacade;
    get contentShare(): ContentShareController;
    get deviceController(): DeviceController;
    private checkBrowserSupportAndFeatureConfiguration;
}
