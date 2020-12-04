import Logger from '../logger/Logger';
import BaseConnectionHealthPolicy from './BaseConnectionHealthPolicy';
import ConnectionHealthData from './ConnectionHealthData';
import ConnectionHealthPolicy from './ConnectionHealthPolicy';
import ConnectionHealthPolicyConfiguration from './ConnectionHealthPolicyConfiguration';
export default class ReconnectionHealthPolicy extends BaseConnectionHealthPolicy implements ConnectionHealthPolicy {
    private logger;
    private static CONNECTION_UNHEALTHY_THRESHOLD;
    private static CONNECTION_WAIT_TIME_MS;
    private static MISSED_PONGS_THRESHOLD;
    private static MAXIMUM_AUDIO_DELAY_MS;
    private static MAXIMUM_AUDIO_DELAY_DATA_POINTS;
    private audioDelayPointsOverMaximum;
    constructor(logger: Logger, configuration: ConnectionHealthPolicyConfiguration, data: ConnectionHealthData);
    health(): number;
}
