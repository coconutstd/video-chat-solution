/**
 * [[MeetingSessionVideoAvailability]] contains the video availability information.
 */
export default class MeetingSessionVideoAvailability {
    /**
     * Indicates whether one or more remote video streams
     * are available for streaming. This can be used to decide whether or not to
     * switch the connection type to include video.
     */
    remoteVideoAvailable: boolean;
    /**
     * Indicates whether the server has a slot available for
     * this client's local video tile. If the client is already sending a local
     * video tile, then this will be true. This property can be used to decide
     * whether to offer the option to start the local video tile.
     */
    canStartLocalVideo: boolean;
    /**
     * Returns whether the fields are the same as that of another availability object.
     */
    equal(other: MeetingSessionVideoAvailability): boolean;
    /**
     * Returns a deep copy of this object.
     */
    clone(): MeetingSessionVideoAvailability;
}
