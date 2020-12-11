/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable no-inner-declarations */
import * as videoSize from './videoSize'
import {
    loadModels,
    loadLabeledImages,
    getUserMedia,
    faceMatcher,
    videoCallback,
    destroyInterval
} from "@/face_module/js/loader";
import {init} from "../../../public/bundle"


export class Capture {

    constructor(videoTile) {
        this.video = videoTile
    }

    uncapture() {
        destroyInterval()
    }

    async capture() {
        const video = this.video

        if (video) {
            console.log(videoSize.getVideoOriginLeft('video-16'))
            console.log(videoSize.getVideoOriginTop('video-16'))
            console.log(videoSize.getVideoOriginWidth('video-16'))
            console.log(videoSize.getVideoOriginHeight('video-16'))

            let loadedModels = await loadModels()
            let labeledFaceDescriptors = await loadLabeledImages()
            let FaceMatcher = faceMatcher(labeledFaceDescriptors)
            let userMedia = await getUserMedia(video)
            this.video.addEventListener('play', videoCallback(video, FaceMatcher))
            init()
        }
    }

}
