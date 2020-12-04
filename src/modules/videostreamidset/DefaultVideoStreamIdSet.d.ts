import VideoStreamIdSet from './VideoStreamIdSet';
/**
 * [[DefaultVideoStreamIdSet]] implements [[VideoStreamIdSet]].
 */
export default class DefaultVideoStreamIdSet implements VideoStreamIdSet {
    private ids;
    constructor(ids?: number[]);
    add(streamId: number): void;
    array(): number[];
    contain(streamId: number): boolean;
    empty(): boolean;
    size(): number;
    equal(other: DefaultVideoStreamIdSet): boolean;
    clone(): DefaultVideoStreamIdSet;
    remove(streamId: number): void;
    toJSON(): number[];
}
