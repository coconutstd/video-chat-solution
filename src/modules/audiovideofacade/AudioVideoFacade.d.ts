import ActiveSpeakerDetectorFacade from '../activespeakerdetector/ActiveSpeakerDetectorFacade';
import AudioMixControllerFacade from '../audiomixcontroller/AudioMixControllerFacade';
import AudioVideoControllerFacade from '../audiovideocontroller/AudioVideoControllerFacade';
import ContentShareControllerFacade from '../contentsharecontroller/ContentShareControllerFacade';
import DeviceController from '../devicecontroller/DeviceController';
import RealtimeControllerFacade from '../realtimecontroller/RealtimeControllerFacade';
import VideoTileControllerFacade from '../videotilecontroller/VideoTileControllerFacade';
export default interface AudioVideoFacade extends AudioVideoControllerFacade, VideoTileControllerFacade, AudioMixControllerFacade, RealtimeControllerFacade, ActiveSpeakerDetectorFacade, DeviceController, ContentShareControllerFacade {
}
