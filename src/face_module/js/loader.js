import * as faceapi from './face-api.min'
import * as videoSize from "@/face_module/js/videoSize";

const S3_URL = 'https://amplify-videochatsolution-dev-233212-deployment.s3.ap-northeast-2.amazonaws.com/'
export let collectedData = new Map()
var interval = 0

export async function loadModels() {
    return Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(S3_URL + 'models/'),
        faceapi.nets.faceLandmark68Net.loadFromUri(S3_URL + 'models/'),
        faceapi.nets.faceRecognitionNet.loadFromUri(S3_URL + 'models/'),
        faceapi.nets.faceExpressionNet.loadFromUri(S3_URL + 'models/'),
        faceapi.nets.ssdMobilenetv1.loadFromUri(S3_URL + 'models/')
    ])
}


export async function loadLabeledImages() {
    // const labels = ['Black Widow', 'Captain America', 'Captain Marvel', 'Hawkeye', 'Jim Rhodes', 'Thor', 'Tony Stark']
    const labels = ['이준의', '김유철']
    return Promise.all(
        labels.map(async label => {
            const descriptions = []
            for (let i = 1; i <= 2; i++) {
                // const img = await faceapi.fetchImage(`../labeled_images/${label}/${i}.jpg`)
                console.log(`${S3_URL}labeled_images/${label}/${i}.jpg`)
                const img = await faceapi.fetchImage(`${S3_URL}labeled_images/${label}/${i}.jpg`)
                // const img = await faceapi.fetchImage(`https://raw.githubusercontent.com/WebDevSimplified/Face-Recognition-JavaScript/master/labeled_images/${label}/${i}.jpg`)
                const detections = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor()
                descriptions.push(detections.descriptor)
            }
            return new faceapi.LabeledFaceDescriptors(label, descriptions)
        })
    )
}

export function faceMatcher(labeledFaceDescriptors) {
    return new faceapi.FaceMatcher(labeledFaceDescriptors, 0.6)
}

export async function getUserMedia(video) {
    return navigator.getUserMedia(
        {video: {}},
        stream => video.srcObject = stream,
        err => console.error(err)
    )
}

export async function videoCallback(video, FaceMatcher) {
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

            const results = FaceMatcher.findBestMatch(resizedDetections.descriptor)
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
            // console.log(detections.expressions)
            let result_entries = Object.entries(detections.expressions)
            // console.log(result_entries)

            for (let i = 0; i < result_entries.length; ++i) {
                if (collectedData.get(result_entries[i][0]) === undefined) {
                    collectedData.set(result_entries[i][0], {val: 0})
                } else {
                    break
                }
            }

            let max_val = 0
            let max_key = ''
            for (let i = 0; i < result_entries.length; ++i) {
                if (result_entries[i][1] > max_val) {
                    max_val = result_entries[i][1]
                    max_key = result_entries[i][0]
                }
            }
            collectedData.get(max_key).val += 1
        }

    }, 250)
}

export function destroyInterval() {
    // for (const [key, value] of collectedData) {
    //     console.log(key, value)
    // }
    clearInterval(interval)
    let target = document.getElementsByTagName('canvas')
    target[0].parentNode.removeChild(target[0])
}

