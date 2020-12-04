import SigV4 from './SigV4';
export default class DefaultSigV4 implements SigV4 {
    chimeClient: any;
    awsClient: any;
    constructor(chimeClient: any, awsClient: any);
    private makeTwoDigits;
    private getDateTimeString;
    private getDateString;
    private getSignatureKey;
    signURL(method: string, scheme: string, serviceName: string, hostname: string, path: string, payload: string, queryParams: Map<string, string[]> | null): string;
}
