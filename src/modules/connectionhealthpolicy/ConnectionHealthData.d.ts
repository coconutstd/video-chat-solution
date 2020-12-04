export default class ConnectionHealthData {
    connectionStartTimestampMs: number;
    consecutiveStatsWithNoPackets: number;
    lastPacketLossInboundTimestampMs: number;
    lastGoodSignalTimestampMs: number;
    lastWeakSignalTimestampMs: number;
    lastNoSignalTimestampMs: number;
    consecutiveMissedPongs: number;
    packetsReceivedInLastMinute: number[];
    fractionPacketsLostInboundInLastMinute: number[];
    audioSpeakerDelayMs: number;
    constructor();
    private static isTimestampRecent;
    setConnectionStartTime(): void;
    reset(): void;
    isConnectionStartRecent(recentDurationMs: number): boolean;
    isLastPacketLossRecent(recentDurationMs: number): boolean;
    isGoodSignalRecent(recentDurationMs: number): boolean;
    isWeakSignalRecent(recentDurationMs: number): boolean;
    isNoSignalRecent(recentDurationMs: number): boolean;
    clone(): ConnectionHealthData;
    setConsecutiveMissedPongs(pongs: number): void;
    setConsecutiveStatsWithNoPackets(stats: number): void;
    setLastPacketLossInboundTimestampMs(timeStamp: number): void;
    setLastNoSignalTimestampMs(timeStamp: number): void;
    setLastWeakSignalTimestampMs(timeStamp: number): void;
    setLastGoodSignalTimestampMs(timeStamp: number): void;
    setAudioSpeakerDelayMs(delayMs: number): void;
}
