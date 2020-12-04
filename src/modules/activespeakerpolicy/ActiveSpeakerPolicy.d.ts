/**
 * [[ActiveSpeakerPolicy]] calculates a normalized score of how active a speaker is. Implementations
 * of [[ActiveSpeakerPolicy]] provide custom algorithms for calculating the score.
 */
export default interface ActiveSpeakerPolicy {
    calculateScore(attendeeId: string, volume: number | null, muted: boolean | null): number;
    prioritizeVideoSendBandwidthForActiveSpeaker(): boolean;
}
