import { SdkSignalFrame } from '../signalingprotocol/SignalingProtocol.js';
import MeetingSessionStatusCode from './MeetingSessionStatusCode';
/**
 * [[MeetingSessionStatus]] indicates a status received regarding the session.
 */
export default class MeetingSessionStatus {
    private _statusCode;
    constructor(_statusCode: MeetingSessionStatusCode);
    statusCode(): MeetingSessionStatusCode;
    isFailure(): boolean;
    isTerminal(): boolean;
    isAudioConnectionFailure(): boolean;
    static fromSignalFrame(frame: SdkSignalFrame): MeetingSessionStatus;
    private static fromAudioStatus;
    private static fromSignalingStatus;
}
