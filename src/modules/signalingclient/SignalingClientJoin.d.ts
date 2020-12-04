/**
 * [[SignalingClientJoin]] contains settings for the Join SignalFrame.
 */
export default class SignalingClientJoin {
    maxVideos: number;
    sendBitrates: boolean;
    /** Initializes a SignalingClientJoin with the given properties.
     *
     * @param {number} maxVideos The maximum number of video tiles to send.
     * @param {boolean} sendBitrates Whether the server should send Bitrates messages.
     */
    constructor(maxVideos: number, sendBitrates: boolean);
}
