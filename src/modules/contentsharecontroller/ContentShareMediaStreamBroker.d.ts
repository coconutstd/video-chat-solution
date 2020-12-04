import AudioVideoController from '../audiovideocontroller/AudioVideoController';
import Logger from '../logger/Logger';
import MediaStreamBroker from '../mediastreambroker/MediaStreamBroker';
export default class ContentShareMediaStreamBroker implements MediaStreamBroker {
    private logger;
    private static defaultFrameRate;
    private _mediaStream;
    constructor(logger: Logger);
    get mediaStream(): MediaStream;
    set mediaStream(mediaStream: MediaStream);
    acquireAudioInputStream(): Promise<MediaStream>;
    acquireVideoInputStream(): Promise<MediaStream>;
    releaseMediaStream(_mediaStreamToRelease: MediaStream): void;
    acquireDisplayInputStream(streamConstraints: MediaStreamConstraints): Promise<MediaStream>;
    bindToAudioVideoController(_audioVideoController: AudioVideoController): void;
    acquireScreenCaptureDisplayInputStream(sourceId?: string, frameRate?: number): Promise<MediaStream>;
    private screenCaptureDisplayMediaConstraints;
    toggleMediaStream(enable: boolean): boolean;
    cleanup(): void;
}
