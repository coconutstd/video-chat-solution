"use strict";
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
const ContentShareConstants_1 = require("../contentsharecontroller/ContentShareConstants");
class DefaultModality {
    constructor(_id) {
        this._id = _id;
    }
    id() {
        return this._id;
    }
    base() {
        if (!this._id) {
            return '';
        }
        return this._id.split(DefaultModality.MODALITY_SEPARATOR)[0];
    }
    modality() {
        if (!this._id) {
            return '';
        }
        const components = this._id.split(DefaultModality.MODALITY_SEPARATOR);
        if (components.length === 2) {
            return components[1];
        }
        return '';
    }
    hasModality(modality) {
        return modality !== '' && this.modality() === modality;
    }
    withModality(modality) {
        const m = new DefaultModality(this.base() + DefaultModality.MODALITY_SEPARATOR + modality);
        if (modality === '' ||
            this.base() === '' ||
            new DefaultModality(m._id).modality() !== modality) {
            return new DefaultModality(this.base());
        }
        return m;
    }
}
exports.default = DefaultModality;
DefaultModality.MODALITY_SEPARATOR = ContentShareConstants_1.default.Modality[0];
DefaultModality.MODALITY_CONTENT = ContentShareConstants_1.default.Modality.substr(1);
//# sourceMappingURL=DefaultModality.js.map