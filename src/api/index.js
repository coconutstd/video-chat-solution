import {API} from "aws-amplify";

function postFaceData(data){
    return API.post('faceApi', '/face', {
        body: data
    })
        .then(result => {
            console.log(result);
        })
        .catch(error => {
            console.log(error);
        })
}

function getFaceData(){
    return API.get('faceApi', '/face', {});
}

export { postFaceData, getFaceData }
