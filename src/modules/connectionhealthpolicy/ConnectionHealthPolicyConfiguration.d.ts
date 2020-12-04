export default class ConnectionHealthPolicyConfiguration {
    minHealth: number;
    maxHealth: number;
    initialHealth: number;
    connectionUnhealthyThreshold: number;
    noSignalThresholdTimeMs: number;
    connectionWaitTimeMs: number;
    zeroBarsNoSignalTimeMs: number;
    oneBarWeakSignalTimeMs: number;
    twoBarsTimeMs: number;
    threeBarsTimeMs: number;
    fourBarsTimeMs: number;
    fiveBarsTimeMs: number;
    cooldownTimeMs: number;
    pastSamplesToConsider: number;
    goodSignalTimeMs: number;
    fractionalLoss: number;
    packetsExpected: number;
    maximumTimesToWarn: number;
    missedPongsLowerThreshold: number;
    missedPongsUpperThreshold: number;
    maximumAudioDelayMs: number;
    maximumAudioDelayDataPoints: number;
}
