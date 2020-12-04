import MediaDeviceFactory from './MediaDeviceFactory';
export default class DefaultMediaDeviceFactory implements MediaDeviceFactory {
    private isMediaDevicesSupported;
    constructor();
    create(): MediaDevices;
}
