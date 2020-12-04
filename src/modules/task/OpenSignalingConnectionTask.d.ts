import AudioVideoControllerState from '../audiovideocontroller/AudioVideoControllerState';
import BaseTask from './BaseTask';
export default class OpenSignalingConnectionTask extends BaseTask {
    private context;
    protected taskName: string;
    private taskCanceler;
    constructor(context: AudioVideoControllerState);
    cancel(): void;
    run(): Promise<void>;
}
