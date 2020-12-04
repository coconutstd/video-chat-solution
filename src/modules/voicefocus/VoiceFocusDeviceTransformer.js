"use strict";
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VoiceFocusDeviceTransformer = void 0;
const voicefocus_1 = require("../libs/voicefocus/voicefocus");
const Versioning_1 = require("../versioning/Versioning");
const LoggerAdapter_1 = require("./LoggerAdapter");
const VoiceFocusTransformDevice_1 = require("./VoiceFocusTransformDevice");
const VoiceFocusTransformDeviceDelegate_1 = require("./VoiceFocusTransformDeviceDelegate");
/**
 * `VoiceFocusDeviceTransformer` is used to create {@link VoiceFocusTransformDevice|transform devices}
 * that apply Amazon Voice Focus noise suppression to audio input.
 *
 * This transformer captures relevant configuration. You should check for support, initialize,
 * and then create a device as follows:
 *
 * ```
 * const deviceID = null;
 *
 * // This check for support is cheap and quick, and should be used to gate use
 * // of this feature.
 * if (!(await VoiceFocusDeviceTransformer.isSupported()) {
 *   console.log('Amazon Voice Focus not supported in this browser.');
 *   return deviceID;
 * }
 *
 * let transformer: VoiceFocusDeviceTransformer;
 * try {
 *   // This operation can fail in ways that do not indicate no support,
 *   // but do indicate an inability to apply Amazon Voice Focus. Trying again
 *   // might succeed.
 *   transformer = await VoiceFocusDeviceTransformer.create({});
 * } catch (e) {
 *   // Something went wrong.
 *   console.log('Unable to instantiate Amazon Voice Focus.');
 *   return deviceID;
 * }
 *
 * if (!transformer.isSupported()) {
 *   // The transformer will fall through, but your UI might care.
 *   console.log('Amazon Voice Focus not supported in this browser.');
 * }
 *
 * return await transformer.createTransformDevice(deviceID);
 * ```
 */
