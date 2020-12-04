import AudioVideoFacade from '../audiovideofacade/AudioVideoFacade';
import ContentShareController from '../contentsharecontroller/ContentShareController';
import DeviceController from '../devicecontroller/DeviceController';
import Logger from '../logger/Logger';
import MeetingSessionConfiguration from './MeetingSessionConfiguration';
export default interface MeetingSession {
    readonly configuration: MeetingSessionConfiguration;
    readonly logger: Logger;
    readonly audioVideo: AudioVideoFacade;
    readonly contentShare: ContentShareController;
    readonly deviceController: DeviceController;
}
