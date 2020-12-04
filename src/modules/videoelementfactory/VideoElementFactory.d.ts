/**
 * [[VideoElementFactory]] provides an interface for creating a video element.
 */
export default interface VideoElementFactory {
    /**
     * Creates a video element.
     */
    create(): HTMLVideoElement;
}
