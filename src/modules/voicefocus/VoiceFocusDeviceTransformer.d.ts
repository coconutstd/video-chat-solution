import type { VoiceFocusPaths } from '../../libs/voicefocus/types';
import type { NodeArguments } from '../../libs/voicefocus/voicefocus';
import type Device from '../devicecontroller/Device';
import Logger from '../logger/Logger';
import type AssetSpec from './AssetSpec';
import type VoiceFocusDeviceOptions from './VoiceFocusDeviceOptions';
import type VoiceFocusSpec from './VoiceFocusSpec';
import VoiceFocusTransformDevice from './VoiceFocusTransformDevice';
/**
 * `VoiceFocusDeviceTransformer` is used to create {@link VoiceFocusTransformDevice|transform devices}
 * that apply Amazon Voice Focus noise suppression to audio input.
 *
 * This transformer captures relevant configuration. You should check for support, initialize,
 * and then create a device as follows:
 *
 * ```
 * const deviceID = null;
 *
 * // This check for support is cheap and quick, and should be used to gate use
 * // of this feature.
 * if (!(await VoiceFocusDeviceTransformer.isSupported()) {
 *   console.log('Amazon Voice Focus not supported in this browser.');
 *   return deviceID;
 * }
 *
 * let transformer: VoiceFocusDeviceTransformer;
 * try {
 *   // This operation can fail in ways that do not indicate no support,
 *   // but do indicate an inability to apply Amazon Voice Focus. Trying again
 *   // might succeed.
 *   transformer = await VoiceFocusDeviceTransformer.create({});
 * } catch (e) {
 *   // Something went wrong.
 *   console.log('Unable to instantiate Amazon Voice Focus.');
 *   return deviceID;
 * }
 *
 * if (!transformer.isSupported()) {
 *   // The transformer will fall through, but your UI might care.
 *   console.log('Amazon Voice Focus not supported in this browser.');
 * }
 *
 * return await transformer.createTransformDevice(deviceID);
 * ```
 */
export declare class VoiceFocusDeviceTransformer {
    private spec;
    private logger;
    private vfLogger;
    private preload;
    private configuration;
    private fetchBehavior;
    private pendingVoiceFocus;
    private supported;
    /**
     * Quickly check whether Amazon Voice Focus is supported on this platform.
     *
     * This will return `false` if key technologies are absent. A value of `true` does not
     * necessarily mean that adding Amazon Voice Focus will succeed: it is still possible that the
     * configuration of the page or the CPU speed of the device are limiting factors.
     *
     * `VoiceFocusDeviceTransformer.create` will return an instance whose `isSupported()`
     * method more accurately reflects whether Amazon Voice Focus is supported in the current environment.
     *
     * This method will only reject if you provide invalid inputs.
     *
     * @param spec An optional asset group and URL paths to use when fetching. You can pass
     *             a complete `VoiceFocusSpec` here for convenience, matching the signature of `create`.
     * @param options Additional named arguments, including `logger`.
     */
    static isSupported(spec?: AssetSpec & {
        paths?: VoiceFocusPaths;
    }, options?: {
        logger?: Logger;
    }): Promise<boolean>;
    /**
     * Create a transformer that can apply Amazon Voice Focus noise suppression to a device.
     *
     * This method will reject if the provided spec is invalid, or if the process of
     * checking for support or estimating fails (e.g., because the network is unreachable).
     *
     * If Amazon Voice Focus is not supported on this device, this call will not reject and
     * `isSupported()` will return `false` on the returned instance. That instance will
     * pass through devices unmodified.
     *
     * @param spec A definition of how you want Amazon Voice Focus to behave. See the declaration of
     *             {@link VoiceFocusSpec}` for details.
     * @param options Additional named arguments, including `logger` and `preload`.
     */
    static create(spec?: VoiceFocusSpec, options?: VoiceFocusDeviceOptions): Promise<VoiceFocusDeviceTransformer>;
    /**
     * Return whether this transformer is able to function in this environment.
     * If not, calls to
     * {@link VoiceFocusDeviceTransformer.createTransformDevice|createTransformDevice}`
     * will pass through an unmodified device.
     */
    isSupported(): boolean;
    /**
     * Apply Amazon Voice Focus to the selected {@link Device}.
     *
     * If this is a stream, it should be one that does not include other noise suppression features,
     * and you should consider whether to disable automatic gain control (AGC) on the stream, because
     * it can interact with noise suppression.
     *
     * @returns a device promise. This will always resolve to either a
     *          {@link VoiceFocusTransformDevice} or undefined; it will never reject.
     */
    createTransformDevice(device: Device, nodeOptions?: NodeArguments): Promise<VoiceFocusTransformDevice | undefined>;
    private constructor();
    private static augmentSpec;
    private configure;
    private init;
    private createVoiceFocus;
    private allocateVoiceFocus;
    private static majorVersion;
    private static majorMinorVersion;
    private static currentSDKAssetGroup;
    private static defaultFetchBehavior;
}
export default VoiceFocusDeviceTransformer;
