import AudioVideoControllerState from '../audiovideocontroller/AudioVideoControllerState';
import BaseTask from './BaseTask';
/**
 * [[SubscribeAndReceiveSubscribeAckTask]] sends a subscribe frame with the given settings
 * and receives SdkSubscribeAckFrame.
 */
export default class SubscribeAndReceiveSubscribeAckTask extends BaseTask {
    private context;
    protected taskName: string;
    private taskCanceler;
    constructor(context: AudioVideoControllerState);
    cancel(): void;
    run(): Promise<void>;
    private receiveSubscribeAck;
}
