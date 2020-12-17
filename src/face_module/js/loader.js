import * as faceapi from './face-api.min'
import * as videoSize from "@/face_module/js/videoSize";
import { postFaceData, postScoreData } from "../../api/index.js";
import { getOpenness } from './bundle'
import { Time } from './time.js';
import { Timer } from 'easytimer.js';

const S3_URL = 'https://amplify-videochatsolution-dev-141403-deployment.s3.ap-northeast-2.amazonaws.com/'
export let collectedData = new Map()
let interval = 0
export let totalTimer = new Timer();
export let secondsTimer = new Timer();
export let logCountTimer = new Timer();
let userLogCount = 0;
let detectedData = {"Items": []};
let totalScore = 100;

export async function loadModels() {
    return Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(`${S3_URL}models/`),
        faceapi.nets.faceLandmark68Net.loadFromUri(`${S3_URL}models/`),
        faceapi.nets.faceRecognitionNet.loadFromUri(`${S3_URL}models/`),
        faceapi.nets.faceExpressionNet.loadFromUri(`${S3_URL}models/`),
        faceapi.nets.ssdMobilenetv1.loadFromUri(`${S3_URL}models/`)
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
    let detectedCount = 0;
    let logCountTimerCount = 0;
    let logCountArr = [];
    let isSecondsTimer = false;
    totalTimer.start();
    logCountTimer.start();
    interval = setInterval(async () => {
        // const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions()
        // const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions({ inputSize, scoreThreshold })).withFaceExpressions()
        console.log(totalTimer.getTimeValues().toString());
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
            detectedCount++;
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

            const eyeData = getOpenness()
            const labeledEyeData = {'left_eye_blink' : eyeData.left, 'right_eye_blink' : eyeData.right }
            const postData = Object.assign({}, detections.expressions, labeledEyeData, getMeetingTitle(), getCreatedTime());
            detectedData.Items.push(postData);
            // console.log(detectedData);
            // console.log(postData)
            postFaceData(postData);
            // console.log(time.yyyymmdd() + ' ' + time.hhmmssms());
        }
        if(logCountTimer.getTimeValues().seconds >= 10){
            logCountArr.push(detectedCount);
            detectedCount = 0;
            logCountTimer.reset();
            logCountTimerCount++;
            if(logCountTimerCount == 3){
                logCountTimerCount = 0;
                logCountTimer.reset();
                const result = logCountArr.reduce((sum, curValue) => {
                    return sum + curValue;
                }, 0);
                userLogCount = result / logCountArr.length;
                console.log(`현재 셋팅된 userLogCount는 ${userLogCount}입니다`);
                if(totalTimer.getTimeValues().minutes >= 2) {
                    logCountTimer.stop();
                }
                if(!isSecondsTimer){
                    detectedData.Items = [];
                    isSecondsTimer = true;
                    secondsTimer.start();
                }
            }
        }
        if(secondsTimer.getTimeValues().seconds >= 10){
            secondsTimer.reset();
            let score = getScore(detectedData);
            totalScore += score
            console.log(`가감스코어==========${score}=====종합스코어=============${totalScore}`);
            const postData = Object.assign({}, getMeetingTitle(), getCreatedTime(), {'score_per_second' : score}, {'applied_score': totalScore}, {'total_time': totalTimer.getTimeValues().toString()});
            postScoreData(postData);
            detectedData.Items = [];
        }
    }, 200)
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

function getMeetingTitle(){
    const meetingTitle = {'meeting_title' : decodeURI(document.location.href.split('?')[1].split('=')[1])};
    return {...meetingTitle};
}

function getCreatedTime(){
    let time = new Time();
    const createdAt = { 'createdAt' : time.yyyymmdd() + ' ' + time.hhmmssms()};
    return {...createdAt};
}

function getScore(data) {
    var idealLogCount = userLogCount
    // var idealLogCount = 1 * userLogCount * 10              // 1초 * 5개 * 10초 = 50개 (1분: 300개, 5분: 1500개)
    var blinkOffSet = 0.03;                      // 두눈이 0.03 이하일 경우 감은 것 (테스트용)
    var neutralOffSet = 0.8;                    // neutral이 0.8 이상
    var blinkBaseOffSet = idealLogCount * 0.5   // 예상했던 로그수의 반이상이 잡힐 때만, 25개 이상의 log가 잡힐 경우만 졸림을 감지

    var logArray = data.Items                   // 대상 로그 배열
    var logCount = logArray.length              // 추출된 로그수
    var blinkCount = 0;                         // 두눈이 모두 감은 경우
    var neutralCount = 0;                       // neutral이 0.8이상인 로그수
    var returnScore = 0;                        // 최종 가감 스코어

    for (let i = 0; i < logCount; i++) {            // 로그 개수 만큼돌면서 변수 계산

        if (logCount >= blinkBaseOffSet && parseFloat(logArray[i].left_eye_blink) <= blinkOffSet &&
            parseFloat(logArray[i].right_eye_blink) <= blinkOffSet) {           // log수가 50%이상 잡히고 두눈을 감은 경우만
                                                                                // console.log(logArray[i].left_eye_blink, logArray[i].right_eye_blink)
            blinkCount += 1;
        }
        if (parseFloat(logArray[i].neutral) >= neutralOffSet) {                 // 일단 neutral만
            neutralCount += 1;
        }
    }

    if (logCount >= blinkBaseOffSet && blinkCount >= blinkBaseOffSet * 0.8) {    // 졸음 감점 시 화면집중과 안면집중 점수는 적용되지 않음 (1분 졸면 -12 급경히 감소)
        returnScore =- 2;
    } else {
        returnScore = (logCount / idealLogCount) - ((idealLogCount - logCount) / idealLogCount) + (neutralCount / idealLogCount);
    }

    console.log("idealLogCount -> " + idealLogCount);
    console.log("logCount -> " + logCount);
    console.log("blinkCount -> " + blinkCount);
    console.log("neutralCount -> " + neutralCount);
    console.log("blinkScore -> " + (blinkCount == logCount));
    console.log("logCount/idealLogCount -> " + (logCount / idealLogCount));
    console.log("neutralCount/idealLogCount -> " + (neutralCount / idealLogCount));

    return returnScore
}
