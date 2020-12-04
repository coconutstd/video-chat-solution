/**
 * [[MeetingSessionURLs]] contains the URLs that will be used to reach the
 * meeting service.
 */
export default class MeetingSessionURLs {
    /**
     * The audio host URL of the session
     */
    private _audioHostURL;
    /**
     * The screen data URL of the session
     */
    private _screenDataURL;
    /**
     * The screen sharing URL of the session
     */
    private _screenSharingURL;
    /**
     * The screen viewing URL of the session
     */
    private _screenViewingURL;
    /**
     * The signaling URL of the session
     */
    private _signalingURL;
    /**
     * The TURN control URL of the session
     */
    private _turnControlURL;
    /**
     * Gets the audio host URL after applying the urlRewriter function.
     */
    get audioHostURL(): string | null;
    /**
     * Sets the raw audio host URL.
     */
    set audioHostURL(value: string | null);
    /**
     * Gets the screen data URL after applying the urlRewriter function.
     */
    get screenDataURL(): string | null;
    /**
     * Sets the raw screen data URL.
     */
    set screenDataURL(value: string | null);
    /**
     * Gets the screen sharing URL after applying the urlRewriter function.
     */
    get screenSharingURL(): string | null;
    /**
     * Sets the raw screen sharing URL.
     */
    set screenSharingURL(value: string | null);
    /**
     * Gets the screen viewing URL after applying the urlRewriter function.
     */
    get screenViewingURL(): string | null;
    /**
     * Sets the raw screen viewing URL.
     */
    set screenViewingURL(value: string | null);
    /**
     * Gets the signaling URL after applying the urlRewriter function.
     */
    get signalingURL(): string | null;
    /**
     * Sets the raw signaling URL.
     */
    set signalingURL(value: string | null);
    /**
     * Gets the TURN control URL after applying the urlRewriter function.
     */
    get turnControlURL(): string | null;
    /**
     * Sets the raw TURN control URL.
     */
    set turnControlURL(value: string | null);
    /**
     * Function to transform URLs. Use this to rewrite URLs to traverse proxies.
     * The default implementation returns the original URL unchanged.
     */
    urlRewriter: (url: string | null) => string | null;
}
