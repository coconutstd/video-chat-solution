import AudioNodeSubgraph from '../devicecontroller/AudioNodeSubgraph';
import type AudioTransformDevice from '../devicecontroller/AudioTransformDevice';
import type Device from '../devicecontroller/Device';
import VoiceFocusTransformDeviceObserver from './VoiceFocusTransformDeviceObserver';
/**
 * A device that augments an {@link Device} to apply Amazon Voice Focus
 * noise suppression to an audio input.
 */
declare class VoiceFocusTransformDevice implements AudioTransformDevice {
    private device;
    private voiceFocus;
    private delegate;
    private nodeOptions;
    private failed;
    private node;
    private browserBehavior;
    /**
     * Return the inner device as provided during construction, or updated via
     * {@link chooseNewInnerDevice}. Do not confuse this method with {@link intrinsicDevice}.
     */
    getInnerDevice(): Device;
    /**
     * Disable the audio node while muted to reduce CPU usage.
     *
     * @param muted whether the audio device should be muted.
     */
    mute(muted: boolean): Promise<void>;
    /**
     * Dispose of the inner workings of the transform device. After this method is called
     * you will need to create a new device to use Amazon Voice Focus again.
     */
    stop(): Promise<void>;
    /**
     * If you wish to choose a different inner device, but continue to use Amazon Voice Focus, you
     * can use this method to efficiently create a new device that will reuse
     * the same internal state. Only one of the two devices can be used at a time: switch
     * between them using {@link DeviceController.chooseAudioInputDevice}.
     *
     * If the same device is passed as is currently in use, `this` is returned.
     *
     * @param inner The new inner device to use.
     * @param enabled (optional) Whether to toggle the enabled state of the device.
     */
    chooseNewInnerDevice(inner: Device): Promise<VoiceFocusTransformDevice>;
    intrinsicDevice(): Promise<Device>;
    createAudioNode(context: AudioContext): Promise<AudioNodeSubgraph>;
    /**
     * Add an observer to receive notifications about Amazon Voice Focus lifecycle events.
     * See {@link VoiceFocusTransformDeviceObserver} for details.
     * If the observer has already been added, this method call has no effect.
     */
    addObserver(observer: VoiceFocusTransformDeviceObserver): void;
    /**
     * Remove an existing observer. If the observer has not been previously {@link
     * VoiceFocusTransformDevice.addObserver|added}, this method call has no effect.
     */
    removeObserver(observer: VoiceFocusTransformDeviceObserver): void;
}
export default VoiceFocusTransformDevice;
