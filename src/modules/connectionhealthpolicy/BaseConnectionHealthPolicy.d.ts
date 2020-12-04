import ConnectionHealthData from './ConnectionHealthData';
import ConnectionHealthPolicy from './ConnectionHealthPolicy';
import ConnectionHealthPolicyConfiguration from './ConnectionHealthPolicyConfiguration';
export default class BaseConnectionHealthPolicy implements ConnectionHealthPolicy {
    protected currentData: ConnectionHealthData;
    protected minHealth: number;
    protected maxHealth: number;
    protected currentHealth: number;
    constructor(configuration: ConnectionHealthPolicyConfiguration, data: ConnectionHealthData);
    minimumHealth(): number;
    maximumHealth(): number;
    health(): number;
    update(connectionHealthData: ConnectionHealthData): void;
    getConnectionHealthData(): ConnectionHealthData;
    healthy(): boolean;
    healthIfChanged(): number | null;
}
