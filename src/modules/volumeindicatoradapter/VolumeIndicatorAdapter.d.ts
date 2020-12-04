import { SdkAudioMetadataFrame, SdkAudioStreamIdInfoFrame } from '../signalingprotocol/SignalingProtocol.js';
/**
 * VolumeIndicatorsAdapter dispatches updates to the RealtimeController when
 * signaling frames affecting roster presence or volume indicator state are
 * received.
 */
export default interface VolumeIndicatorsAdapter {
    /**
     * Sends realtime updates for an incoming SdkAudioStreamIdInfoFrame. This type
     * of frame affects presence and mute state.
     * @hidden
     */
    sendRealtimeUpdatesForAudioStreamIdInfo(info: SdkAudioStreamIdInfoFrame): void;
    /**
     * Sends realtime updates for an incoming SdkAudioMetadataFrame. This type of
     * frame affects volume and signal strength state.
     * @hidden
     */
    sendRealtimeUpdatesForAudioMetadata(metadata: SdkAudioMetadataFrame): void;
}
