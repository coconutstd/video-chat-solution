import ActiveSpeakerPolicy from './ActiveSpeakerPolicy';
export default class DefaultActiveSpeakerPolicy implements ActiveSpeakerPolicy {
    private speakerWeight;
    private cutoffThreshold;
    private silenceThreshold;
    private takeoverRate;
    /**
     * The map of attendeeIds to their active speaker score values
     */
    private volumes;
    /** Creates active speaker policy with speakerWeight, cutoffThreshold, silenceThreshold, and takeoverRate.
     *
     * @param speakerWeight
     * The number used to calculate new active speaker score for current attendee
     * ```js
     * Formula:
     * updatedCurrentAttendeeScore = currentAttendeeExistingScore * speakerWeight + currentReceivedVolume * (1 - speakerWeight)
     * ```
     *
     * @param cutoffThreshold
     * The threshold number compared with updated active speaker score.
     * If the updated active speaker score is less than this threshold value,
     * the updated score is returned as 0, else the updated score is returned.
     *
     * @param silenceThreshold
     * The threshold number compared with current received volume.
     * While calculating the new active speaker score, if the current received
     * volume is less than this threshold value, the current received volume is considered as 0,
     * else 1.
     *
     * @param takeoverRate
     * The number used to calculate other attendee's active speaker score, other than the current attendee.
     * ```js
     * Formula:
     *  updatedOtherAttendeeActiveSpeakerScore = Math.max(
     *    existingOtherAttendeeActiveSpeakerScore - takeoverRate * currentReceivedVolume,
     *    0
     *  );
     * ```
     */
    constructor(speakerWeight?: number, cutoffThreshold?: number, silenceThreshold?: number, takeoverRate?: number);
    calculateScore(attendeeId: string, volume: number | null, muted: boolean | null): number;
    prioritizeVideoSendBandwidthForActiveSpeaker(): boolean;
}
