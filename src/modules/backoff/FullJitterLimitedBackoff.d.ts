import FullJitterBackoff from './FullJitterBackoff';
export default class FullJitterLimitedBackoff extends FullJitterBackoff {
    private limit;
    private attempts;
    constructor(fixedWaitMs: number, shortBackoffMs: number, longBackoffMs: number, limit: number);
    nextBackoffAmountMs(): number;
}
