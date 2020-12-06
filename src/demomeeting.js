var VueDom = this
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var exports = {};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DemoMeetingApp = exports.ContentShareType = void 0;
console.log(exports);
require("bootstrap");
const index_1 = require("./modules/index.js");
const WebRTCStatsCollector_1 = require("./modules/webrtcstatscollector/WebRTCStatsCollector.js");
class DemoTileOrganizer {
    constructor() {
        this.tiles = {};
        this.tileStates = {};
        this.remoteTileCount = 0;
    }
    acquireTileIndex(tileId) {
        for (let index = 0; index <= DemoTileOrganizer.MAX_TILES; index++) {
            if (this.tiles[index] === tileId) {
                return index;
            }
        }
        for (let index = 0; index <= DemoTileOrganizer.MAX_TILES; index++) {
            if (!(index in this.tiles)) {
                this.tiles[index] = tileId;
                this.remoteTileCount++;
                return index;
            }
        }
        throw new Error('no tiles are available');
    }
    releaseTileIndex(tileId) {
        for (let index = 0; index <= DemoTileOrganizer.MAX_TILES; index++) {
            if (this.tiles[index] === tileId) {
                this.remoteTileCount--;
                delete this.tiles[index];
                return index;
            }
        }
        return DemoTileOrganizer.MAX_TILES;
    }
}
// this is index instead of length
DemoTileOrganizer.MAX_TILES = 17;
// Support a set of query parameters to allow for testing pre-release versions of
// Amazon Voice Focus. If none of these parameters are supplied, the SDK default
// values will be used.
const search = new URLSearchParams(document.location.search);
const VOICE_FOCUS_CDN = search.get('voiceFocusCDN') || undefined;
const VOICE_FOCUS_ASSET_GROUP = search.get('voiceFocusAssetGroup') || undefined;
const VOICE_FOCUS_REVISION_ID = search.get('voiceFocusRevisionID') || undefined;
const VOICE_FOCUS_PATHS = VOICE_FOCUS_CDN && {
    processors: `${VOICE_FOCUS_CDN}processors/`,
    wasm: `${VOICE_FOCUS_CDN}wasm/`,
    workers: `${VOICE_FOCUS_CDN}workers/`,
    models: `${VOICE_FOCUS_CDN}wasm/`,
};
const VOICE_FOCUS_SPEC = {
    assetGroup: VOICE_FOCUS_ASSET_GROUP,
    revisionID: VOICE_FOCUS_REVISION_ID,
    paths: VOICE_FOCUS_PATHS,
};
class TestSound {
    constructor(logger, sinkId, frequency = 440, durationSec = 1, rampSec = 0.1, maxGainValue = 0.1) {
        this.logger = logger;
        this.sinkId = sinkId;
        this.frequency = frequency;
        this.durationSec = durationSec;
        this.rampSec = rampSec;
        this.maxGainValue = maxGainValue;
    }
    init() {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            // @ts-ignore
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const gainNode = audioContext.createGain();
            gainNode.gain.value = 0;
            const oscillatorNode = audioContext.createOscillator();
            oscillatorNode.frequency.value = this.frequency;
            oscillatorNode.connect(gainNode);
            const destinationStream = audioContext.createMediaStreamDestination();
            gainNode.connect(destinationStream);
            const currentTime = audioContext.currentTime;
            const startTime = currentTime + 0.1;
            gainNode.gain.linearRampToValueAtTime(0, startTime);
            gainNode.gain.linearRampToValueAtTime(this.maxGainValue, startTime + this.rampSec);
            gainNode.gain.linearRampToValueAtTime(this.maxGainValue, startTime + this.rampSec + this.durationSec);
            gainNode.gain.linearRampToValueAtTime(0, startTime + this.rampSec * 2 + this.durationSec);
            oscillatorNode.start();
            const audioMixController = new index_1.DefaultAudioMixController(this.logger);
            try {
                // @ts-ignore
                yield audioMixController.bindAudioDevice({ deviceId: this.sinkId });
            }
            catch (e) {
                (_a = this.logger) === null || _a === void 0 ? void 0 : _a.error(`Failed to bind audio device: ${e}`);
            }
            try {
                yield audioMixController.bindAudioElement(new Audio());
            }
            catch (e) {
                (_b = this.logger) === null || _b === void 0 ? void 0 : _b.error(`Failed to bind audio element: ${e}`);
            }
            yield audioMixController.bindAudioStream(destinationStream.stream);
            new index_1.TimeoutScheduler((this.rampSec * 2 + this.durationSec + 1) * 1000).start(() => {
                audioContext.close();
            });
        });
    }
}
var ContentShareType;
(function (ContentShareType) {
    ContentShareType[ContentShareType["ScreenCapture"] = 0] = "ScreenCapture";
    ContentShareType[ContentShareType["VideoFile"] = 1] = "VideoFile";
})(ContentShareType = exports.ContentShareType || (exports.ContentShareType = {}));
;
const SimulcastLayerMapping = {
    [index_1.SimulcastLayers.Low]: 'Low',
    [index_1.SimulcastLayers.LowAndMedium]: 'Low and Medium',
    [index_1.SimulcastLayers.LowAndHigh]: 'Low and High',
    [index_1.SimulcastLayers.Medium]: 'Medium',
    [index_1.SimulcastLayers.MediumAndHigh]: 'Medium and High',
    [index_1.SimulcastLayers.High]: 'High'
};
export class DemoMeetingApp {

