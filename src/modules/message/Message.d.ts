export default class Message {
    readonly type: string;
    readonly headers: any;
    readonly payload: string;
    constructor(type: string, // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
    headers: any, payload: string);
}
