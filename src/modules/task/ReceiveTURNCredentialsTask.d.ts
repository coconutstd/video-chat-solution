import AudioVideoControllerState from '../audiovideocontroller/AudioVideoControllerState';
import BaseTask from './BaseTask';
export default class ReceiveTURNCredentialsTask extends BaseTask {
    private context;
    protected taskName: string;
    private url;
    private meetingId;
    private joinToken;
    private cancelPromise;
    constructor(context: AudioVideoControllerState);
    cancel(): void;
    run(): Promise<void>;
}
