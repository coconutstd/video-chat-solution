"use strict";
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
exports.SimulcastLayers = void 0;
/**
 * [[SimulcastLayers]] represents simulcast layers for selected simulcast video streams.
 */
var SimulcastLayers;
(function (SimulcastLayers) {
    /**
     * Low resolution video stream.
     */
    SimulcastLayers[SimulcastLayers["Low"] = 0] = "Low";
    /**
     * Low and medium resolution video streams.
     */
    SimulcastLayers[SimulcastLayers["LowAndMedium"] = 1] = "LowAndMedium";
    /**
     * Low and high resolution video streams.
     */
    SimulcastLayers[SimulcastLayers["LowAndHigh"] = 2] = "LowAndHigh";
    /**
     * Medium resolution video stream.
     */
    SimulcastLayers[SimulcastLayers["Medium"] = 3] = "Medium";
    /**
     * Medium and high resolution video streams.
     */
    SimulcastLayers[SimulcastLayers["MediumAndHigh"] = 4] = "MediumAndHigh";
    /**
     * High resolution video stream.
     */
    SimulcastLayers[SimulcastLayers["High"] = 5] = "High";
})(SimulcastLayers = exports.SimulcastLayers || (exports.SimulcastLayers = {}));
exports.default = SimulcastLayers;
//# sourceMappingURL=SimulcastLayers.js.map