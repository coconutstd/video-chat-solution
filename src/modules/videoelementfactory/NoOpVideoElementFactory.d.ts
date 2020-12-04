import VideoElementFactory from './VideoElementFactory';
export default class NoOpVideoElementFactory implements VideoElementFactory {
    create(): HTMLVideoElement;
}
