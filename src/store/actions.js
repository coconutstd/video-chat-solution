import {getFaceData, getMeetingList, getUserFaceData} from "../api/index.js";

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
        getUserFaceData(userid)
            .then(({body})=> {
                commit('SET_USER_FACEDATA', JSON.parse(body));
            })
            .catch(error => {
                console.log(error);
            })
    },
    FETCH_MEETING_LIST({commit}){
        getMeetingList()
            .then(({body})=>{
                commit('SET_MEETING_LIST', JSON.parse(body));
            })
            .catch(error => {
                console.log(error);
            })
    }
}
