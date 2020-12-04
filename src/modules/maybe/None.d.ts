import MaybeProvider from './MaybeProvider';
export default class None<T> implements MaybeProvider<T> {
    readonly isSome: boolean;
    readonly isNone: boolean;
    private constructor();
    get(): T;
    getOrElse(value: T): T;
    map<R>(_f: (_wrapped: T) => R): MaybeProvider<R>;
    flatMap<R>(_f: (_unwrapped: T) => MaybeProvider<R>): MaybeProvider<R>;
    defaulting(value: T): MaybeProvider<T>;
    static of<T>(): MaybeProvider<T>;
}