class VoiceFocusDeviceTransformer {
    constructor(spec, { preload = true, logger, fetchBehavior = VoiceFocusDeviceTransformer.defaultFetchBehavior(), }) {
        this.spec = spec;
        this.supported = true;
        this.logger = logger;
        this.vfLogger = logger ? new LoggerAdapter_1.default(logger) : undefined;
        this.preload = preload;
        this.fetchBehavior = fetchBehavior;
        // If the user didn't specify one, add the default, which is
        // identified by the major and minor SDK version.
        this.spec = VoiceFocusDeviceTransformer.augmentSpec(this.spec);
    }
    /**
     * Quickly check whether Amazon Voice Focus is supported on this platform.
     *
     * This will return `false` if key technologies are absent. A value of `true` does not
     * necessarily mean that adding Amazon Voice Focus will succeed: it is still possible that the
     * configuration of the page or the CPU speed of the device are limiting factors.
     *
     * `VoiceFocusDeviceTransformer.create` will return an instance whose `isSupported()`
     * method more accurately reflects whether Amazon Voice Focus is supported in the current environment.
     *
     * This method will only reject if you provide invalid inputs.
     *
     * @param spec An optional asset group and URL paths to use when fetching. You can pass
     *             a complete `VoiceFocusSpec` here for convenience, matching the signature of `create`.
     * @param options Additional named arguments, including `logger`.
     */
    static isSupported(spec, options) {
        const fetchBehavior = VoiceFocusDeviceTransformer.defaultFetchBehavior();
        const logger = (options === null || options === void 0 ? void 0 : options.logger) ? new LoggerAdapter_1.default(options.logger) : undefined;
        const opts = {
            fetchBehavior,
            logger,
        };
        return voicefocus_1.VoiceFocus.isSupported(VoiceFocusDeviceTransformer.augmentSpec(spec), opts);
    }
    /**
     * Create a transformer that can apply Amazon Voice Focus noise suppression to a device.
     *
     * This method will reject if the provided spec is invalid, or if the process of
     * checking for support or estimating fails (e.g., because the network is unreachable).
     *
     * If Amazon Voice Focus is not supported on this device, this call will not reject and
     * `isSupported()` will return `false` on the returned instance. That instance will
     * pass through devices unmodified.
     *
     * @param spec A definition of how you want Amazon Voice Focus to behave. See the declaration of
     *             {@link VoiceFocusSpec}` for details.
     * @param options Additional named arguments, including `logger` and `preload`.
     */
    static create(spec = {}, options = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const transformer = new VoiceFocusDeviceTransformer(spec, options);
            // This also preps the first VoiceFocus instance.
            yield transformer.init();
            return transformer;
        });
    }
    /**
     * Return whether this transformer is able to function in this environment.
     * If not, calls to
     * {@link VoiceFocusDeviceTransformer.createTransformDevice|createTransformDevice}`
     * will pass through an unmodified device.
     */
    isSupported() {
        return this.supported;
    }
    /**
     * Apply Amazon Voice Focus to the selected {@link Device}.
     *
     * If this is a stream, it should be one that does not include other noise suppression features,
     * and you should consider whether to disable automatic gain control (AGC) on the stream, because
     * it can interact with noise suppression.
     *
     * @returns a device promise. This will always resolve to either a
     *          {@link VoiceFocusTransformDevice} or undefined; it will never reject.
     */
    createTransformDevice(device, nodeOptions) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.supported) {
                // Fall back.
                return undefined;
            }
            /* istanbul ignore catch */
            try {
                const preload = true;
                const [vf, delegate] = yield this.allocateVoiceFocus(preload);
                return new VoiceFocusTransformDevice_1.default(device, vf, delegate, nodeOptions);
            }
            catch (e) {
                // Fall back.
                /* istanbul ignore next */
                return undefined;
            }
        });
    }
    static augmentSpec(spec) {
        if (!spec || (!spec.assetGroup && !spec.revisionID)) {
            return Object.assign(Object.assign({}, spec), { assetGroup: VoiceFocusDeviceTransformer.currentSDKAssetGroup() });
        }
        return spec;
    }
    configure() {
        return __awaiter(this, void 0, void 0, function* () {
            const options = {
                fetchBehavior: this.fetchBehavior,
                logger: this.vfLogger,
            };
            return voicefocus_1.VoiceFocus.configure(this.spec, options);
        });
    }
    init() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            this.configuration = this.configure();
            const config = yield this.configuration;
            if (!config.supported) {
                // No need to init: it won't work.
                this.supported = false;
                return;
            }
            // We initialize the first one right now, which makes it easier to detect
            // possible failures.
            // This can throw for malformed input. Pass that up the chain.
            this.pendingVoiceFocus = this.createVoiceFocus(config, this.preload);
            try {
                yield this.pendingVoiceFocus;
            }
            catch (e) {
                (_a = this.logger) === null || _a === void 0 ? void 0 : _a.error(`Unable to initialize Amazon Voice Focus: ${e}`);
                this.supported = false;
            }
        });
    }
    createVoiceFocus(config, preload) {
        return __awaiter(this, void 0, void 0, function* () {
            const delegate = new VoiceFocusTransformDeviceDelegate_1.default();
            const vf = yield voicefocus_1.VoiceFocus.init(config, { delegate, preload, logger: this.vfLogger });
            return [vf, delegate];
        });
    }
    allocateVoiceFocus(preload) {
        return __awaiter(this, void 0, void 0, function* () {
            // A little safety.
            /* istanbul ignore next */
            if (!this.supported) {
                throw new Error('Not supported.');
            }
            if (this.pendingVoiceFocus) {
                // Use the one we already have, and free the slot for any future execution.
                const vf = this.pendingVoiceFocus;
                this.pendingVoiceFocus = undefined;
                return vf;
            }
            return this.createVoiceFocus(yield this.configuration, preload);
        });
    }
    static majorVersion() {
        return Versioning_1.default.sdkVersion.match(/^[1-9][0-9]*\.(?:0|[1-9][0-9]*)/)[0];
    }
    static majorMinorVersion() {
        return Versioning_1.default.sdkVersion.match(/^[1-9][0-9]*\.(?:0|(?:[1-9][0-9]*))\.(?:0|[1-9][0-9]*)/)[0];
    }
    static currentSDKAssetGroup() {
        // Just on the off chance someone does something silly, handle
        // malformed version strings here.
        const v = this.majorVersion();
        // Just a little safety.
        /* istanbul ignore next */
        if (!v) {
            return `stable-v1`;
        }
        return `sdk-${v}`;
    }
    // Note that we use query strings here, not headers, in order to make these requests 'simple' and
    // avoid the need for CORS preflights.
    // Be very, very careful if you choose to add headers here. You should never need to.
    static defaultFetchBehavior() {
        // Just a little safety.
        /* istanbul ignore next */
        const version = VoiceFocusDeviceTransformer.majorMinorVersion() || 'unknown';
        const ua = Versioning_1.default.sdkUserAgentLowResolution;
        return {
            escapedQueryString: `sdk=${encodeURIComponent(version)}&ua=${encodeURIComponent(ua)}`,
        };
    }
}
exports.VoiceFocusDeviceTransformer = VoiceFocusDeviceTransformer;
exports.default = VoiceFocusDeviceTransformer;
//# sourceMappingURL=VoiceFocusDeviceTransformer.js.map
