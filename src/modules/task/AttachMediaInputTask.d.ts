import AudioVideoControllerState from '../audiovideocontroller/AudioVideoControllerState';
import BaseTask from './BaseTask';
export default class AttachMediaInputTask extends BaseTask {
    private context;
    protected taskName: string;
    constructor(context: AudioVideoControllerState);
    run(): Promise<void>;
}
