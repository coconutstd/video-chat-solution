/**
 * [[MediaDeviceFactory]] creates a proxy for MediaDevices.
 */
export default interface MediaDeviceFactory {
    /**
     * Creates a MediaDevices proxy.
     */
    create(): MediaDevices;
}
