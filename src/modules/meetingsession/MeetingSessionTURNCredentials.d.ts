/**
 * [[MeetingSessionTURNCredentials]] contains TURN credentials from the TURN server.
 */
export default class MeetingSessionTURNCredentials {
    username: string | null;
    password: string | null;
    ttl: number | null;
    uris: string[] | null;
}
