"use strict";
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
const Versioning_1 = require("../versioning/Versioning");
class DefaultSigV4 {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
    constructor(chimeClient, awsClient) {
        this.chimeClient = chimeClient;
        this.awsClient = awsClient;
    }
    makeTwoDigits(n) {
        if (n > 9) {
            return n.toString();
        }
        else {
            return '0' + n.toString();
        }
    }
    getDateTimeString() {
        const d = new Date();
        return (d.getUTCFullYear() +
            this.makeTwoDigits(d.getUTCMonth() + 1) +
            this.makeTwoDigits(d.getUTCDate()) +
            'T' +
            this.makeTwoDigits(d.getUTCHours()) +
            this.makeTwoDigits(d.getUTCMinutes()) +
            this.makeTwoDigits(d.getUTCSeconds()) +
            'Z');
    }
    getDateString(dateTimeString) {
        return dateTimeString.substring(0, dateTimeString.indexOf('T'));
    }
    getSignatureKey(key, date, regionName, serviceName) {
        const kDate = this.awsClient.util.crypto.hmac('AWS4' + key, date, 'buffer');
        const kRegion = this.awsClient.util.crypto.hmac(kDate, regionName, 'buffer');
        const kService = this.awsClient.util.crypto.hmac(kRegion, serviceName, 'buffer');
        const kSigning = this.awsClient.util.crypto.hmac(kService, 'aws4_request', 'buffer');
        return kSigning;
    }
    signURL(method, scheme, serviceName, hostname, path, payload, queryParams) {
        const now = this.getDateTimeString();
        const today = this.getDateString(now);
        const algorithm = 'AWS4-HMAC-SHA256';
        const region = this.chimeClient.config.region;
        const signedHeaders = 'host';
        const canonicalHeaders = 'host:' + hostname.toLowerCase() + '\n';
        const credentialScope = today + '/' + region + '/' + serviceName + '/' + 'aws4_request';
        const credentials = this.chimeClient.config.credentials;
        let params = new Map();
        params.set('X-Amz-Algorithm', [algorithm]);
        params.set('X-Amz-Credential', [
            encodeURIComponent(credentials.accessKeyId + '/' + credentialScope),
        ]);
        params.set('X-Amz-Date', [now]);
        params.set('X-Amz-Expires', ['10']);
        params.set('X-Amz-SignedHeaders', ['host']);
        if (credentials.sessionToken) {
            params.set('X-Amz-Security-Token', [encodeURIComponent(credentials.sessionToken)]);
        }
        params.set(Versioning_1.default.X_AMZN_VERSION, [encodeURIComponent(Versioning_1.default.sdkVersion)]);
        params.set(Versioning_1.default.X_AMZN_USER_AGENT, [
            encodeURIComponent(Versioning_1.default.sdkUserAgentLowResolution),
        ]);
        queryParams === null || queryParams === void 0 ? void 0 : queryParams.forEach((values, key) => {
            const encodedKey = encodeURIComponent(key);
            values.sort().forEach((value) => {
                if (!params.has(encodedKey)) {
                    params.set(encodedKey, []);
                }
                params.get(encodedKey).push(encodeURIComponent(value));
            });
        });
        let canonicalQuerystring = '';
        params = new Map([...params.entries()].sort());
        params.forEach((values, key) => {
            values.forEach(value => {
                if (canonicalQuerystring.length) {
                    canonicalQuerystring += '&';
                }
                canonicalQuerystring += key + '=' + value;
            });
        });
        const canonicalRequest = method +
            '\n' +
            path +
            '\n' +
            canonicalQuerystring +
            '\n' +
            canonicalHeaders +
            '\n' +
            signedHeaders +
            '\n' +
            this.awsClient.util.crypto.sha256(payload, 'hex');
        const hashedCanonicalRequest = this.awsClient.util.crypto.sha256(canonicalRequest, 'hex');
        const stringToSign = 'AWS4-HMAC-SHA256\n' +
            now +
            '\n' +
            today +
            '/' +
            region +
            '/' +
            serviceName +
            '/aws4_request\n' +
            hashedCanonicalRequest;
        const signingKey = this.getSignatureKey(credentials.secretAccessKey, today, region, serviceName);
        const signature = this.awsClient.util.crypto.hmac(signingKey, stringToSign, 'hex');
        const finalParams = canonicalQuerystring + '&X-Amz-Signature=' + signature;
        return scheme + '://' + hostname + path + '?' + finalParams;
    }
}
exports.default = DefaultSigV4;
//# sourceMappingURL=DefaultSigV4.js.map