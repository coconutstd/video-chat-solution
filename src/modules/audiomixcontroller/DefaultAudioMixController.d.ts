import Logger from '../logger/Logger';
import AudioMixController from './AudioMixController';
export default class DefaultAudioMixController implements AudioMixController {
    private logger?;
    private audioDevice;
    private audioElement;
    private audioStream;
    private browserBehavior;
    constructor(logger?: Logger);
    bindAudioElement(element: HTMLAudioElement): Promise<void>;
    unbindAudioElement(): void;
    bindAudioStream(stream: MediaStream): Promise<void>;
    bindAudioDevice(device: MediaDeviceInfo | null): Promise<void>;
    private bindAudioMix;
}
