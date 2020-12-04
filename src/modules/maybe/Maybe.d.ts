import MaybeProvider from './MaybeProvider';
export default class Maybe {
    static of<T>(value: T | null): MaybeProvider<T>;
}
