import {API} from "aws-amplify";

function postFaceData(data){
    API.post('faceApi', '/face', {
        body: data
    })
        .then(result => {
            console.log(result);
        })
        .catch(error => {
            console.log(error);
        })

}

export { postFaceData }