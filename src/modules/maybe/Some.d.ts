import MaybeProvider from './MaybeProvider';
export default class Some<T> implements MaybeProvider<T> {
    private value;
    readonly isSome: boolean;
    readonly isNone: boolean;
    private constructor();
    map<R>(f: (wrapped: T) => R): MaybeProvider<R>;
    flatMap<R>(f: (unwrapped: T) => MaybeProvider<R>): MaybeProvider<R>;
    get(): T;
    getOrElse(_value: T): T;
    defaulting(value: T): MaybeProvider<T>;
    static of<T>(value: T): MaybeProvider<T>;
}
