import ActiveSpeakerPolicy from '../activespeakerpolicy/ActiveSpeakerPolicy';
/**
 * [[ActiveSpeakerDetector]] listens to the volume indicator updates from the [[RealtimeController]]. It consults
 * the [[ActiveSpeakerPolicy]] to determine if the speaker is active or not.
 */
export default interface ActiveSpeakerDetector {
    subscribe(policy: ActiveSpeakerPolicy, callback: (activeSpeakers: string[]) => void, scoresCallback?: (scores: {
        [attendeeId: string]: number;
    }) => void, scoresCallbackIntervalMs?: number): void;
    unsubscribe(callback: (activeSpeakers: string[]) => void): void;
}
