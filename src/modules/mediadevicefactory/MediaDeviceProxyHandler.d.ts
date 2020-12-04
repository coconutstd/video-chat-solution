export default class MediaDeviceProxyHandler implements ProxyHandler<MediaDevices> {
    private static INTERVAL_MS;
    private scheduler;
    private devices;
    private deviceChangeListeners;
    get: (target: MediaDevices, property: PropertyKey, receiver: any) => any;
    private patchAddEventListener;
    private patchRemoveEventListener;
    private pollDeviceLists;
    private sortedDeviceList;
    private handleDeviceChangeEvent;
}
