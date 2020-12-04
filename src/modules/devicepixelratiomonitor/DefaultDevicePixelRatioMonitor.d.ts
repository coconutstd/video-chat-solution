import DevicePixelRatioObserver from '../devicepixelratioobserver/DevicePixelRatioObserver';
import DevicePixelRatioSource from '../devicepixelratiosource/DevicePixelRatioSource';
import Logger from '../logger/Logger';
import DevicePixelRatioMonitor from './DevicePixelRatioMonitor';
export default class DefaultDevicePixelRatioMonitor implements DevicePixelRatioMonitor {
    private devicePixelRatioSource;
    private observerQueue;
    constructor(devicePixelRatioSource: DevicePixelRatioSource, logger: Logger);
    mediaQueryListener: () => void;
    registerObserver(observer: DevicePixelRatioObserver): void;
    removeObserver(observer: DevicePixelRatioObserver): void;
}
