/**
 * AudioProfile defines quality settings of the audio input
 * device. Use the static methods to create presets optimized
 * for fullband speech and fullband music with a mono channel.
 */
export default class AudioProfile {
    audioBitrateBps: number | null;
    /**
     * Constructs an AudioProfile given an audio bitrate. If no
     * audio bitrate is supplied, then the default AudioProfile
     * is constructed. The default AudioProfile does not adjust
     * the browser's internal bitrate setting.
     */
    constructor(audioBitrateBps?: number | null);
    /**
     * Creates an AudioProfile optimized for fullband speech (40 kbit/s mono).
     */
    static fullbandSpeechMono(): AudioProfile;
    /**
     * Creates an AudioProfile optimized for fullband music (64 kbit/s mono).
     */
    static fullbandMusicMono(): AudioProfile;
}
