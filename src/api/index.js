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

function getUserData(userId){
    return API.get('userApi', `/user/${userId}`, {});
}

function createUserInfo(data){
    return API.post('userApi', '/user', {
        body: data
    });
}

function updateUserInfo(data){
    return API.put('userApi', '/user', {
        body: data
    })
}

function getStudentList(){
    return API.get('userApi', '/student', {});
}

function createCheckList(data){
    return API.post('userApi', '/check', {
       body: data
    });
}

function getCheckList(){
    return API.get('userApi', '/check', {});
}

async function getDayCheckList(createdAt, title){
    const encode = encodeURI(title);
    return API.get('userApi', `/check/${encode}?createdAt=${createdAt}`, {});
}

function updateCheckList(data){
    return API.put('userApi', '/check', {
        body: data
    });
}

function createMeetingInfo(data){
    return API.post('meetingApi', '/meeting-info', {
        body: data
    });
}

function updateMeetingInfo(data){
    return API.put('meetingApi', '/meeting-info', {
        body: data
    });
}

function deleteMeeting(data){
    return API.del('meetingApi', '/meeting', {
        body: data
    });
}

function getMeetingScore(data){
    return API.get('meetingApi', `/meeting-user-score/${data.userId}`, {
    });
}

function getMeetingInfo(meetingId){
    return API.get('meetingApi', `/meeting-info/${meetingId}`, {

    });
}

export { postFaceData, getFaceData, getMeetingFaceDate, getMeetingList, postScoreData, getUserScoreData, createUserInfo, updateUserInfo, getUserData, getStudentList, createCheckList, getCheckList, getDayCheckList, updateCheckList, createMeetingInfo, updateMeetingInfo, deleteMeeting, getMeetingScore, getMeetingInfo }
