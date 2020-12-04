/**
 * [[MeetingSessionCredentials]] includes the credentials used to authenticate
 * the attendee on the meeting
 */
export default class MeetingSessionCredentials {
    /**
     * The attendee id for these credentials.
     */
    attendeeId: string | null;
    /**
     * The external user id associated with the attendee.
     */
    externalUserId: string | null;
    /**
     * If set, the session will be authenticated with a join token.
     */
    joinToken: string | null;
    /**
     * Overrides JSON serialization so that join token is redacted.
     */
    toJSON(): {
        [id: string]: string;
    };
}
