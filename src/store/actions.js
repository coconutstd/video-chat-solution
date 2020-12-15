import {getFaceData, getUserFaceData} from "../api/index.js";

export default {

    FETCH_FACE({commit}){
        getFaceData()
            .then(({body}) => {
                commit('SET_FACEDATA', JSON.parse(body));
            })
            .catch(error => {
                console.log(error);
            })
    },
    FETCH_USER_FACE({commit}, userid){
        console.log(userid);
        getUserFaceData(userid)
            .then(({body})=> {
                commit('SET_USER_FACEDATA', JSON.parse(body));
            })
            .catch(error => {
                console.log(error);
            })
    }
}
