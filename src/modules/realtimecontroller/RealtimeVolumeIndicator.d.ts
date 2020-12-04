/**
 * [[RealtimeVolumeIndicator]] stores the current volume, mute, and
 * signal strength for an attendee.
 */
export default class RealtimeVolumeIndicator {
    volume: number | null;
    muted: boolean | null;
    signalStrength: number | null;
}
