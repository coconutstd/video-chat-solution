import ActiveSpeakerPolicy from '../activespeakerpolicy/ActiveSpeakerPolicy';
/**
 * [[ActiveSpeakerDetectorFacade]] listens to the volume indicator updates from the [[RealtimeController]].
 */
export default interface ActiveSpeakerDetectorFacade {
    subscribeToActiveSpeakerDetector(policy: ActiveSpeakerPolicy, callback: (activeSpeakers: string[]) => void, scoresCallback?: (scores: {
        [attendeeId: string]: number;
    }) => void, scoresCallbackIntervalMs?: number): void;
    unsubscribeFromActiveSpeakerDetector(callback: (activeSpeakers: string[]) => void): void;
}
