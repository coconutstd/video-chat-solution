/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable no-inner-declarations */
import * as videoSize from './videoSize'
// import * as faceapi from './face-api'
import * as faceapi from './face-api.min'

var interval = 0
let labeledFaceDescriptors = null;
let faceMatcher = null;

const S3_URL = 'https://amplify-videochatsolution-dev-233212-deployment.s3.ap-northeast-2.amazonaws.com/'

export class Capture {

    constructor(videoTile) {
        this.video = videoTile
    }

    uncapture() {
        console.log('제거')
        clearInterval(interval)
        let target = document.getElementsByTagName('canvas')
        // console.log(target)
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
                faceapi.nets.tinyFaceDetector.loadFromUri(S3_URL + 'models/'),
                faceapi.nets.faceLandmark68Net.loadFromUri(S3_URL + 'models/'),
                faceapi.nets.faceRecognitionNet.loadFromUri(S3_URL + 'models/'),
                faceapi.nets.faceExpressionNet.loadFromUri(S3_URL + 'models/'),
                faceapi.nets.ssdMobilenetv1.loadFromUri(S3_URL + 'models/')
            ]).then(start)


            async function start() {
                startVideo()
                labeledFaceDescriptors = await videoSize.loadLabeledImages()
                faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors, 0.6)
                // console.log(faceMatcher)
            }


            async function startVideo() {
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
        console.log(document.getElementsByTagName('canvas')[0])
        document.getElementsByTagName('canvas')[0].addEventListener('click', () => {
                console.log('clicked')
                let videoTag = document.getElementById('video-16')
                if (videoTag.mozRequestFullScreen) {
                    videoTag.mozRequestFullScreen();
                } else if (videoTag.webkitRequestFullScreen) {
                    videoTag.webkitRequestFullScreen();
                }
            }
        )

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
            })).withFaceLandmarks().withFaceExpressions().withFaceDescriptor()

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
                const resizedDetections = faceapi.resizeResults(detections, dims)

                const results = faceMatcher.findBestMatch(resizedDetections.descriptor)
                // const results = resizedDetections.map(d => faceMatcher.findBestMatch(d.descriptor))
                // const results = resizedDetections.map(d => {
                //   console.log(d.descriptor)
                //   faceMatcher.findBestMatch(d.descriptor)
                //   return faceMatcher.findBestMatch(d.descriptor);
                // })
                // console.log(detections.toString())

                // console.log(results.toString())
                canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
                const minConfidence = 0.05

                const box = resizedDetections.detection.box

                const drawBox = new faceapi.draw.DrawBox(box, {label: "         [" + results.toString() + "]"})
                drawBox.draw(canvas)

                faceapi.draw.drawDetections(canvas, resizedDetections)
                faceapi.draw.drawFaceExpressions(canvas, resizedDetections, minConfidence)
                console.log(detections)
                console.log(results)
                // console.log(canvas)
            }

        }, 250)

    }
}
