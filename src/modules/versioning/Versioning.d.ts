export default class Versioning {
    static X_AMZN_VERSION: string;
    static X_AMZN_USER_AGENT: string;
    /**
     * Return string representation of SDK name
     */
    static get sdkName(): string;
    /**
     * Return string representation of SDK version
     */
    static get sdkVersion(): string;
    /**
     * Return the SHA-1 of the Git commit from which this build was created.
     */
    static get buildSHA(): string;
    /**
     * Return low-resolution string representation of SDK user agent (e.g. `chrome-78`)
     */
    static get sdkUserAgentLowResolution(): string;
    /**
     * Return URL with versioning information appended
     */
    static urlWithVersion(url: string): string;
}
