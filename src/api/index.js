import {API} from "aws-amplify";

function postFaceData(data){
    return API.post('faceApi', '/face', {
        body: data
    });
}

function getFaceData(){
    return API.get('faceApi', '/face', {});
}

// function getUserFaceData(userId){
//     return API.get('faceApi', `/face/${userId}`, {});
// }

function getMeetingFaceDate(meetingtitle){
    const encoded_uri = encodeURI(meetingtitle);
    return API.get('faceApi', `/face/${encoded_uri}`, {});
}

function getMeetingList(){
    return API.get('meetingApi', '/meeting', {});
}

function postScoreData(data){
    return API.post('faceApi', '/score', {
        body: data
    });
}

function getUserScoreData(userId){
    return API.get('faceApi', `/score/${userId}`, {});
}


export { postFaceData, getFaceData, getMeetingFaceDate, getMeetingList, postScoreData, getUserScoreData }
