import AudioVideoControllerState from '../audiovideocontroller/AudioVideoControllerState';
import RemovableObserver from '../removableobserver/RemovableObserver';
import SignalingClientEvent from '../signalingclient/SignalingClientEvent';
import SignalingClientObserver from '../signalingclientobserver/SignalingClientObserver';
import BaseTask from './BaseTask';
export default class ReceiveVideoStreamIndexTask extends BaseTask implements SignalingClientObserver, RemovableObserver {
    private context;
    protected taskName: string;
    constructor(context: AudioVideoControllerState);
    removeObserver(): void;
    run(): Promise<void>;
    handleSignalingClientEvent(event: SignalingClientEvent): void;
    private handleIndexFrame;
    private areVideoSourcesEqual;
    private resubscribe;
    private updateVideoAvailability;
    private handleIndexVideosPausedAtSource;
}
