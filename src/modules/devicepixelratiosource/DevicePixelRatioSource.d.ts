/**
 * [[DevicePixelRatioSource]] provides an interface for the source
 * of the device pixel ratio.
 */
export default interface DevicePixelRatioSource {
    /**
     * Returns the current device pixel ratio.
     */
    devicePixelRatio(): number;
}
