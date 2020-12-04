import AudioVideoControllerState from '../audiovideocontroller/AudioVideoControllerState';
import BaseTask from './BaseTask';
/**
 * [[ReceiveAudioInputTask]] acquires an audio input.
 */
export default class ReceiveAudioInputTask extends BaseTask {
    private context;
    protected taskName: string;
    constructor(context: AudioVideoControllerState);
    run(): Promise<void>;
}
