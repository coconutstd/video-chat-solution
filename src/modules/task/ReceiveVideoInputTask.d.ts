import AudioVideoControllerState from '../audiovideocontroller/AudioVideoControllerState';
import BaseTask from './BaseTask';
/**
 * [[ReceiveVideoInputTask]] acquires a video input from [[DeviceController]].
 */
export default class ReceiveVideoInputTask extends BaseTask {
    private context;
    protected taskName: string;
    constructor(context: AudioVideoControllerState);
    run(): Promise<void>;
    private stopVideoInput;
}
