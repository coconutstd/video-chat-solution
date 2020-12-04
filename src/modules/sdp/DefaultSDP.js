"use strict";
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
const SDPCandidateType_1 = require("./SDPCandidateType");
/**
 * Implements [[SDP]]. [[SDP]] also includes a few helper functions for parsing string.
 */
class DefaultSDP {
    constructor(sdp) {
        this.sdp = sdp;
    }
    clone() {
        return new DefaultSDP(this.sdp);
    }
    static isRTPCandidate(candidate) {
        const match = /candidate[:](\S+) (\d+)/g.exec(candidate);
        if (match === null || match[2] !== '1') {
            return false;
        }
        return true;
    }
    static linesToSDP(lines) {
        return new DefaultSDP(lines.join(DefaultSDP.CRLF));
    }
    static candidateTypeFromString(candidateType) {
        switch (candidateType) {
            case SDPCandidateType_1.default.Host:
                return SDPCandidateType_1.default.Host;
            case SDPCandidateType_1.default.ServerReflexive:
                return SDPCandidateType_1.default.ServerReflexive;
            case SDPCandidateType_1.default.PeerReflexive:
                return SDPCandidateType_1.default.PeerReflexive;
            case SDPCandidateType_1.default.Relay:
                return SDPCandidateType_1.default.Relay;
        }
        return null;
    }
    static candidateType(sdpLine) {
        const match = /a[=]candidate[:].* typ ([a-z]+) /g.exec(sdpLine);
        if (match === null) {
            return null;
        }
        return DefaultSDP.candidateTypeFromString(match[1]);
    }
    static splitLines(blob) {
        return blob
            .trim()
            .split('\n')
            .map((line) => {
            return line.trim();
        });
    }
    static splitSections(sdp) {
        // each section starts with "m="
        const sections = sdp.split('\nm=');
        return sections.map((section, index) => {
            return (index > 0 ? 'm=' + section : section).trim() + DefaultSDP.CRLF;
        });
    }
    static findActiveCameraSection(sections) {
        let cameraLineIndex = 0;
        let hasCamera = false;
        for (const sec of sections) {
            if (/^m=video/.test(sec)) {
                if (sec.indexOf('sendrecv') > -1) {
                    hasCamera = true;
                    break;
                }
            }
            cameraLineIndex++;
        }
        if (hasCamera === false) {
            cameraLineIndex = -1;
        }
        return cameraLineIndex;
    }
    static parseSSRCMedia(ssrcMediaAttributeLine) {
        const separator = ssrcMediaAttributeLine.indexOf(' ');
        let ssrc = 0;
        let attribute = '';
        let value = '';
        ssrc = DefaultSDP.extractSSRCFromAttributeLine(ssrcMediaAttributeLine);
        const secondColon = ssrcMediaAttributeLine.indexOf(':', separator);
        if (secondColon > -1) {
            attribute = ssrcMediaAttributeLine.substr(separator + 1, secondColon - separator - 1);
            value = ssrcMediaAttributeLine.substr(secondColon + 1);
        }
        else {
            attribute = ssrcMediaAttributeLine.substr(separator + 1);
        }
        return [ssrc, attribute, value];
    }
    // a=ssrc-group:<semantics> <ssrc-id> ...
    static extractSSRCsFromFIDGroupLine(figGroupLine) {
        const ssrcStringMatch = /^a=ssrc-group:FID\s(.+)/.exec(figGroupLine);
        return ssrcStringMatch[1];
    }
    // a=ssrc:<ssrc-id> <attribute> or a=ssrc:<ssrc-id> <attribute>:<value>, ssrc-id is a 32bit integer
    static extractSSRCFromAttributeLine(ssrcMediaAttributeLine) {
        const ssrcStringMatch = /^a=ssrc:([0-9]+)\s/.exec(ssrcMediaAttributeLine);
        if (ssrcStringMatch === null) {
            return 0;
        }
        return parseInt(ssrcStringMatch[1], 10);
    }
    static matchPrefix(blob, prefix) {
        return DefaultSDP.splitLines(blob).filter((line) => {
            return line.indexOf(prefix) === 0;
        });
    }
    lines() {
        return this.sdp.split(DefaultSDP.CRLF);
    }
    hasVideo() {
        return /^m=video/gm.exec(this.sdp) !== null;
    }
    hasCandidates() {
        const match = /a[=]candidate[:]/g.exec(this.sdp);
        if (match === null) {
            return false;
        }
        return true;
    }
    hasCandidatesForAllMLines() {
        const isAnyCLineUsingLocalHost = this.sdp.indexOf('c=IN IP4 0.0.0.0') > -1;
        const mLinesHaveCandidates = !isAnyCLineUsingLocalHost;
        return mLinesHaveCandidates;
    }
    withBundleAudioVideo() {
        const srcLines = this.lines();
        const dstLines = [];
        for (const line of srcLines) {
            const mod = line.replace(/^a=group:BUNDLE audio$/, 'a=group:BUNDLE audio video');
            if (mod !== line) {
                dstLines.push(mod);
                continue;
            }
            dstLines.push(line);
        }
        return DefaultSDP.linesToSDP(dstLines);
    }
    copyVideo(otherSDP) {
        const otherLines = otherSDP.split(DefaultSDP.CRLF);
        const dstLines = DefaultSDP.splitLines(this.sdp);
        let inVideoMedia = false;
        for (const line of otherLines) {
            if (/^m=video/.test(line)) {
                inVideoMedia = true;
            }
            else if (/^m=/.test(line)) {
                inVideoMedia = false;
            }
            if (inVideoMedia) {
                dstLines.push(line);
            }
        }
        return DefaultSDP.linesToSDP(dstLines);
    }
    withoutCandidateType(candidateTypeToExclude) {
        return DefaultSDP.linesToSDP(this.lines().filter(line => DefaultSDP.candidateType(line) !== candidateTypeToExclude));
    }
    withoutServerReflexiveCandidates() {
        return this.withoutCandidateType(SDPCandidateType_1.default.ServerReflexive);
    }
    withBandwidthRestriction(maxBitrateKbps, isUnifiedPlan) {
        const srcLines = this.lines();
        const dstLines = [];
        for (const line of srcLines) {
            dstLines.push(line);
            if (/^m=video/.test(line)) {
                if (isUnifiedPlan) {
                    dstLines.push(`b=TIAS:${maxBitrateKbps * 1000}`);
                }
                else {
                    dstLines.push(`b=AS:${maxBitrateKbps}`);
                }
            }
        }
        return DefaultSDP.linesToSDP(dstLines);
    }
    withAudioMaxAverageBitrate(maxAverageBitrate) {
        if (!maxAverageBitrate) {
            return this.clone();
        }
        maxAverageBitrate = Math.trunc(Math.min(Math.max(maxAverageBitrate, DefaultSDP.rfc7587LowestBitrate), DefaultSDP.rfc7587HighestBitrate));
        const srcLines = this.lines();
        const dstLines = [];
        const opusRtpMapRegex = /^a=rtpmap:\s*(\d+)\s+opus\/48000/;
        let lookingForOpusRtpMap = false;
        let fmtpAttribute = null;
        for (const line of srcLines) {
            if (line.startsWith('m=audio')) {
                lookingForOpusRtpMap = true;
                fmtpAttribute = null;
            }
            if (line.startsWith('m=video')) {
                lookingForOpusRtpMap = false;
                fmtpAttribute = null;
            }
            if (lookingForOpusRtpMap) {
                const match = opusRtpMapRegex.exec(line);
                if (match !== null) {
                    fmtpAttribute = `a=fmtp:${match[1]} `;
                    lookingForOpusRtpMap = false;
                }
            }
            if (fmtpAttribute && line.startsWith(fmtpAttribute)) {
                const oldParameters = line.slice(fmtpAttribute.length).split(';');
                const newParameters = [];
                for (const parameter of oldParameters) {
                    if (!parameter.startsWith('maxaveragebitrate=')) {
                        newParameters.push(parameter);
                    }
                }
                newParameters.push(`maxaveragebitrate=${maxAverageBitrate}`);
                dstLines.push(fmtpAttribute + newParameters.join(';'));
            }
            else {
                dstLines.push(line);
            }
        }
        return DefaultSDP.linesToSDP(dstLines);
    }
    // TODO: will remove this soon.
    withUnifiedPlanFormat() {
        let originalSdp = this.sdp;
        if (originalSdp.includes('mozilla')) {
            return this.clone();
        }
        else {
            originalSdp = originalSdp.replace('o=-', 'o=mozilla-chrome');
        }
        return new DefaultSDP(originalSdp);
    }
    preferH264IfExists() {
        const srcSDP = this.sdp;
        const sections = DefaultSDP.splitSections(srcSDP);
        if (sections.length < 2) {
            return new DefaultSDP(this.sdp);
        }
        const newSections = [];
        for (let i = 0; i < sections.length; i++) {
            if (/^m=video/.test(sections[i])) {
                const lines = DefaultSDP.splitLines(sections[i]);
                let payloadTypeForVP8 = 0;
                let payloadTypeForH264 = 0;
                lines.forEach(attribute => {
                    if (/^a=rtpmap:/.test(attribute)) {
                        const payloadMatch = /^a=rtpmap:([0-9]+)\s/.exec(attribute);
                        if (attribute.toLowerCase().includes('vp8')) {
                            payloadTypeForVP8 = parseInt(payloadMatch[1], 10);
                        }
                        else if (attribute.toLowerCase().includes('h264')) {
                            payloadTypeForH264 = parseInt(payloadMatch[1], 10);
                        }
                    }
                });
                // m=video 9 UDP/+++ <payload>
                if (payloadTypeForVP8 !== 0 && payloadTypeForH264 !== 0) {
                    const mline = lines[0].split(' ');
                    let indexForVP8 = -1;
                    let indexForH264 = -1;
                    for (let i = 3; i < mline.length; i++) {
                        const payload = parseInt(mline[i], 10);
                        if (payload === payloadTypeForVP8) {
                            indexForVP8 = i;
                        }
                        else if (payload === payloadTypeForH264) {
                            indexForH264 = i;
                        }
                    }
                    if (indexForVP8 < indexForH264) {
                        mline[indexForVP8] = payloadTypeForH264.toString();
                        mline[indexForH264] = payloadTypeForVP8.toString();
                    }
                    lines[0] = mline.join(' ');
                }
                sections[i] = lines.join(DefaultSDP.CRLF) + DefaultSDP.CRLF;
                // since there is only H264 or VP8, we don't switch payload places
            }
            newSections.push(sections[i]);
        }
        const newSdp = newSections.join('');
        return new DefaultSDP(newSdp);
    }
    withOldFashionedMungingSimulcast(videoSimulcastLayerCount) {
        if (videoSimulcastLayerCount < 2) {
            return this.clone();
        }
        const srcSDP = this.sdp;
        const sections = DefaultSDP.splitSections(srcSDP);
        if (sections.length < 2) {
            return new DefaultSDP(this.sdp);
        }
        const cameraLineIndex = DefaultSDP.findActiveCameraSection(sections);
        if (cameraLineIndex === -1) {
            return new DefaultSDP(this.sdp);
        }
        let cname = '';
        let msid = '';
        DefaultSDP.matchPrefix(sections[cameraLineIndex], 'a=ssrc:').forEach((line) => {
            const ssrcAttrTuple = DefaultSDP.parseSSRCMedia(line);
            if (ssrcAttrTuple[1] === 'cname') {
                cname = ssrcAttrTuple[2];
            }
            else if (ssrcAttrTuple[1] === 'msid') {
                msid = ssrcAttrTuple[2];
            }
        });
        const fidGroupMatch = DefaultSDP.matchPrefix(sections[cameraLineIndex], 'a=ssrc-group:FID ');
        if (cname === '' || msid === '' || fidGroupMatch.length < 1) {
            return new DefaultSDP(this.sdp);
        }
        const fidGroup = DefaultSDP.extractSSRCsFromFIDGroupLine(fidGroupMatch[0]);
        const cameraSectionLines = sections[cameraLineIndex]
            .trim()
            .split(DefaultSDP.CRLF)
            .filter((line) => {
            return line.indexOf('a=ssrc:') !== 0 && line.indexOf('a=ssrc-group:') !== 0;
        });
        const simulcastSSRCs = [];
        const [videoSSRC1, rtxSSRC1] = fidGroup.split(' ').map(ssrc => parseInt(ssrc, 10));
        let videoSSRC = videoSSRC1;
        let rtxSSRC = rtxSSRC1;
        for (let i = 0; i < videoSimulcastLayerCount; i++) {
            cameraSectionLines.push('a=ssrc:' + videoSSRC + ' cname:' + cname);
            cameraSectionLines.push('a=ssrc:' + videoSSRC + ' msid:' + msid);
            cameraSectionLines.push('a=ssrc:' + rtxSSRC + ' cname:' + cname);
            cameraSectionLines.push('a=ssrc:' + rtxSSRC + ' msid:' + msid);
            cameraSectionLines.push('a=ssrc-group:FID ' + videoSSRC + ' ' + rtxSSRC);
            simulcastSSRCs.push(videoSSRC);
            videoSSRC = videoSSRC + 1;
            rtxSSRC = videoSSRC + 1;
        }
        cameraSectionLines.push('a=ssrc-group:SIM ' + simulcastSSRCs.join(' '));
        sections[cameraLineIndex] = cameraSectionLines.join(DefaultSDP.CRLF) + DefaultSDP.CRLF;
        const newSDP = sections.join('');
        return new DefaultSDP(newSDP);
    }
    ssrcForVideoSendingSection() {
        const srcSDP = this.sdp;
        const sections = DefaultSDP.splitSections(srcSDP);
        if (sections.length < 2) {
            return '';
        }
        const cameraLineIndex = DefaultSDP.findActiveCameraSection(sections);
        if (cameraLineIndex === -1) {
            return '';
        }
        // TODO: match for Firefox. Currently all failures are not Firefox induced.
        const fidGroupMatch = DefaultSDP.matchPrefix(sections[cameraLineIndex], 'a=ssrc-group:FID ');
        if (fidGroupMatch.length < 1) {
            return '';
        }
        const fidGroup = DefaultSDP.extractSSRCsFromFIDGroupLine(fidGroupMatch[0]);
        const [videoSSRC1] = fidGroup.split(' ').map(ssrc => parseInt(ssrc, 10));
        return videoSSRC1.toString();
    }
    videoSendSectionHasDifferentSSRC(prevSdp) {
        const ssrc1 = this.ssrcForVideoSendingSection();
        const ssrc2 = prevSdp.ssrcForVideoSendingSection();
        if (ssrc1 === '' || ssrc2 === '') {
            return false;
        }
        const ssrc1InNumber = parseInt(ssrc1, 10);
        const ssrc2InNumber = parseInt(ssrc2, 10);
        if (ssrc1InNumber === ssrc2InNumber) {
            return false;
        }
        return true;
    }
}
exports.default = DefaultSDP;
DefaultSDP.CRLF = '\r\n';
DefaultSDP.rfc7587LowestBitrate = 6000;
DefaultSDP.rfc7587HighestBitrate = 510000;
//# sourceMappingURL=DefaultSDP.js.map