    constructor() {
        this.showActiveSpeakerScores = false;
        this.activeSpeakerLayout = true;
        this.meeting = null;
        this.name = null;
        this.voiceConnectorId = null;
        this.sipURI = null;
        this.region = null;
        this.meetingSession = null;
        this.audioVideo = null;
        this.tileOrganizer = new DemoTileOrganizer();
        this.canStartLocalVideo = true;
        this.defaultBrowserBehaviour = new index_1.DefaultBrowserBehavior();
        // eslint-disable-next-line
        this.roster = {};
        this.tileIndexToTileId = {};
        this.tileIdToTileIndex = {};
        this.tileArea = document.getElementById('tile-area');
        this.cameraDeviceIds = [];
        this.microphoneDeviceIds = [];
        this.buttonStates = {
            'button-microphone': true,
            'button-camera': false,
            'button-speaker': true,
            'button-content-share': false,
            'button-pause-content-share': false,
            'button-video-stats': false,
        };
        this.contentShareType = ContentShareType.ScreenCapture;
        // feature flags
        this.enableWebAudio = false;
        this.enableUnifiedPlanForChromiumBasedBrowsers = true;
        this.enableSimulcast = false;
        this.supportsVoiceFocus = false;
        this.enableVoiceFocus = false;
        this.voiceFocusIsActive = false;
        this.markdown = require('markdown-it')({ linkify: true });
        this.lastMessageSender = null;
        this.lastReceivedMessageTimestamp = 0;
        this.hasChromiumWebRTC = this.defaultBrowserBehaviour.hasChromiumWebRTC();
        this.statsCollector = new WebRTCStatsCollector_1.default();
        // This is an extremely minimal reactive programming approach: these elements
        // will be updated when the Amazon Voice Focus display state changes.
        this.voiceFocusDisplayables = [];
        this.analyserNodeCallback = () => { };
        this.selectedVideoInput = null;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        global.app = this;

        // VueDom.$refs['sdk-version'].innerText =
        //     "amazon-chime-sdk-js@" + index_1.Versioning.sdkVersion;
        this.initEventListeners();
        this.initParameters();
        this.setMediaRegion();
        this.setUpVideoTileElementResizer();
        if (this.isRecorder() || this.isBroadcaster()) {
            new index_1.AsyncScheduler().start(() => __awaiter(this, void 0, void 0, function* () {
                this.meeting = new URL(window.location.href).searchParams.get('m');
                this.name = this.isRecorder() ? '«Meeting Recorder»' : '«Meeting Broadcaster»';
                yield this.authenticate();
                yield this.join();
                this.displayButtonStates();
                console.log('flow-meeing!');
                this.switchToFlow('flow-meeting');
            }));
        }
        else {
            this.switchToFlow('flow-authenticate');
        }
    }
    initParameters() {
        const meeting = new URL(window.location.href).searchParams.get('m');
        if (meeting) {
            document.getElementById('inputMeeting').value = meeting;
            document.getElementById('inputName').focus();
        }
        else {
            document.getElementById('inputMeeting').focus();
        }
    }
    initVoiceFocus() {
        return __awaiter(this, void 0, void 0, function* () {
            const logger = new index_1.ConsoleLogger('SDK', index_1.LogLevel.DEBUG);
            if (!this.enableWebAudio) {
                logger.info('[DEMO] Web Audio not enabled. Not checking for Amazon Voice Focus support.');
                return;
            }
            try {
                this.supportsVoiceFocus = yield index_1.VoiceFocusDeviceTransformer.isSupported(VOICE_FOCUS_SPEC, { logger });
                if (this.supportsVoiceFocus) {
                    this.voiceFocusTransformer = yield this.getVoiceFocusDeviceTransformer();
                    this.supportsVoiceFocus = this.voiceFocusTransformer && this.voiceFocusTransformer.isSupported();
                    if (this.supportsVoiceFocus) {
                        logger.info('[DEMO] Amazon Voice Focus is supported.');
                        document.getElementById('voice-focus-setting').classList.remove('hidden');
                        yield this.populateAllDeviceLists();
                        return;
                    }
                }
            }
            catch (e) {
                // Fall through.
                logger.warn(`[DEMO] Does not support Amazon Voice Focus: ${e.message}`);
            }
            logger.warn('[DEMO] Does not support Amazon Voice Focus.');
            this.supportsVoiceFocus = false;
            document.getElementById('voice-focus-setting').classList.toggle('hidden', true);
            yield this.populateAllDeviceLists();
        });
    }
    onVoiceFocusSettingChanged() {
        return __awaiter(this, void 0, void 0, function* () {
            this.log('[DEMO] Amazon Voice Focus setting toggled to', this.enableVoiceFocus);
            this.openAudioInputFromSelectionAndPreview();
        });
    }
    initEventListeners() {
        console.log("init Event Listners")
        // if (!this.defaultBrowserBehaviour.hasChromiumWebRTC()) {
        //   document.getElementById('simulcast').disabled = true;
        //   document.getElementById('planB').disabled = true;
        // }
        document.getElementById('form-authenticate').addEventListener('submit', e => {
            e.preventDefault();
            this.meeting = document.getElementById('inputMeeting').value;
            this.name = document.getElementById('inputName').value;
            this.region = document.getElementById('inputRegion').value;
            this.enableSimulcast = document.getElementById('simulcast').checked;
            if (this.enableSimulcast) {
                const videoInputQuality = document.getElementById('video-input-quality');
                videoInputQuality.value = '720p';
            }
            this.enableWebAudio = document.getElementById('webaudio').checked;
            // js sdk default to enable unified plan, equivalent to "Disable Unified Plan" default unchecked
            this.enableUnifiedPlanForChromiumBasedBrowsers = !document.getElementById('planB').checked;
            new index_1.AsyncScheduler().start(() => __awaiter(this, void 0, void 0, function* () {
                let chimeMeetingId = '';
                this.showProgress('progress-authenticate');
                try {
                    chimeMeetingId = yield this.authenticate();
                }
                catch (error) {
                    console.error(error);
                    const httpErrorMessage = 'UserMedia is not allowed in HTTP sites. Either use HTTPS or enable media capture on insecure sites.';
                    document.getElementById('failed-meeting').innerText = `Meeting ID: ${this.meeting}`;
                    document.getElementById('failed-meeting-error').innerText =
                        window.location.protocol === 'http:' ? httpErrorMessage : error.message;
                    this.switchToFlow('flow-failed-meeting');
                    return;
                }
                document.getElementById('meeting-id').innerText = `${this.meeting} (${this.region})`;
                document.getElementById('chime-meeting-id').innerText = `Meeting ID: ${chimeMeetingId}`;
                document.getElementById('mobile-chime-meeting-id').innerText = `Meeting ID: ${chimeMeetingId}`;
                document.getElementById('mobile-attendee-id').innerText = `Attendee ID: ${this.meetingSession.configuration.credentials.attendeeId}`;
                document.getElementById('desktop-attendee-id').innerText = `Attendee ID: ${this.meetingSession.configuration.credentials.attendeeId}`;
                document.getElementById('info-meeting').innerText = this.meeting;
                document.getElementById('info-name').innerText = this.name;
                yield this.initVoiceFocus();
                this.switchToFlow('flow-devices');
                yield this.openAudioInputFromSelectionAndPreview();
                try {
                    yield this.openVideoInputFromSelection(document.getElementById('video-input').value, true);
                }
                catch (err) {
                    this.log('no video input device selected');
                }
                yield this.openAudioOutputFromSelection();
                this.hideProgress('progress-authenticate');
            }));
        });
        const speechMonoCheckbox = document.getElementById('fullband-speech-mono-quality');
        const musicMonoCheckbox = document.getElementById('fullband-music-mono-quality');
        speechMonoCheckbox.addEventListener('change', e => {
            if (speechMonoCheckbox.checked) {
                musicMonoCheckbox.checked = false;
            }
        });
        musicMonoCheckbox.addEventListener('change', e => {
            if (musicMonoCheckbox.checked) {
                speechMonoCheckbox.checked = false;
            }
        });
        document.getElementById('to-sip-flow').addEventListener('click', e => {
            e.preventDefault();
            this.switchToFlow('flow-sip-authenticate');
        });
        document.getElementById('form-sip-authenticate').addEventListener('submit', e => {
            e.preventDefault();
            this.meeting = document.getElementById('sip-inputMeeting').value;
            this.voiceConnectorId = document.getElementById('voiceConnectorId').value;
            new index_1.AsyncScheduler().start(() => __awaiter(this, void 0, void 0, function* () {
                this.showProgress('progress-authenticate');
                const region = this.region || 'us-east-1';
                try {
                    const response = yield fetch(`${DemoMeetingApp.BASE_URL}join?title=${encodeURIComponent(this.meeting)}&name=${encodeURIComponent(DemoMeetingApp.DID)}&region=${encodeURIComponent(region)}`, {
                        method: 'POST',
                    });
                    const json = yield response.json();
                    const joinToken = json.JoinInfo.Attendee.Attendee.JoinToken;
                    this.sipURI = `sip:${DemoMeetingApp.DID}@${this.voiceConnectorId};transport=tls;X-joinToken=${joinToken}`;
                    this.switchToFlow('flow-sip-uri');
                }
                catch (error) {
                    document.getElementById('failed-meeting').innerText = `Meeting ID: ${this.meeting}`;
                    document.getElementById('failed-meeting-error').innerText =
                        error.message;
                    this.switchToFlow('flow-failed-meeting');
                    return;
                }
                const sipUriElement = document.getElementById('sip-uri');
                sipUriElement.value = this.sipURI;
                this.hideProgress('progress-authenticate');
            }));
        });
        document.getElementById('copy-sip-uri').addEventListener('click', () => {
            const sipUriElement = document.getElementById('sip-uri');
            sipUriElement.select();
            document.execCommand('copy');
        });
        const audioInput = document.getElementById('audio-input');
        audioInput.addEventListener('change', (_ev) => __awaiter(this, void 0, void 0, function* () {
            this.log('audio input device is changed');
            yield this.openAudioInputFromSelectionAndPreview();
        }));
        const videoInput = document.getElementById('video-input');
        videoInput.addEventListener('change', (_ev) => __awaiter(this, void 0, void 0, function* () {
            this.log('video input device is changed');
            try {
                yield this.openVideoInputFromSelection(videoInput.value, true);
            }
            catch (err) {
                this.log('no video input device selected');
            }
        }));
        const videoInputQuality = document.getElementById('video-input-quality');
        videoInputQuality.addEventListener('change', (_ev) => __awaiter(this, void 0, void 0, function* () {
            this.log('Video input quality is changed');
            switch (videoInputQuality.value) {
                case '360p':
                    this.audioVideo.chooseVideoInputQuality(640, 360, 15, 600);
                    break;
                case '540p':
                    this.audioVideo.chooseVideoInputQuality(960, 540, 15, 1400);
                    break;
                case '720p':
                    this.audioVideo.chooseVideoInputQuality(1280, 720, 15, 1400);
                    break;
            }
            try {
                yield this.openVideoInputFromSelection(videoInput.value, true);
            }
            catch (err) {
                this.log('no video input device selected');
            }
        }));
        const audioOutput = document.getElementById('audio-output');
        audioOutput.addEventListener('change', (_ev) => __awaiter(this, void 0, void 0, function* () {
            this.log('audio output device is changed');
            yield this.openAudioOutputFromSelection();
        }));
        document.getElementById('button-test-sound').addEventListener('click', (e) => __awaiter(this, void 0, void 0, function* () {
            e.preventDefault();
            const audioOutput = document.getElementById('audio-output');
            const testSound = new TestSound(this.meetingEventPOSTLogger, audioOutput.value);
            yield testSound.init();
        }));
        document.getElementById('form-devices').addEventListener('submit', e => {
            e.preventDefault();
            new index_1.AsyncScheduler().start(() => __awaiter(this, void 0, void 0, function* () {
                try {
                    console.log('hello 1');
                    this.showProgress('progress-join');
                    console.log('hello 2');
                    yield this.stopAudioPreview();
                    console.log('hello 3');
                    this.audioVideo.stopVideoPreviewForVideoInput(document.getElementById('video-preview'));
                    console.log('hello 4');
                    yield this.join();
                    console.log('hello 5');
                    this.audioVideo.chooseVideoInputDevice(null);
                    console.log('hello 6');
                    this.hideProgress('progress-join');
                    console.log('hello 7');
                    // this.displayButtonStates();
                    console.log('hello 8');
                    this.switchToFlow('flow-meeting');
                }
                catch (error) {
                    document.getElementById('failed-join').innerText = `Meeting ID: ${this.meeting}`;
                    document.getElementById('failed-join-error').innerText = `Error: ${error.message}`;
                }
            }));
        });
        document.getElementById('add-voice-focus').addEventListener('change', e => {
            this.enableVoiceFocus = e.target.checked;
            this.onVoiceFocusSettingChanged();
        });
        const buttonMute = document.getElementById('button-microphone');
        buttonMute.addEventListener('mousedown', _e => {
            if (this.toggleButton('button-microphone')) {
                this.audioVideo.realtimeUnmuteLocalAudio();
            }
            else {
                this.audioVideo.realtimeMuteLocalAudio();
            }
        });
        const buttonVideo = document.getElementById('button-camera');
        buttonVideo.addEventListener('click', _e => {
            new index_1.AsyncScheduler().start(() => __awaiter(this, void 0, void 0, function* () {
                if (this.toggleButton('button-camera') && this.canStartLocalVideo) {
                    try {
                        let camera = videoInput.value;
                        if (videoInput.value === 'None') {
                            camera = this.cameraDeviceIds.length ? this.cameraDeviceIds[0] : 'None';
                        }
                        yield this.openVideoInputFromSelection(camera, false);
                        this.audioVideo.startLocalVideoTile();
                    }
                    catch (err) {
                        this.log('no video input device selected');
                    }
                }
                else {
                    this.audioVideo.stopLocalVideoTile();
                    this.hideTile(DemoTileOrganizer.MAX_TILES);
                }
            }));
        });
        const buttonPauseContentShare = document.getElementById('button-pause-content-share');
        buttonPauseContentShare.addEventListener('click', _e => {
            if (!this.isButtonOn('button-content-share')) {
                return;
            }
            new index_1.AsyncScheduler().start(() => __awaiter(this, void 0, void 0, function* () {
                if (this.toggleButton('button-pause-content-share')) {
                    this.audioVideo.pauseContentShare();
                }
                else {
                    this.audioVideo.unpauseContentShare();
                }
            }));
        });
        const buttonContentShare = document.getElementById('button-content-share');
        buttonContentShare.addEventListener('click', _e => {
            new index_1.AsyncScheduler().start(() => {
                if (!this.isButtonOn('button-content-share')) {
                    this.contentShareStart();
                }
                else {
                    this.contentShareStop();
                }
            });
        });
        const buttonSpeaker = document.getElementById('button-speaker');
        buttonSpeaker.addEventListener('click', _e => {
            new index_1.AsyncScheduler().start(() => __awaiter(this, void 0, void 0, function* () {
                if (this.toggleButton('button-speaker')) {
                    try {
                        yield this.audioVideo.bindAudioElement(document.getElementById('meeting-audio'));
                    }
                    catch (e) {
                        this.log('Failed to bindAudioElement', e);
                    }
                }
                else {
                    this.audioVideo.unbindAudioElement();
                }
            }));
        });
        const buttonVideoStats = document.getElementById('button-video-stats');
        buttonVideoStats.addEventListener('click', () => {
            if (this.isButtonOn('button-video-stats')) {
                document.querySelectorAll('.stats-info').forEach(e => e.remove());
            }
            this.toggleButton('button-video-stats');
        });
        const sendMessage = () => {
            new index_1.AsyncScheduler().start(() => {
                const textArea = document.getElementById('send-message');
                const textToSend = textArea.value.trim();
                if (!textToSend) {
                    return;
                }
                textArea.value = '';
                this.audioVideo.realtimeSendDataMessage(DemoMeetingApp.DATA_MESSAGE_TOPIC, textToSend, DemoMeetingApp.DATA_MESSAGE_LIFETIME_MS);
                // echo the message to the handler
                this.dataMessageHandler(new index_1.DataMessage(Date.now(), DemoMeetingApp.DATA_MESSAGE_TOPIC, new TextEncoder().encode(textToSend), this.meetingSession.configuration.credentials.attendeeId, this.meetingSession.configuration.credentials.externalUserId));
            });
        };
        const textAreaSendMessage = document.getElementById('send-message');
        textAreaSendMessage.addEventListener('keydown', e => {
            if (e.keyCode === 13) {
                if (e.shiftKey) {
                    textAreaSendMessage.rows++;
                }
                else {
                    e.preventDefault();
                    sendMessage();
                    textAreaSendMessage.rows = 1;
                }
            }
        });
        const buttonMeetingEnd = document.getElementById('button-meeting-end');
        buttonMeetingEnd.addEventListener('click', _e => {
            const confirmEnd = (new URL(window.location.href).searchParams.get('confirm-end')) === 'true';
            const prompt = 'Are you sure you want to end the meeting for everyone? The meeting cannot be used after ending it.';
            if (confirmEnd && !window.confirm(prompt)) {
                return;
            }
            new index_1.AsyncScheduler().start(() => __awaiter(this, void 0, void 0, function* () {
                buttonMeetingEnd.disabled = true;
                yield this.endMeeting();
                this.leave();
                buttonMeetingEnd.disabled = false;
            }));
        });
        const buttonMeetingLeave = document.getElementById('button-meeting-leave');
        buttonMeetingLeave.addEventListener('click', _e => {
            new index_1.AsyncScheduler().start(() => __awaiter(this, void 0, void 0, function* () {
                buttonMeetingLeave.disabled = true;
                this.leave();
                buttonMeetingLeave.disabled = false;
            }));
        });
    }
    getSupportedMediaRegions() {
        const supportedMediaRegions = [];
        const mediaRegion = (document.getElementById("inputRegion"));
        for (var i = 0; i < mediaRegion.length; i++) {
            supportedMediaRegions.push(mediaRegion.value);
        }
        return supportedMediaRegions;
    }
    getNearestMediaRegion() {
        return __awaiter(this, void 0, void 0, function* () {
            const nearestMediaRegionResponse = yield fetch(`https://nearest-media-region.l.chime.aws`, {
                method: 'GET',
            });
            const nearestMediaRegionJSON = yield nearestMediaRegionResponse.json();
            const nearestMediaRegion = nearestMediaRegionJSON.region;
            return nearestMediaRegion;
        });
    }
    setMediaRegion() {
        new index_1.AsyncScheduler().start(() => __awaiter(this, void 0, void 0, function* () {
            try {
                const nearestMediaRegion = yield this.getNearestMediaRegion();
                if (nearestMediaRegion === '' || nearestMediaRegion === null) {
                    throw new Error('Nearest Media Region cannot be null or empty');
                }
                const supportedMediaRegions = this.getSupportedMediaRegions();
                if (supportedMediaRegions.indexOf(nearestMediaRegion) === -1) {
                    supportedMediaRegions.push(nearestMediaRegion);
                    const mediaRegionElement = (document.getElementById("inputRegion"));
                    const newMediaRegionOption = document.createElement("option");
                    newMediaRegionOption.value = nearestMediaRegion;
                    newMediaRegionOption.text = nearestMediaRegion + " (" + nearestMediaRegion + ")";
                    mediaRegionElement.add(newMediaRegionOption, null);
                }
                document.getElementById('inputRegion').value = nearestMediaRegion;
            }
            catch (error) {
                this.log('Default media region selected: ' + error.message);
            }
        }));
    }
    toggleButton(button, state) {
        if (state === 'on') {
            this.buttonStates[button] = true;
        }
        else if (state === 'off') {
            this.buttonStates[button] = false;
        }
        else {
            this.buttonStates[button] = !this.buttonStates[button];
        }
        this.displayButtonStates();
        return this.buttonStates[button];
    }
    isButtonOn(button) {
        return this.buttonStates[button];
    }
    displayButtonStates() {
        console.log('button state');
        console.log(this);
        console.log(this.buttonStates);
        console.log(this.name);
        for (const button in this.buttonStates) {
            console.log('button : ' + button);
            const element = document.getElementById(button);
            console.log('element : ' + element);
            console.log(element);
            const drop = document.getElementById(`${button}-drop`);
            const on = this.buttonStates[button];
            element.classList.add(on ? 'btn-success' : 'btn-outline-secondary');
            element.classList.remove(on ? 'btn-outline-secondary' : 'btn-success');
            // element.firstElementChild.classList.add(on ? 'svg-active' : 'svg-inactive');
            // element.firstElementChild.classList.remove(on ? 'svg-inactive' : 'svg-active');
            if (drop) {
                drop.classList.add(on ? 'btn-success' : 'btn-outline-secondary');
                drop.classList.remove(on ? 'btn-outline-secondary' : 'btn-success');
            }
        }
    }
    showProgress(id) {
        document.getElementById(id).style.visibility = 'visible';
    }
    hideProgress(id) {
        document.getElementById(id).style.visibility = 'hidden';
    }
    switchToFlow(flow) {
        Array.from(document.getElementsByClassName('flow')).map(e => (e.style.display = 'none'));
        document.getElementById(flow).style.display = 'block';
    }
    onAudioInputsChanged(freshDevices) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.populateAudioInputList();
            if (!this.currentAudioInputDevice) {
                return;
            }
            if (this.currentAudioInputDevice === 'default') {
                // The default device might actually have changed. Go ahead and trigger a
                // reselection.
                this.log('Reselecting default device.');
                yield this.selectAudioInputDevice(this.currentAudioInputDevice);
                return;
            }
            const freshDeviceWithSameID = freshDevices.find((device) => device.deviceId === this.currentAudioInputDevice);
            if (freshDeviceWithSameID === undefined) {
                this.log('Existing device disappeared. Selecting a new one.');
                // Select a new device.
                yield this.openAudioInputFromSelectionAndPreview();
            }
        });
    }
    audioInputsChanged(freshAudioInputDeviceList) {
        this.onAudioInputsChanged(freshAudioInputDeviceList);
    }
    videoInputsChanged(_freshVideoInputDeviceList) {
        this.populateVideoInputList();
    }
    audioOutputsChanged(_freshAudioOutputDeviceList) {
        this.populateAudioOutputList();
    }
    audioInputStreamEnded(deviceId) {
        this.log(`Current audio input stream from device id ${deviceId} ended.`);
    }
    videoInputStreamEnded(deviceId) {
        this.log(`Current video input stream from device id ${deviceId} ended.`);
    }
    estimatedDownlinkBandwidthLessThanRequired(estimatedDownlinkBandwidthKbps, requiredVideoDownlinkBandwidthKbps) {
        this.log(`Estimated downlink bandwidth is ${estimatedDownlinkBandwidthKbps} is less than required bandwidth for video ${requiredVideoDownlinkBandwidthKbps}`);
    }
    videoNotReceivingEnoughData(videoReceivingReports) {
        this.log(`One or more video streams are not receiving expected amounts of data ${JSON.stringify(videoReceivingReports)}`);
    }
    metricsDidReceive(clientMetricReport) {
        const metricReport = clientMetricReport.getObservableMetrics();
        if (typeof metricReport.availableSendBandwidth === 'number' && !isNaN(metricReport.availableSendBandwidth)) {
            document.getElementById('video-uplink-bandwidth').innerText =
                'Available Uplink Bandwidth: ' + String(metricReport.availableSendBandwidth / 1000) + ' Kbps';
        }
        else if (typeof metricReport.availableOutgoingBitrate === 'number' && !isNaN(metricReport.availableOutgoingBitrate)) {
            document.getElementById('video-uplink-bandwidth').innerText =
                'Available Uplink Bandwidth: ' + String(metricReport.availableOutgoingBitrate / 1000) + ' Kbps';
        }
        else {
            document.getElementById('video-uplink-bandwidth').innerText =
                'Available Uplink Bandwidth: Unknown';
        }
        if (typeof metricReport.availableReceiveBandwidth === 'number' && !isNaN(metricReport.availableReceiveBandwidth)) {
            document.getElementById('video-downlink-bandwidth').innerText =
                'Available Downlink Bandwidth: ' + String(metricReport.availableReceiveBandwidth / 1000) + ' Kbps';
        }
        else if (typeof metricReport.availableIncomingBitrate === 'number' && !isNaN(metricReport.availableIncomingBitrate)) {
            document.getElementById('video-downlink-bandwidth').innerText =
                'Available Downlink Bandwidth: ' + String(metricReport.availableIncomingBitrate / 1000) + ' Kbps';
        }
        else {
            document.getElementById('video-downlink-bandwidth').innerText =
                'Available Downlink Bandwidth: Unknown';
        }
        this.hasChromiumWebRTC &&
        this.isButtonOn('button-video-stats') &&
        this.getAndShowWebRTCStats();
    }
    getAndShowWebRTCStats() {
        const videoTiles = this.audioVideo.getAllVideoTiles();
        if (videoTiles.length === 0) {
            return;
        }
        for (const videoTile of videoTiles) {
            const tileState = videoTile.state();
            if (tileState.paused || tileState.isContent) {
                continue;
            }
            const tileId = videoTile.id();
            const tileIndex = this.tileIdToTileIndex[tileId];
            this.getStats(tileIndex);
            if (tileState.localTile) {
                this.statsCollector.showUpstreamStats(tileIndex);
            }
            else {
                this.statsCollector.showDownstreamStats(tileIndex);
            }
        }
    }
    getStats(tileIndex) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = `video-${tileIndex}`;
            const videoElement = document.getElementById(id);
            if (!videoElement || !videoElement.srcObject) {
                return;
            }
            const stream = videoElement.srcObject;
            const tracks = stream.getVideoTracks();
            if (tracks.length === 0) {
                return;
            }
            const report = yield this.audioVideo.getRTCPeerConnectionStats(tracks[0]);
            this.statsCollector.processWebRTCStatReportForTileIndex(report, tileIndex);
        });
    }
    createLogStream(configuration, pathname) {
        return __awaiter(this, void 0, void 0, function* () {
            const body = JSON.stringify({
                meetingId: configuration.meetingId,
                attendeeId: configuration.credentials.attendeeId,
            });
            try {
                const response = yield fetch(`${DemoMeetingApp.BASE_URL}${pathname}`, {
                    method: 'POST',
                    body
                });
                if (response.status === 200) {
                    console.log('[DEMO] log stream created');
                }
            }
            catch (error) {
                this.log(error.message);
            }
        });
    }
    eventDidReceive(name, attributes) {
        var _a, _b;
        this.log(`Received an event: ${JSON.stringify({ name, attributes })}`);
        const { meetingHistory } = attributes, otherAttributes = __rest(attributes, ["meetingHistory"]);
        switch (name) {
            case 'meetingStartRequested':
            case 'meetingStartSucceeded':
            case 'meetingEnded': {
                // Exclude the "meetingHistory" attribute for successful events.
                (_a = this.meetingEventPOSTLogger) === null || _a === void 0 ? void 0 : _a.info(JSON.stringify({
                    name,
                    attributes: otherAttributes
                }));
                break;
            }
            case 'audioInputFailed':
            case 'videoInputFailed':
            case 'meetingStartFailed':
            case 'meetingFailed': {
                // Send the last 5 minutes of events.
                (_b = this.meetingEventPOSTLogger) === null || _b === void 0 ? void 0 : _b.info(JSON.stringify({
                    name,
                    attributes: Object.assign(Object.assign({}, otherAttributes), { meetingHistory: meetingHistory.filter(({ timestampMs }) => {
                            return Date.now() - timestampMs < DemoMeetingApp.MAX_MEETING_HISTORY_MS;
                        }) })
                }));
                break;
            }
        }
    }
    initializeMeetingSession(configuration) {
        return __awaiter(this, void 0, void 0, function* () {
            let logger;
            const logLevel = index_1.LogLevel.INFO;
            const consoleLogger = logger = new index_1.ConsoleLogger('SDK', logLevel);
            if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
                logger = consoleLogger;
            }
            else {
                yield Promise.all([
                    this.createLogStream(configuration, 'create_log_stream'),
                    this.createLogStream(configuration, 'create_browser_event_log_stream')
                ]);
                logger = new index_1.MultiLogger(consoleLogger, new index_1.MeetingSessionPOSTLogger('SDK', configuration, DemoMeetingApp.LOGGER_BATCH_SIZE, DemoMeetingApp.LOGGER_INTERVAL_MS, `${DemoMeetingApp.BASE_URL}logs`, logLevel));
                this.meetingEventPOSTLogger = new index_1.MeetingSessionPOSTLogger('SDKEvent', configuration, DemoMeetingApp.LOGGER_BATCH_SIZE, DemoMeetingApp.LOGGER_INTERVAL_MS, `${DemoMeetingApp.BASE_URL}log_meeting_event`, logLevel);
            }
            const deviceController = new index_1.DefaultDeviceController(logger, { enableWebAudio: this.enableWebAudio });
            configuration.enableUnifiedPlanForChromiumBasedBrowsers = this.enableUnifiedPlanForChromiumBasedBrowsers;
            configuration.attendeePresenceTimeoutMs = 5000;
            configuration.enableSimulcastForUnifiedPlanChromiumBasedBrowsers = this.enableSimulcast;
            this.meetingSession = new index_1.DefaultMeetingSession(configuration, logger, deviceController);
            if (document.getElementById('fullband-speech-mono-quality').checked) {
                this.meetingSession.audioVideo.setAudioProfile(index_1.AudioProfile.fullbandSpeechMono());
                this.meetingSession.audioVideo.setContentAudioProfile(index_1.AudioProfile.fullbandSpeechMono());
            }
            else if (document.getElementById('fullband-music-mono-quality').checked) {
                this.meetingSession.audioVideo.setAudioProfile(index_1.AudioProfile.fullbandMusicMono());
                this.meetingSession.audioVideo.setContentAudioProfile(index_1.AudioProfile.fullbandMusicMono());
            }
            this.audioVideo = this.meetingSession.audioVideo;
            this.audioVideo.addDeviceChangeObserver(this);
            this.setupDeviceLabelTrigger();
            yield this.populateAllDeviceLists();
            this.setupMuteHandler();
            this.setupCanUnmuteHandler();
            this.setupSubscribeToAttendeeIdPresenceHandler();
            this.setupDataMessage();
            this.audioVideo.addObserver(this);
            this.audioVideo.addContentShareObserver(this);
            this.initContentShareDropDownItems();
        });
    }
    join() {
        return __awaiter(this, void 0, void 0, function* () {
            window.addEventListener('unhandledrejection', (event) => {
                this.log(event.reason);
            });
            this.audioVideo.start();
        });
    }
    leave() {
        var _a;
        this.statsCollector.resetStats();
        this.audioVideo.stop();
        (_a = this.voiceFocusDevice) === null || _a === void 0 ? void 0 : _a.stop();
        this.voiceFocusDevice = undefined;
        this.roster = {};
    }
    setupMuteHandler() {
        const handler = (isMuted) => {
            this.log(`muted = ${isMuted}`);
        };
        this.audioVideo.realtimeSubscribeToMuteAndUnmuteLocalAudio(handler);
        const isMuted = this.audioVideo.realtimeIsLocalAudioMuted();
        handler(isMuted);
    }
    setupCanUnmuteHandler() {
        const handler = (canUnmute) => {
            this.log(`canUnmute = ${canUnmute}`);
        };
        this.audioVideo.realtimeSubscribeToSetCanUnmuteLocalAudio(handler);
        handler(this.audioVideo.realtimeCanUnmuteLocalAudio());
    }
    updateRoster() {
        const roster = document.getElementById('roster');
        const newRosterCount = Object.keys(this.roster).length;
        while (roster.getElementsByTagName('li').length < newRosterCount) {
            const li = document.createElement('li');
            li.className = 'list-group-item d-flex justify-content-between align-items-center';
            li.appendChild(document.createElement('span'));
            li.appendChild(document.createElement('span'));
            roster.appendChild(li);
        }
        while (roster.getElementsByTagName('li').length > newRosterCount) {
            roster.removeChild(roster.getElementsByTagName('li')[0]);
        }
        const entries = roster.getElementsByTagName('li');
        let i = 0;
        for (const attendeeId in this.roster) {
            const spanName = entries[i].getElementsByTagName('span')[0];
            const spanStatus = entries[i].getElementsByTagName('span')[1];
            let statusClass = 'badge badge-pill ';
            let statusText = '\xa0'; // &nbsp
            if (this.roster[attendeeId].signalStrength < 1) {
                statusClass += 'badge-warning';
            }
            else if (this.roster[attendeeId].signalStrength === 0) {
                statusClass += 'badge-danger';
            }
            else if (this.roster[attendeeId].muted) {
                statusText = 'MUTED';
                statusClass += 'badge-secondary';
            }
            else if (this.roster[attendeeId].active) {
                statusText = 'SPEAKING';
                statusClass += 'badge-success';
            }
            else if (this.roster[attendeeId].volume > 0) {
                statusClass += 'badge-success';
            }
            this.updateProperty(spanName, 'innerText', this.roster[attendeeId].name);
            this.updateProperty(spanStatus, 'innerText', statusText);
            this.updateProperty(spanStatus, 'className', statusClass);
            i++;
        }
    }
    updateProperty(obj, key, value) {
        if (value !== undefined && obj[key] !== value) {
            obj[key] = value;
        }
    }
    setupSubscribeToAttendeeIdPresenceHandler() {
        const handler = (attendeeId, present, externalUserId, dropped) => {
            this.log(`${attendeeId} present = ${present} (${externalUserId})`);
            const isContentAttendee = new index_1.DefaultModality(attendeeId).hasModality(index_1.DefaultModality.MODALITY_CONTENT);
            const isSelfAttendee = new index_1.DefaultModality(attendeeId).base() === this.meetingSession.configuration.credentials.attendeeId;
            if (!present) {
                delete this.roster[attendeeId];
                this.updateRoster();
                this.log(`${attendeeId} dropped = ${dropped} (${externalUserId})`);
                return;
            }
            //If someone else share content, stop the current content share
            if (!this.allowMaxContentShare() && !isSelfAttendee && isContentAttendee && this.isButtonOn('button-content-share')) {
                this.contentShareStop();
            }
            if (!this.roster[attendeeId]) {
                this.roster[attendeeId] = {
                    name: (externalUserId.split('#').slice(-1)[0]) + (isContentAttendee ? ' «Content»' : ''),
                };
            }
            this.audioVideo.realtimeSubscribeToVolumeIndicator(attendeeId, (attendeeId, volume, muted, signalStrength) => __awaiter(this, void 0, void 0, function* () {
                if (!this.roster[attendeeId]) {
                    return;
                }
                if (volume !== null) {
                    this.roster[attendeeId].volume = Math.round(volume * 100);
                }
                if (muted !== null) {
                    this.roster[attendeeId].muted = muted;
                }
                if (signalStrength !== null) {
                    this.roster[attendeeId].signalStrength = Math.round(signalStrength * 100);
                }
                this.updateRoster();
            }));
        };
        this.audioVideo.realtimeSubscribeToAttendeeIdPresence(handler);
        const activeSpeakerHandler = (attendeeIds) => {
            for (const attendeeId in this.roster) {
                this.roster[attendeeId].active = false;
            }
            for (const attendeeId of attendeeIds) {
                if (this.roster[attendeeId]) {
                    this.roster[attendeeId].active = true;
                    break; // only show the most active speaker
                }
            }
            this.layoutFeaturedTile();
        };
        this.audioVideo.subscribeToActiveSpeakerDetector(new index_1.DefaultActiveSpeakerPolicy(), activeSpeakerHandler, (scores) => {
            for (const attendeeId in scores) {
                if (this.roster[attendeeId]) {
                    this.roster[attendeeId].score = scores[attendeeId];
                }
            }
            this.updateRoster();
        }, this.showActiveSpeakerScores ? 100 : 0);
    }
    getStatsForOutbound(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const videoElement = document.getElementById(id);
            const stream = videoElement.srcObject;
            const track = stream.getVideoTracks()[0];
            let basicReports = {};
            let reports = yield this.audioVideo.getRTCPeerConnectionStats(track);
            let duration;
            reports.forEach(report => {
                if (report.type === 'outbound-rtp') {
                    // remained to be calculated
                    this.log(`${id} is bound to ssrc ${report.ssrc}`);
                    basicReports['bitrate'] = report.bytesSent;
                    basicReports['width'] = report.frameWidth;
                    basicReports['height'] = report.frameHeight;
                    basicReports['fps'] = report.framesEncoded;
                    duration = report.timestamp;
                }
            });
            yield new index_1.TimeoutScheduler(1000).start(() => {
                this.audioVideo.getRTCPeerConnectionStats(track).then((reports) => {
                    reports.forEach(report => {
                        if (report.type === 'outbound-rtp') {
                            duration = report.timestamp - duration;
                            duration = duration / 1000;
                            // remained to be calculated
                            basicReports['bitrate'] = Math.trunc((report.bytesSent - basicReports['bitrate']) * 8 / duration);
                            basicReports['width'] = report.frameWidth;
                            basicReports['height'] = report.frameHeight;
                            basicReports['fps'] = Math.trunc((report.framesEncoded - basicReports['fps']) / duration);
                            this.log(JSON.stringify(basicReports));
                        }
                    });
                });
            });
        });
    }
    dataMessageHandler(dataMessage) {
        if (!dataMessage.throttled) {
            const isSelf = dataMessage.senderAttendeeId === this.meetingSession.configuration.credentials.attendeeId;
            if (dataMessage.timestampMs <= this.lastReceivedMessageTimestamp) {
                return;
            }
            this.lastReceivedMessageTimestamp = dataMessage.timestampMs;
            const messageDiv = document.getElementById('receive-message');
            const messageNameSpan = document.createElement('div');
            messageNameSpan.classList.add('message-bubble-sender');
            messageNameSpan.innerText = (dataMessage.senderExternalUserId.split('#').slice(-1)[0]);
            const messageTextSpan = document.createElement('div');
            messageTextSpan.classList.add(isSelf ? 'message-bubble-self' : 'message-bubble-other');
            messageTextSpan.innerHTML = this.markdown.render(dataMessage.text()).replace(/[<]a /g, '<a target="_blank" ');
            const appendClass = (element, className) => {
                for (let i = 0; i < element.children.length; i++) {
                    const child = element.children[i];
                    child.classList.add(className);
                    appendClass(child, className);
                }
            };
            appendClass(messageTextSpan, 'markdown');
            if (this.lastMessageSender !== dataMessage.senderAttendeeId) {
                messageDiv.appendChild(messageNameSpan);
            }
            this.lastMessageSender = dataMessage.senderAttendeeId;
            messageDiv.appendChild(messageTextSpan);
            messageDiv.scrollTop = messageDiv.scrollHeight;
        }
        else {
            this.log('Message is throttled. Please resend');
        }
    }
    setupDataMessage() {
        this.audioVideo.realtimeSubscribeToReceiveDataMessage(DemoMeetingApp.DATA_MESSAGE_TOPIC, (dataMessage) => {
            this.dataMessageHandler(dataMessage);
        });
    }
    // eslint-disable-next-line
    joinMeeting() {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield fetch(`${DemoMeetingApp.BASE_URL}join?title=${encodeURIComponent(this.meeting)}&name=${encodeURIComponent(this.name)}&region=${encodeURIComponent(this.region)}`, {
                method: 'POST',
            });
            const json = yield response.json();
            if (json.error) {
                throw new Error(`Server error: ${json.error}`);
            }
            return json;
        });
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    endMeeting() {
        return __awaiter(this, void 0, void 0, function* () {
            yield fetch(`${DemoMeetingApp.BASE_URL}end?title=${encodeURIComponent(this.meeting)}`, {
                method: 'POST',
            });
        });
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getAttendee(attendeeId) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield fetch(`${DemoMeetingApp.BASE_URL}attendee?title=${encodeURIComponent(this.meeting)}&attendee=${encodeURIComponent(attendeeId)}`);
            const json = yield response.json();
            if (json.error) {
                throw new Error(`Server error: ${json.error}`);
            }
            return json;
        });
    }
    setupDeviceLabelTrigger() {
        // Note that device labels are privileged since they add to the
        // fingerprinting surface area of the browser session. In Chrome private
        // tabs and in all Firefox tabs, the labels can only be read once a
        // MediaStream is active. How to deal with this restriction depends on the
        // desired UX. The device controller includes an injectable device label
        // trigger which allows you to perform custom behavior in case there are no
        // labels, such as creating a temporary audio/video stream to unlock the
        // device names, which is the default behavior. Here we override the
        // trigger to also show an alert to let the user know that we are asking for
        // mic/camera permission.
        //
        // Also note that Firefox has its own device picker, which may be useful
        // for the first device selection. Subsequent device selections could use
        // a custom UX with a specific device id.
        this.audioVideo.setDeviceLabelTrigger(() => __awaiter(this, void 0, void 0, function* () {
            if (this.isRecorder() || this.isBroadcaster()) {
                throw new Error('Recorder or Broadcaster does not need device labels');
            }
            this.switchToFlow('flow-need-permission');
            const stream = yield navigator.mediaDevices.getUserMedia({ audio: true, video: true });
            this.switchToFlow('flow-devices');
            return stream;
        }));
    }
    populateDeviceList(elementId, genericName, devices, additionalOptions) {
        const list = document.getElementById(elementId);
        while (list.firstElementChild) {
            list.removeChild(list.firstElementChild);
        }
        for (let i = 0; i < devices.length; i++) {
            const option = document.createElement('option');
            list.appendChild(option);
            option.text = devices[i].label || `${genericName} ${i + 1}`;
            option.value = devices[i].deviceId;
        }
        if (additionalOptions.length > 0) {
            const separator = document.createElement('option');
            separator.disabled = true;
            separator.text = '──────────';
            list.appendChild(separator);
            for (const additionalOption of additionalOptions) {
                const option = document.createElement('option');
                list.appendChild(option);
                option.text = additionalOption;
                option.value = additionalOption;
            }
        }
        if (!list.firstElementChild) {
            const option = document.createElement('option');
            option.text = 'Device selection unavailable';
            list.appendChild(option);
        }
    }
    populateInMeetingDeviceList(elementId, genericName, devices, additionalOptions, additionalToggles, callback) {
        const menu = document.getElementById(elementId);
        while (menu.firstElementChild) {
            menu.removeChild(menu.firstElementChild);
        }
        for (let i = 0; i < devices.length; i++) {
            this.createDropdownMenuItem(menu, devices[i].label || `${genericName} ${i + 1}`, () => {
                callback(devices[i].deviceId);
            });
        }
        if (additionalOptions.length) {
            this.createDropdownMenuItem(menu, '──────────', () => { }).classList.add('text-center');
            for (const additionalOption of additionalOptions) {
                this.createDropdownMenuItem(menu, additionalOption, () => {
                    callback(additionalOption);
                }, `${elementId}-${additionalOption.replace(/\s/g, '-')}`);
            }
        }
        if (additionalToggles === null || additionalToggles === void 0 ? void 0 : additionalToggles.length) {
            this.createDropdownMenuItem(menu, '──────────', () => { }).classList.add('text-center');
            for (const { name, oncreate, action } of additionalToggles) {
                const id = `toggle-${elementId}-${name.replace(/\s/g, '-')}`;
                const elem = this.createDropdownMenuItem(menu, name, action, id);
                oncreate(elem);
            }
        }
        if (!menu.firstElementChild) {
            this.createDropdownMenuItem(menu, 'Device selection unavailable', () => { });
        }
    }
    createDropdownMenuItem(menu, title, clickHandler, id) {
        const button = document.createElement('button');
        menu.appendChild(button);
        button.innerText = title;
        button.classList.add('dropdown-item');
        this.updateProperty(button, 'id', id);
        button.addEventListener('click', () => {
            clickHandler();
        });
        return button;
    }
    populateAllDeviceLists() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.populateAudioInputList();
            yield this.populateVideoInputList();
            yield this.populateAudioOutputList();
        });
    }
    populateAudioInputList() {
        return __awaiter(this, void 0, void 0, function* () {
            const genericName = 'Microphone';
            const additionalDevices = ['None', '440 Hz'];
            const additionalToggles = [];
            // This can't work unless Web Audio is enabled.
            if (this.enableWebAudio && this.supportsVoiceFocus) {
                additionalToggles.push({
                    name: 'Amazon Voice Focus',
                    oncreate: (elem) => {
                        this.voiceFocusDisplayables.push(elem);
                    },
                    action: () => this.toggleVoiceFocusInMeeting(),
                });
            }
            this.populateDeviceList('audio-input', genericName, yield this.audioVideo.listAudioInputDevices(), additionalDevices);
            this.populateInMeetingDeviceList('dropdown-menu-microphone', genericName, yield this.audioVideo.listAudioInputDevices(), additionalDevices, additionalToggles, (name) => __awaiter(this, void 0, void 0, function* () {
                yield this.selectAudioInputDeviceByName(name);
            }));
        });
    }
    isVoiceFocusActive() {
        return this.currentAudioInputDevice instanceof index_1.VoiceFocusTransformDevice;
    }
    updateVoiceFocusDisplayState() {
        const active = this.isVoiceFocusActive();
        this.log('Updating Amazon Voice Focus display state:', active);
        for (const elem of this.voiceFocusDisplayables) {
            elem.classList.toggle('vf-active', active);
        }
    }
    isVoiceFocusEnabled() {
        this.log('VF supported:', this.supportsVoiceFocus);
        this.log('VF enabled:', this.enableVoiceFocus);
        return this.supportsVoiceFocus && this.enableVoiceFocus;
    }
    reselectAudioInputDevice() {
        return __awaiter(this, void 0, void 0, function* () {
            let current = this.currentAudioInputDevice;
            if (current instanceof index_1.VoiceFocusTransformDevice) {
                // Unwrap and rewrap if Amazon Voice Focus is selected.
                const intrinsic = current.getInnerDevice();
                const device = yield this.audioInputSelectionWithOptionalVoiceFocus(intrinsic);
                return this.selectAudioInputDevice(device);
            }
            // If it's another kind of transform device, just reselect it.
            if (index_1.isAudioTransformDevice(current)) {
                return this.selectAudioInputDevice(current);
            }
            // Otherwise, apply Amazon Voice Focus if needed.
            const device = yield this.audioInputSelectionWithOptionalVoiceFocus(current);
            return this.selectAudioInputDevice(device);
        });
    }
    toggleVoiceFocusInMeeting() {
        return __awaiter(this, void 0, void 0, function* () {
            const elem = document.getElementById('add-voice-focus');
            this.enableVoiceFocus = this.supportsVoiceFocus && !this.enableVoiceFocus;
            elem.checked = this.enableVoiceFocus;
            this.log('Amazon Voice Focus toggle is now', elem.checked);
            yield this.reselectAudioInputDevice();
        });
    }
    populateVideoInputList() {
        return __awaiter(this, void 0, void 0, function* () {
            const genericName = 'Camera';
            const additionalDevices = ['None', 'Blue', 'SMPTE Color Bars'];
            this.populateDeviceList('video-input', genericName, yield this.audioVideo.listVideoInputDevices(), additionalDevices);
            this.populateInMeetingDeviceList('dropdown-menu-camera', genericName, yield this.audioVideo.listVideoInputDevices(), additionalDevices, undefined, (name) => __awaiter(this, void 0, void 0, function* () {
                try {
                    yield this.openVideoInputFromSelection(name, false);
                }
                catch (err) {
                    this.log('no video input device selected');
                }
            }));
            const cameras = yield this.audioVideo.listVideoInputDevices();
            this.cameraDeviceIds = cameras.map((deviceInfo) => {
                return deviceInfo.deviceId;
            });
        });
    }
    populateAudioOutputList() {
        return __awaiter(this, void 0, void 0, function* () {
            const genericName = 'Speaker';
            const additionalDevices = [];
            this.populateDeviceList('audio-output', genericName, yield this.audioVideo.listAudioOutputDevices(), additionalDevices);
            this.populateInMeetingDeviceList('dropdown-menu-speaker', genericName, yield this.audioVideo.listAudioOutputDevices(), additionalDevices, undefined, (name) => __awaiter(this, void 0, void 0, function* () {
                try {
                    yield this.audioVideo.chooseAudioOutputDevice(name);
                }
                catch (e) {
                    this.log('Failed to chooseAudioOutputDevice', e);
                }
            }));
        });
    }
    selectedAudioInput() {
        return __awaiter(this, void 0, void 0, function* () {
            const audioInput = document.getElementById('audio-input');
            const device = yield this.audioInputSelectionToDevice(audioInput.value);
            return device;
        });
    }
    selectAudioInputDevice(device) {
        return __awaiter(this, void 0, void 0, function* () {
            this.currentAudioInputDevice = device;
            this.log('Selecting audio input', device);
            try {
                yield this.audioVideo.chooseAudioInputDevice(device);
            }
            catch (e) {
                this.log(`failed to choose audio input device ${device}`, e);
            }
            this.updateVoiceFocusDisplayState();
        });
    }
    selectAudioInputDeviceByName(name) {
        return __awaiter(this, void 0, void 0, function* () {
            this.log('Selecting audio input device by name:', name);
            const device = yield this.audioInputSelectionToDevice(name);
            return this.selectAudioInputDevice(device);
        });
    }
    openAudioInputFromSelection() {
        return __awaiter(this, void 0, void 0, function* () {
            const device = yield this.selectedAudioInput();
            yield this.selectAudioInputDevice(device);
        });
    }
    openAudioInputFromSelectionAndPreview() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.stopAudioPreview();
            yield this.openAudioInputFromSelection();
            this.log('Starting audio preview.');
            yield this.startAudioPreview();
        });
    }
    setAudioPreviewPercent(percent) {
        const audioPreview = document.getElementById('audio-preview');
        if (!audioPreview) {
            return;
        }
        this.updateProperty(audioPreview.style, 'transitionDuration', '33ms');
        this.updateProperty(audioPreview.style, 'width', `${percent}%`);
        if (audioPreview.getAttribute('aria-valuenow') !== `${percent}`) {
            audioPreview.setAttribute('aria-valuenow', `${percent}`);
        }
    }
    stopAudioPreview() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.analyserNode) {
                return;
            }
            this.analyserNodeCallback = () => { };
            // Disconnect the analyser node from its inputs and outputs.
            this.analyserNode.disconnect();
            this.analyserNode.removeOriginalInputs();
            this.analyserNode = undefined;
        });
    }
    startAudioPreview() {
        this.setAudioPreviewPercent(0);
        // Recreate.
        if (this.analyserNode) {
            // Disconnect the analyser node from its inputs and outputs.
            this.analyserNode.disconnect();
            this.analyserNode.removeOriginalInputs();
            this.analyserNode = undefined;
        }
        const analyserNode = this.audioVideo.createAnalyserNodeForAudioInput();
        if (!analyserNode) {
            return;
        }
        if (!analyserNode.getByteTimeDomainData) {
            document.getElementById('audio-preview').parentElement.style.visibility = 'hidden';
            return;
        }
        this.analyserNode = analyserNode;
        const data = new Uint8Array(analyserNode.fftSize);
        let frameIndex = 0;
        this.analyserNodeCallback = () => {
            if (frameIndex === 0) {
                analyserNode.getByteTimeDomainData(data);
                const lowest = 0.01;
                let max = lowest;
                for (const f of data) {
                    max = Math.max(max, (f - 128) / 128);
                }
                let normalized = (Math.log(lowest) - Math.log(max)) / Math.log(lowest);
                let percent = Math.min(Math.max(normalized * 100, 0), 100);
                this.setAudioPreviewPercent(percent);
            }
            frameIndex = (frameIndex + 1) % 2;
            requestAnimationFrame(this.analyserNodeCallback);
        };
        requestAnimationFrame(this.analyserNodeCallback);
    }
    openAudioOutputFromSelection() {
        return __awaiter(this, void 0, void 0, function* () {
            const audioOutput = document.getElementById('audio-output');
            try {
                yield this.audioVideo.chooseAudioOutputDevice(audioOutput.value);
            }
            catch (e) {
                this.log('failed to chooseAudioOutputDevice', e);
            }
            const audioMix = document.getElementById('meeting-audio');
            try {
                yield this.audioVideo.bindAudioElement(audioMix);
            }
            catch (e) {
                this.log('failed to bindAudioElement', e);
            }
        });
    }
    openVideoInputFromSelection(selection, showPreview) {
        return __awaiter(this, void 0, void 0, function* () {
            if (selection) {
                this.selectedVideoInput = selection;
            }
            this.log(`Switching to: ${this.selectedVideoInput}`);
            const device = this.videoInputSelectionToDevice(this.selectedVideoInput);
            if (device === null) {
                if (showPreview) {
                    this.audioVideo.stopVideoPreviewForVideoInput(document.getElementById('video-preview'));
                }
                this.audioVideo.stopLocalVideoTile();
                this.toggleButton('button-camera', 'off');
                // choose video input null is redundant since we expect stopLocalVideoTile to clean up
                try {
                    yield this.audioVideo.chooseVideoInputDevice(device);
                }
                catch (e) {
                    this.log(`failed to chooseVideoInputDevice ${device}`, e);
                }
                throw new Error('no video device selected');
            }
            try {
                yield this.audioVideo.chooseVideoInputDevice(device);
            }
            catch (e) {
                this.log(`failed to chooseVideoInputDevice ${device}`, e);
            }
            if (showPreview) {
                this.audioVideo.startVideoPreviewForVideoInput(document.getElementById('video-preview'));
            }
        });
    }
    audioInputSelectionToIntrinsicDevice(value) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.isRecorder() || this.isBroadcaster()) {
                return null;
            }
            if (value === '440 Hz') {
                return index_1.DefaultDeviceController.synthesizeAudioDevice(440);
            }
            if (value === 'None') {
                return null;
            }
            return value;
        });
    }
    getVoiceFocusDeviceTransformer() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.voiceFocusTransformer) {
                return this.voiceFocusTransformer;
            }
            const logger = new index_1.ConsoleLogger('SDK', index_1.LogLevel.DEBUG);
            const transformer = yield index_1.VoiceFocusDeviceTransformer.create(VOICE_FOCUS_SPEC, { logger });
            this.voiceFocusTransformer = transformer;
            return transformer;
        });
    }
    createVoiceFocusDevice(inner) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.supportsVoiceFocus) {
                return inner;
            }
            if (this.voiceFocusDevice) {
                // Dismantle the old one.
                return this.voiceFocusDevice = yield this.voiceFocusDevice.chooseNewInnerDevice(inner);
            }
            try {
                const transformer = yield this.getVoiceFocusDeviceTransformer();
                const vf = yield transformer.createTransformDevice(inner);
                if (vf) {
                    return this.voiceFocusDevice = vf;
                }
            }
            catch (e) {
                // Fall through.
            }
            return inner;
        });
    }
    audioInputSelectionWithOptionalVoiceFocus(device) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.isVoiceFocusEnabled()) {
                if (!this.voiceFocusDevice) {
                    return this.createVoiceFocusDevice(device);
                }
                // Switch out the inner if needed.
                // The reuse of the Voice Focus device is more efficient, particularly if
                // reselecting the same inner -- no need to modify the Web Audio graph.
                // Allowing the Voice Focus device to manage toggling Voice Focus on and off
                // also
                return this.voiceFocusDevice = yield this.voiceFocusDevice.chooseNewInnerDevice(device);
            }
            return device;
        });
    }
    audioInputSelectionToDevice(value) {
        return __awaiter(this, void 0, void 0, function* () {
            const inner = yield this.audioInputSelectionToIntrinsicDevice(value);
            return this.audioInputSelectionWithOptionalVoiceFocus(inner);
        });
    }
    videoInputSelectionToDevice(value) {
        if (this.isRecorder() || this.isBroadcaster()) {
            return null;
        }
        if (value === 'Blue') {
            return index_1.DefaultDeviceController.synthesizeVideoDevice('blue');
        }
        if (value === 'SMPTE Color Bars') {
            return index_1.DefaultDeviceController.synthesizeVideoDevice('smpte');
        }
        if (value === 'None') {
            return null;
        }
        return value;
    }
    initContentShareDropDownItems() {
        let item = document.getElementById('dropdown-item-content-share-screen-capture');
        item.addEventListener('click', () => {
            this.contentShareTypeChanged(ContentShareType.ScreenCapture);
        });
        item = document.getElementById('dropdown-item-content-share-screen-test-video');
        item.addEventListener('click', () => {
            this.contentShareTypeChanged(ContentShareType.VideoFile, DemoMeetingApp.testVideo);
        });
        document.getElementById('content-share-item').addEventListener('change', () => {
            const fileList = document.getElementById('content-share-item');
            const file = fileList.files[0];
            if (!file) {
                this.log('no content share selected');
                return;
            }
            const url = URL.createObjectURL(file);
            this.log(`content share selected: ${url}`);
            this.contentShareTypeChanged(ContentShareType.VideoFile, url);
            fileList.value = '';
        });
    }
    contentShareTypeChanged(contentShareType, videoUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.isButtonOn('button-content-share')) {
                yield this.contentShareStop();
            }
            this.contentShareType = contentShareType;
            yield this.contentShareStart(videoUrl);
        });
    }
    contentShareStart(videoUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            this.toggleButton('button-content-share');
            switch (this.contentShareType) {
                case ContentShareType.ScreenCapture:
                    this.audioVideo.startContentShareFromScreenCapture();
                    break;
                case ContentShareType.VideoFile:
                    const videoFile = document.getElementById('content-share-video');
                    if (videoUrl) {
                        videoFile.src = videoUrl;
                    }
                    yield videoFile.play();
                    let mediaStream;
                    if (this.defaultBrowserBehaviour.hasFirefoxWebRTC()) {
                        // @ts-ignore
                        mediaStream = videoFile.mozCaptureStream();
                    }
                    else {
                        // @ts-ignore
                        mediaStream = videoFile.captureStream();
                    }
                    this.audioVideo.startContentShare(mediaStream);
                    break;
            }
        });
    }
    contentShareStop() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.isButtonOn('button-pause-content-share')) {
                this.toggleButton('button-pause-content-share');
            }
            this.toggleButton('button-content-share');
            this.audioVideo.stopContentShare();
            if (this.contentShareType === ContentShareType.VideoFile) {
                const videoFile = document.getElementById('content-share-video');
                videoFile.pause();
                videoFile.style.display = 'none';
            }
        });
    }
    isRecorder() {
        return (new URL(window.location.href).searchParams.get('record')) === 'true';
    }
    isBroadcaster() {
        return (new URL(window.location.href).searchParams.get('broadcast')) === 'true';
    }
    authenticate() {
        return __awaiter(this, void 0, void 0, function* () {
            let joinInfo = (yield this.joinMeeting()).JoinInfo;
            const configuration = new index_1.MeetingSessionConfiguration(joinInfo.Meeting, joinInfo.Attendee);
            yield this.initializeMeetingSession(configuration);
            const url = new URL(window.location.href);
            url.searchParams.set('m', this.meeting);
            history.replaceState({}, `${this.meeting}`, url.toString());
            return configuration.meetingId;
        });
    }
    log(str, ...args) {
        console.log.apply(console, [`[DEMO] ${str}`, ...args]);
    }
    audioVideoDidStartConnecting(reconnecting) {
        this.log(`session connecting. reconnecting: ${reconnecting}`);
    }
    audioVideoDidStart() {
        this.log('session started');
    }
    audioVideoDidStop(sessionStatus) {
        this.log(`session stopped from ${JSON.stringify(sessionStatus)}`);
        this.log(`resetting stats in WebRTCStatsCollector`);
        this.statsCollector.resetStats();
        if (sessionStatus.statusCode() === index_1.MeetingSessionStatusCode.AudioCallEnded) {
            this.log(`meeting ended`);
            // @ts-ignore
            window.location = window.location.pathname;
        }
        else if (sessionStatus.statusCode() === index_1.MeetingSessionStatusCode.Left) {
            this.log('left meeting');
            // @ts-ignore
            window.location = window.location.pathname;
        }
    }
    videoTileDidUpdate(tileState) {
        this.log(`video tile updated: ${JSON.stringify(tileState, null, '  ')}`);
        if (!tileState.boundAttendeeId) {
            return;
        }
        const tileIndex = tileState.localTile
            ? 16
            : this.tileOrganizer.acquireTileIndex(tileState.tileId);
        const tileElement = document.getElementById(`tile-${tileIndex}`);
        const videoElement = document.getElementById(`video-${tileIndex}`);
        const nameplateElement = document.getElementById(`nameplate-${tileIndex}`);
        const attendeeIdElement = document.getElementById(`attendeeid-${tileIndex}`);
        const pauseButtonElement = document.getElementById(`video-pause-${tileIndex}`);
        pauseButtonElement.addEventListener('click', () => {
            if (!tileState.paused) {
                this.audioVideo.pauseVideoTile(tileState.tileId);
                pauseButtonElement.innerText = 'Resume';
            }
            else {
                this.audioVideo.unpauseVideoTile(tileState.tileId);
                pauseButtonElement.innerText = 'Pause';
            }
        });
        this.log(`binding video tile ${tileState.tileId} to ${videoElement.id}`);
        this.audioVideo.bindVideoElement(tileState.tileId, videoElement);
        this.tileIndexToTileId[tileIndex] = tileState.tileId;
        this.tileIdToTileIndex[tileState.tileId] = tileIndex;
        this.updateProperty(nameplateElement, 'innerText', tileState.boundExternalUserId.split('#')[1]);
        this.updateProperty(attendeeIdElement, 'innerText', tileState.boundAttendeeId);
        this.showTile(tileElement, tileState);
        this.updateGridClasses();
        this.layoutFeaturedTile();
    }
    videoTileWasRemoved(tileId) {
        const tileIndex = this.tileOrganizer.releaseTileIndex(tileId);
        this.log(`video tileId removed: ${tileId} from tile-${tileIndex}`);
        this.hideTile(tileIndex);
        this.updateGridClasses();
    }
    videoAvailabilityDidChange(availability) {
        this.canStartLocalVideo = availability.canStartLocalVideo;
        this.log(`video availability changed: canStartLocalVideo  ${availability.canStartLocalVideo}`);
    }
    showTile(tileElement, tileState) {
        tileElement.classList.add(`active`);
        if (tileState.isContent) {
            tileElement.classList.add('content');
        }
    }
    hideTile(tileIndex) {
        const tileElement = document.getElementById(`tile-${tileIndex}`);
        tileElement.classList.remove('active', 'featured', 'content');
    }
    tileIdForAttendeeId(attendeeId) {
        for (const tile of this.audioVideo.getAllVideoTiles()) {
            const state = tile.state();
            if (state.boundAttendeeId === attendeeId) {
                return state.tileId;
            }
        }
        return null;
    }
    findContentTileId() {
        for (const tile of this.audioVideo.getAllVideoTiles()) {
            const state = tile.state();
            if (state.isContent) {
                return state.tileId;
            }
        }
        return null;
    }
    activeTileId() {
        let contentTileId = this.findContentTileId();
        if (contentTileId !== null) {
            return contentTileId;
        }
        for (const attendeeId in this.roster) {
            if (this.roster[attendeeId].active) {
                return this.tileIdForAttendeeId(attendeeId);
            }
        }
        return null;
    }
    layoutFeaturedTile() {
        if (!this.meetingSession) {
            return;
        }
        const tilesIndices = this.visibleTileIndices();
        const localTileId = this.localTileId();
        const activeTile = this.activeTileId();
        for (let i = 0; i < tilesIndices.length; i++) {
            const tileIndex = tilesIndices[i];
            const tileElement = document.getElementById(`tile-${tileIndex}`);
            const tileId = this.tileIndexToTileId[tileIndex];
            if (tileId === activeTile && tileId !== localTileId) {
                tileElement.classList.add('featured');
            }
            else {
                tileElement.classList.remove('featured');
            }
        }
        this.updateGridClasses();
    }
    updateGridClasses() {
        const localTileId = this.localTileId();
        const activeTile = this.activeTileId();
        this.tileArea.className = `v-grid size-${this.availablelTileSize()}`;
        if (activeTile && activeTile !== localTileId) {
            this.tileArea.classList.add('featured');
        }
        else {
            this.tileArea.classList.remove('featured');
        }
    }
    availablelTileSize() {
        return this.tileOrganizer.remoteTileCount +
            (this.audioVideo.hasStartedLocalVideoTile() ? 1 : 0);
    }
    localTileId() {
        return this.audioVideo.hasStartedLocalVideoTile() ? this.audioVideo.getLocalVideoTile().state().tileId : null;
    }
    visibleTileIndices() {
        const tileKeys = Object.keys(this.tileOrganizer.tiles);
        const tiles = tileKeys.map(tileId => parseInt(tileId));
        return tiles;
    }
    setUpVideoTileElementResizer() {
        for (let i = 0; i <= DemoTileOrganizer.MAX_TILES; i++) {
            const videoElem = document.getElementById(`video-${i}`);
            videoElem.onresize = () => {
                if (videoElem.videoHeight > videoElem.videoWidth) {
                    // portrait mode
                    videoElem.style.objectFit = 'contain';
                    this.log(`video-${i} changed to portrait mode resolution ${videoElem.videoWidth}x${videoElem.videoHeight}`);
                }
                else {
                    videoElem.style.objectFit = 'cover';
                }
            };
        }
    }
    allowMaxContentShare() {
        const allowed = (new URL(window.location.href).searchParams.get('max-content-share')) === 'true';
        if (allowed) {
            return true;
        }
        return false;
    }
    connectionDidBecomePoor() {
        this.log('connection is poor');
    }
    connectionDidSuggestStopVideo() {
        this.log('suggest turning the video off');
    }
    connectionDidBecomeGood() {
        this.log('connection is good now');
    }
    videoSendDidBecomeUnavailable() {
        this.log('sending video is not available');
    }
    contentShareDidStart() {
        this.log('content share started.');
    }
    contentShareDidStop() {
        this.log('content share stopped.');
        if (this.isButtonOn('button-content-share')) {
            this.buttonStates['button-content-share'] = false;
            this.buttonStates['button-pause-content-share'] = false;
            this.displayButtonStates();
        }
    }
    contentShareDidPause() {
        this.log('content share paused.');
    }
    contentShareDidUnpause() {
        this.log(`content share unpaused.`);
    }
    encodingSimulcastLayersDidChange(simulcastLayers) {
        this.log(`current active simulcast layers changed to: ${SimulcastLayerMapping[simulcastLayers]}`);
    }
    remoteVideoSourcesDidChange(videoSources) {
        this.log(`available remote video sources changed: ${JSON.stringify(videoSources)}`);
    }
}
exports.DemoMeetingApp = DemoMeetingApp;
DemoMeetingApp.DID = '+17035550122';
DemoMeetingApp.BASE_URL = "https://hd7fvh3m00.execute-api.ap-northeast-2.amazonaws.com/Prod/";
DemoMeetingApp.testVideo = 'https://upload.wikimedia.org/wikipedia/commons/transcoded/c/c0/Big_Buck_Bunny_4K.webm/Big_Buck_Bunny_4K.webm.360p.vp9.webm';
DemoMeetingApp.LOGGER_BATCH_SIZE = 85;
DemoMeetingApp.LOGGER_INTERVAL_MS = 2000;
DemoMeetingApp.MAX_MEETING_HISTORY_MS = 5 * 60 * 1000;
DemoMeetingApp.DATA_MESSAGE_TOPIC = "chat";
DemoMeetingApp.DATA_MESSAGE_LIFETIME_MS = 300000;
