export default class SignalingClientConnectionRequest {
    signalingURL: string;
    joinToken: string;
    /** Creates a request with the given URL, conference id, and join token.
     *
     * @param {string} signalingURL The URL of the signaling proxy.
     * @param {string} joinToken The join token that will authenticate the connection.
     */
    constructor(signalingURL: string, joinToken: string);
    /** Gets the signaling URL representing this request.*/
    url(): string;
    /** Gets the protocols associated with this request.*/
    protocols(): string[];
}
