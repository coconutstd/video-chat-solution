"use strict";
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
/*
 * [[SignalingClientConnectionRequest]] represents an connection request.
 */
class SignalingClientConnectionRequest {
    /** Creates a request with the given URL, conference id, and join token.
     *
     * @param {string} signalingURL The URL of the signaling proxy.
     * @param {string} joinToken The join token that will authenticate the connection.
     */
    constructor(signalingURL, joinToken) {
        this.signalingURL = signalingURL;
        this.joinToken = joinToken;
    }
    /** Gets the signaling URL representing this request.*/
    url() {
        return (this.signalingURL + '?X-Chime-Control-Protocol-Version=3&X-Amzn-Chime-Send-Close-On-Error=1');
    }
    /** Gets the protocols associated with this request.*/
    protocols() {
        return ['_aws_wt_session', this.joinToken];
    }
}
exports.default = SignalingClientConnectionRequest;
//# sourceMappingURL=SignalingClientConnectionRequest.js.map