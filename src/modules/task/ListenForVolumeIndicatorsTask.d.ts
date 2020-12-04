import AudioVideoControllerState from '../audiovideocontroller/AudioVideoControllerState';
import RemovableObserver from '../removableobserver/RemovableObserver';
import SignalingClientEvent from '../signalingclient/SignalingClientEvent';
import SignalingClientObserver from '../signalingclientobserver/SignalingClientObserver';
import BaseTask from './BaseTask';
export default class ListenForVolumeIndicatorsTask extends BaseTask implements RemovableObserver, SignalingClientObserver {
    private context;
    protected taskName: string;
    constructor(context: AudioVideoControllerState);
    run(): Promise<void>;
    removeObserver(): void;
    handleSignalingClientEvent(event: SignalingClientEvent): void;
    realtimeMuteAndUnmuteHandler: (muted: boolean) => void;
}
