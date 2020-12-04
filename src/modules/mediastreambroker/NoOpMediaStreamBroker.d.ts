import AudioVideoController from '../audiovideocontroller/AudioVideoController';
import MediaStreamBroker from './MediaStreamBroker';
/**
 * [[NoOpDeviceBroker]] rejects requests to acquire a [[MediaStream]].
 */
export default class NoOpMediaStreamBroker implements MediaStreamBroker {
    acquireAudioInputStream(): Promise<MediaStream>;
    acquireVideoInputStream(): Promise<MediaStream>;
    acquireDisplayInputStream(_streamConstraints: MediaStreamConstraints): Promise<MediaStream>;
    releaseMediaStream(_mediaStreamToRelease: MediaStream): void;
    bindToAudioVideoController(_audioVideoController: AudioVideoController): void;
}
