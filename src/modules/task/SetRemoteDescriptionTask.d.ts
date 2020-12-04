import AudioVideoControllerState from '../audiovideocontroller/AudioVideoControllerState';
import BaseTask from './BaseTask';
export default class SetRemoteDescriptionTask extends BaseTask {
    private context;
    protected taskName: string;
    private cancelICEPromise;
    constructor(context: AudioVideoControllerState);
    cancel(): void;
    run(): Promise<void>;
    private createICEConnectionCompletedPromise;
}
