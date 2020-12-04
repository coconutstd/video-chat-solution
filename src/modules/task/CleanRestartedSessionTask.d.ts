import AudioVideoControllerState from '../audiovideocontroller/AudioVideoControllerState';
import BaseTask from './BaseTask';
export default class CleanRestartedSessionTask extends BaseTask {
    private context;
    protected taskName: string;
    constructor(context: AudioVideoControllerState);
    run(): Promise<void>;
}
