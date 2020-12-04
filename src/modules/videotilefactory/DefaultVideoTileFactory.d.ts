import DevicePixelRatioMonitor from '../devicepixelratiomonitor/DevicePixelRatioMonitor';
import VideoTile from '../videotile/VideoTile';
import VideoTileController from '../videotilecontroller/VideoTileController';
import VideoTileFactory from './VideoTileFactory';
export default class DefaultVideoTileFactory implements VideoTileFactory {
    makeTile(tileId: number, localTile: boolean, tileController: VideoTileController, devicePixelRatioMonitor: DevicePixelRatioMonitor): VideoTile;
}
