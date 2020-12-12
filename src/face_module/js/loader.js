import * as faceapi from './face-api.min'
import * as videoSize from "@/face_module/js/videoSize";
import { API } from 'aws-amplify'
import { getOpenness } from './bundle'

const S3_URL = 'https://amplify-videochatsolution-dev-233212-deployment.s3.ap-northeast-2.amazonaws.com/'
export let collectedData = new Map()
let interval = 0
let detectedCount = 0
let timeCount = 0
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
    // 전체화면 전환 기
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
        timeCount++
        console.log(`측정시간 ${timeCount} , detect되지 않은 시간${timeCount-detectedCount}`)
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
            detectedCount++
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
            // console.log(detections)
            // console.log(getOpenness())
            const result_entries = Object.entries(detections.expressions)
            const keys = result_entries.map(entry => entry[0])
            const values = result_entries.map(entry => entry[1])
            initExpressionData(keys)
            const max_key = findMaxDetectedExpression(keys, values)
            const curValue = collectedData.get(max_key)
            collectedData.set(max_key, curValue + 1)


            let eyeData = getOpenness()
            const labeledEyeData = {'left_eye_blink' : eyeData.left, 'right_eye_blink' : eyeData.right }
            const postData = Object.assign({}, detections.expressions, labeledEyeData)
            console.log(postData)
            API.post('faceApi', '/face', {
                body: postData
            }).then(result => {
                console.log(result)
            }).catch(err => {
                console.log(err)
            })
        }

    }, 100)
}

export function destroyInterval() {
    clearInterval(interval)
    let target = document.getElementsByTagName('canvas')
    target[0].parentNode.removeChild(target[0])
}

function initExpressionData(keys){
    if(collectedData.size === 0){
        keys.forEach(key => collectedData.set(key, 0))
    }
}

function findMaxDetectedExpression(keys, values){
    let max_val = 0
    let max_key = ''
    for (let i = 0; i < keys.length; ++i) {
        if (values[i] > max_val) {
            max_val = values[i]
            max_key = keys[i]
        }
    }
    return max_key
}
