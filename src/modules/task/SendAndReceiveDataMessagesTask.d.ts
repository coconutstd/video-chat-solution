import AudioVideoControllerState from '../audiovideocontroller/AudioVideoControllerState';
import RemovableObserver from '../removableobserver/RemovableObserver';
import SignalingClientEvent from '../signalingclient/SignalingClientEvent';
import SignalingClientObserver from '../signalingclientobserver/SignalingClientObserver';
import BaseTask from './BaseTask';
export default class SendAndReceiveDataMessagesTask extends BaseTask implements RemovableObserver, SignalingClientObserver {
    private context;
    protected taskName: string;
    private static TOPIC_REGEX;
    private static DATA_SIZE;
    constructor(context: AudioVideoControllerState);
    run(): Promise<void>;
    removeObserver(): void;
    handleSignalingClientEvent(event: SignalingClientEvent): void;
    sendDataMessageHandler: (topic: string, data: Uint8Array | string | any, lifetimeMs?: number) => void;
    private validateDataMessage;
}
