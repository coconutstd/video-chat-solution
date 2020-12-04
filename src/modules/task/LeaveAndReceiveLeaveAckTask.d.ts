import AudioVideoControllerState from '../audiovideocontroller/AudioVideoControllerState';
import BaseTask from './BaseTask';
/**
 * [[LeaveAndReceiveLeaveAckTask]] sends a Leave frame and waits for a LeaveAck.
 */
export default class LeaveAndReceiveLeaveAckTask extends BaseTask {
    private context;
    protected taskName: string;
    private taskCanceler;
    constructor(context: AudioVideoControllerState);
    cancel(): void;
    run(): Promise<void>;
    private receiveLeaveAck;
}
