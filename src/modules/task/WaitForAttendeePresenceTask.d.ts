import AudioVideoControllerState from '../audiovideocontroller/AudioVideoControllerState';
import BaseTask from './BaseTask';
export default class WaitForAttendeePresenceTask extends BaseTask {
    private context;
    protected taskName: string;
    private cancelPromise;
    constructor(context: AudioVideoControllerState);
    cancel(): void;
    run(): Promise<void>;
}
