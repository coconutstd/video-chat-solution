import AudioVideoControllerState from '../audiovideocontroller/AudioVideoControllerState';
import BaseTask from './BaseTask';
export default class FinishGatheringICECandidatesTask extends BaseTask {
    private context;
    private chromeVpnTimeoutMs;
    protected taskName: string;
    private static CHROME_VPN_TIMEOUT_MS;
    private startTimestampMs;
    private cancelPromise;
    constructor(context: AudioVideoControllerState, chromeVpnTimeoutMs?: number);
    private removeEventListener;
    cancel(): void;
    run(): Promise<void>;
}
