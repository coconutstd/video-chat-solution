import { SdkStreamDescriptor } from '../signalingprotocol/SignalingProtocol.js';
export default class VideoStreamDescription {
    attendeeId: string;
    groupId: number;
    streamId: number;
    ssrc: number;
    trackLabel: string;
    maxBitrateKbps: number;
    avgBitrateKbps: number;
    maxFrameRate: number;
    timeEnabled: number;
    disabledByWebRTC: boolean;
    disabledByUplinkPolicy: boolean;
    constructor(attendeeId?: string, groupId?: number, streamId?: number, maxBitrateKbps?: number, avgBitrateKbps?: number);
    clone(): VideoStreamDescription;
    toStreamDescriptor(): SdkStreamDescriptor;
}
