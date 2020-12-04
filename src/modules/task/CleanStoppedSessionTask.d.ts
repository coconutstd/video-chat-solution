import AudioVideoControllerState from '../audiovideocontroller/AudioVideoControllerState';
import BaseTask from './BaseTask';
export default class CleanStoppedSessionTask extends BaseTask {
    private context;
    protected taskName: string;
    private taskCanceler;
    constructor(context: AudioVideoControllerState);
    cancel(): void;
    run(): Promise<void>;
    private receiveWebSocketClosedEvent;
}
