import BaseConnectionHealthPolicy from './BaseConnectionHealthPolicy';
import ConnectionHealthData from './ConnectionHealthData';
import ConnectionHealthPolicy from './ConnectionHealthPolicy';
import ConnectionHealthPolicyConfiguration from './ConnectionHealthPolicyConfiguration';
export default class UnusableAudioWarningConnectionHealthPolicy extends BaseConnectionHealthPolicy implements ConnectionHealthPolicy {
    private coolDownTimeMs;
    private pastSamplesToConsider;
    private fractionalLoss;
    private packetsExpected;
    private maximumTimesToWarn;
    private warnCount;
    private lastWarnTimestampMs;
    constructor(configuration: ConnectionHealthPolicyConfiguration, data: ConnectionHealthData);
    calculateFractionalLoss(): number;
    health(): number;
}
