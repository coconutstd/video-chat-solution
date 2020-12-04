export default class DeviceSelection {
    constraints: MediaStreamConstraints;
    stream: MediaStream;
    groupId: string;
    matchesConstraints(constraints: MediaStreamConstraints): boolean;
}
