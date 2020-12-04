import AudioVideoControllerState from '../audiovideocontroller/AudioVideoControllerState';
import RemovableObserver from '../removableobserver/RemovableObserver';
import BaseTask from './BaseTask';
export default class CreatePeerConnectionTask extends BaseTask implements RemovableObserver {
    private context;
    protected taskName: string;
    private removeTrackAddedEventListener;
    private removeTrackRemovedEventListeners;
    private readonly trackEvents;
    private removeVideoTrackEventListeners;
    static readonly REMOVE_HANDLER_INTERVAL_MS: number;
    constructor(context: AudioVideoControllerState);
    removeObserver(): void;
    private addPeerConnectionEventLogger;
    run(): Promise<void>;
    private trackAddedHandler;
    private trackIsVideoInput;
    private addRemoteVideoTrack;
    private removeRemoteVideoTrack;
}
