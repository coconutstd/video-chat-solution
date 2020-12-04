import DeviceChangeObserver from '../devicechangeobserver/DeviceChangeObserver';
import DeviceControllerBasedMediaStreamBroker from '../mediastreambroker/DeviceControllerBasedMediaStreamBroker';
import NoOpMediaStreamBroker from '../mediastreambroker/NoOpMediaStreamBroker';
import AudioInputDevice from './AudioInputDevice';
import RemovableAnalyserNode from './RemovableAnalyserNode';
import VideoInputDevice from './VideoInputDevice';
import VideoQualitySettings from './VideoQualitySettings';
export default class NoOpDeviceController extends NoOpMediaStreamBroker implements DeviceControllerBasedMediaStreamBroker {
    constructor(_options?: {
        enableWebAudio?: boolean;
    });
    listAudioInputDevices(): Promise<MediaDeviceInfo[]>;
    listVideoInputDevices(): Promise<MediaDeviceInfo[]>;
    listAudioOutputDevices(): Promise<MediaDeviceInfo[]>;
    chooseAudioInputDevice(_device: AudioInputDevice): Promise<void>;
    chooseVideoInputDevice(_device: VideoInputDevice): Promise<void>;
    chooseAudioOutputDevice(_deviceId: string | null): Promise<void>;
    addDeviceChangeObserver(_observer: DeviceChangeObserver): void;
    removeDeviceChangeObserver(_observer: DeviceChangeObserver): void;
    createAnalyserNodeForAudioInput(): RemovableAnalyserNode | null;
    startVideoPreviewForVideoInput(_element: HTMLVideoElement): void;
    stopVideoPreviewForVideoInput(_element: HTMLVideoElement): void;
    setDeviceLabelTrigger(_trigger: () => Promise<MediaStream>): void;
    mixIntoAudioInput(_stream: MediaStream): MediaStreamAudioSourceNode;
    chooseVideoInputQuality(_width: number, _height: number, _frameRate: number, _maxBandwidthKbps: number): void;
    getVideoInputQualitySettings(): VideoQualitySettings | null;
}
