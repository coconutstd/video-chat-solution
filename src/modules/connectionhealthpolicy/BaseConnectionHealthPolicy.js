"use strict";
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
class BaseConnectionHealthPolicy {
    constructor(configuration, data) {
        this.minHealth = configuration.minHealth;
        this.maxHealth = configuration.maxHealth;
        this.currentHealth = configuration.initialHealth;
        this.currentData = data.clone();
    }
    minimumHealth() {
        return this.minHealth;
    }
    maximumHealth() {
        return this.maxHealth;
    }
    health() {
        return this.maximumHealth();
    }
    update(connectionHealthData) {
        this.currentData = connectionHealthData;
    }
    getConnectionHealthData() {
        return this.currentData.clone();
    }
    healthy() {
        return this.health() > this.minimumHealth();
    }
    healthIfChanged() {
        const newHealth = this.health();
        if (newHealth !== this.currentHealth) {
            this.currentHealth = newHealth;
            return newHealth;
        }
        return null;
    }
}
exports.default = BaseConnectionHealthPolicy;
//# sourceMappingURL=BaseConnectionHealthPolicy.js.map