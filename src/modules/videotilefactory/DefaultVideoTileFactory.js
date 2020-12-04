"use strict";
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
const DefaultVideoTile_1 = require("../videotile/DefaultVideoTile");
class DefaultVideoTileFactory {
    makeTile(tileId, localTile, tileController, devicePixelRatioMonitor) {
        return new DefaultVideoTile_1.default(tileId, localTile, tileController, devicePixelRatioMonitor);
    }
}
exports.default = DefaultVideoTileFactory;
//# sourceMappingURL=DefaultVideoTileFactory.js.map