import ConnectionHealthData from './ConnectionHealthData';
export default interface ConnectionHealthPolicy {
    /**
     * The minimum possible value.
     */
    minimumHealth(): number;
    /**
     * The maximum possible value.
     */
    maximumHealth(): number;
    /**
     * Updates the policy with the latest data.
     */
    update(connectionHealthData: ConnectionHealthData): void;
    /**
     * The current value per this policy for the given connection health data.
     */
    health(): number;
    /**
     * Whether the current value is considered healthy for the given connection health data.
     */
    healthy(): boolean;
    /**
     * The value per this policy or null if it has not changed since the last call.
     */
    healthIfChanged(): number | null;
}
