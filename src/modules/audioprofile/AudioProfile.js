"use strict";
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * AudioProfile defines quality settings of the audio input
 * device. Use the static methods to create presets optimized
 * for fullband speech and fullband music with a mono channel.
 */
class AudioProfile {
    /**
     * Constructs an AudioProfile given an audio bitrate. If no
     * audio bitrate is supplied, then the default AudioProfile
     * is constructed. The default AudioProfile does not adjust
     * the browser's internal bitrate setting.
     */
    constructor(audioBitrateBps = null) {
        this.audioBitrateBps = audioBitrateBps;
    }
    /**
     * Creates an AudioProfile optimized for fullband speech (40 kbit/s mono).
     */
    static fullbandSpeechMono() {
        return new AudioProfile(40000);
    }
    /**
     * Creates an AudioProfile optimized for fullband music (64 kbit/s mono).
     */
    static fullbandMusicMono() {
        return new AudioProfile(64000);
    }
}
exports.default = AudioProfile;
//# sourceMappingURL=AudioProfile.js.map