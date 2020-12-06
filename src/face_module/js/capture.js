import * as videoSize from './videoSize'
import * as faceapi from './face-api'

var interval = 0

export class Capture {

    constructor(videoTile) {
        this.video = videoTile
    }

    uncapture() {
        console.log('제거')
        clearInterval(interval)
        let target = document.getElementsByTagName('canvas')
        console.log(target)
        target[0].parentNode.removeChild(target[0])
        // this.video.removeEventListener('play', this.videoCallback(this.video))
    }

    capture() {
        const video = this.video
        if (video) {
            console.log(videoSize.getVideoOriginLeft('video-16'))
            console.log(videoSize.getVideoOriginTop('video-16'))
            console.log(videoSize.getVideoOriginWidth('video-16'))
            console.log(videoSize.getVideoOriginHeight('video-16'))

            Promise.all([
                faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
                faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
                faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
                faceapi.nets.faceExpressionNet.loadFromUri('/models')
            ]).then(startVideo)


            function startVideo() {
                navigator.getUserMedia(
                    {video: {}},
                    stream => video.srcObject = stream,
                    err => console.error(err)
                )
            }

            this.video.addEventListener('play', this.videoCallback(video))
        }
    }

    videoCallback(video) {
        const canvas = faceapi.createCanvasFromMedia(video)
        //console.log(canvas)
        //document.body.append(canvas)
        // $("#tile-16").append(canvas)
        document.getElementById("tile-16").append(canvas)

        const displaySize = {
            width: videoSize.getVideoOriginWidth('video-16'),
            height: videoSize.getVideoOriginHeight('video-16')
        }
        faceapi.matchDimensions(canvas, displaySize)

        // tiny_face_detector options
        let inputSize = 224
        let scoreThreshold = 0.5

        interval = setInterval(async () => {
            // const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions()
            // const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions({ inputSize, scoreThreshold })).withFaceExpressions()

            const detections = await faceapi.detectSingleFace(video, new faceapi.TinyFaceDetectorOptions({
                inputSize,
                scoreThreshold
            })).withFaceExpressions()

            // console.log(detections)

            // const resizedDetections = faceapi.resizeResults(detections, displaySize)
            // canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
            // faceapi.draw.drawDetections(canvas, resizedDetections)
            // faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)
            // faceapi.draw.drawFaceExpressions(canvas, resizedDetections)

            if (detections) {
                const displaySize = {
                    width: videoSize.getVideoOriginWidth('video-16'),
                    height: videoSize.getVideoOriginHeight('video-16')
                }
                const dims = faceapi.matchDimensions(canvas, displaySize, true)
                const resizedResult = faceapi.resizeResults(detections, dims)
                canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
                const minConfidence = 0.05
                faceapi.draw.drawDetections(canvas, resizedResult)
                faceapi.draw.drawFaceExpressions(canvas, resizedResult, minConfidence)
                console.log(detections)
                // console.log(canvas)
            }

        }, 100)

    }
};
