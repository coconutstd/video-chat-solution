import AudioVideoControllerState from '../audiovideocontroller/AudioVideoControllerState';
import BaseTask from './BaseTask';
export default class CreateSDPTask extends BaseTask {
    private context;
    protected taskName: string;
    private cancelPromise;
    constructor(context: AudioVideoControllerState);
    cancel(): void;
    sessionUsesAudio(): boolean;
    sessionUsesVideo(): boolean;
    run(): Promise<void>;
}
