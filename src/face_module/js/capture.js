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
import {initEyeblink, cancelAnimation} from "./bundle"
import { totalTimer, secondsTimer } from './loader';

export class Capture {

    constructor(videoTile) {
        this.video = videoTile
    }

    uncapture() {
        console.log(totalTimer.getTimeValues().toString());
        totalTimer.stop();
        secondsTimer.stop();
        destroyInterval()
        cancelAnimation()
    }

    async capture() {
        const video = this.video

        if (video) {
            // console.log(videoSize.getVideoOriginLeft('video-16'))
            // console.log(videoSize.getVideoOriginTop('video-16'))
            // console.log(videoSize.getVideoOriginWidth('video-16'))
            // console.log(videoSize.getVideoOriginHeight('video-16'))

            let loadedModels = await loadModels()
            let labeledFaceDescriptors = await loadLabeledImages()
            let FaceMatcher = faceMatcher(labeledFaceDescriptors)
            let userMedia = await getUserMedia(video)
            await initEyeblink()
            this.video.addEventListener('play', videoCallback(video, FaceMatcher))
            document.getElementById('facespinner').style.display = 'none';
        }
    }

}
