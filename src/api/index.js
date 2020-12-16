import {API} from "aws-amplify";

function postFaceData(data){
    return API.post('faceApi', '/face', {
        body: data
    });
}

function getFaceData(){
    return API.get('faceApi', '/face', {});
}

function getUserFaceData(userId){
    return API.get('faceApi', `/face/${userId}`, {});
}

function getMeetingList(){
    return API.get('meetingApi', '/meeting', {});
}

function postScoreData(data){
    return API.post('faceApi', '/score', {
        body: data
    });
}


export { postFaceData, getFaceData, getUserFaceData, getMeetingList, postScoreData }
