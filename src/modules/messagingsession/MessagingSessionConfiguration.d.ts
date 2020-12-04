/**
 * [[MessagingSessionConfiguration]] contains the information necessary to start
 * a messaging session.
 */
export default class MessagingSessionConfiguration {
    userArn: string;
    messagingSessionId: string | null;
    endpointUrl: string;
    chimeClient: any;
    awsClient: any;
    /**
     * Maximum amount of time in milliseconds to allow for reconnecting.
     */
    reconnectTimeoutMs: number;
    /**
     * Fixed wait amount in milliseconds between reconnecting attempts.
     */
    reconnectFixedWaitMs: number;
    /**
     * The short back off time in milliseconds between reconnecting attempts.
     */
    reconnectShortBackoffMs: number;
    /**
     * The short back off time in milliseconds between reconnecting attempts.
     */
    reconnectLongBackoffMs: number;
    /**
     * Constructs a MessagingSessionConfiguration optionally with userArn, messaging session id, a messaging session
     * endpoint URL, the chimeClient, and the AWSClient.
     * The messaging session id is to uniquely identify this messaging session for the userArn.
     * If messaging session id is passed in as null, it will be automatically generated.
     */
    constructor(userArn: string, messagingSessionId: string | null, endpointUrl: string, chimeClient: any, awsClient: any);
    private generateSessionId;
}
