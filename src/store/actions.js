import {getFaceData, getMeetingList, getMeetingFaceDate, getUserScoreData, getUserData, getStudentList, getCheckList } from "../api/index.js";

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
    // FETCH_USER_FACE({commit}, userid){
    //     getUserFaceData(userid)
    //         .then(({body})=> {
    //             commit('SET_USER_FACEDATA', JSON.parse(body));
    //         })
    //         .catch(error => {
    //             console.log(error);
    //         })
    // },
    FETCH_MEETING_LIST({commit}){
        getMeetingList()
            .then((result)=>{
                commit('SET_MEETING_LIST', JSON.parse(result.body));
                return result;
            })
            .catch(error => {
                console.log(error);
            })
    },
    FETCH_USER_SCORE({commit}, userid){
        getUserScoreData(userid)
            .then(result => {
                commit('SET_USER_SCORE', result);
                return result;
            })
            .catch(error => {
                console.log(error);
            })
    },
    FETCH_MEETING_FACE({commit}, meetingtitle){
        getMeetingFaceDate(meetingtitle)
            .then(({body}) => {
                commit('SET_MEETING_FACE', JSON.parse(body));
            })
            .catch(error => {
                console.log(error);
            })
    },
    FETCH_USER_DATA({commit}, userid) {
        getUserData(userid)
            .then(result => {
                commit('SET_USER_DATA', result);
                return result;
            })
            .catch(error => {
                console.log(error);
            })
    },
    FETCH_STUDENT_LIST({commit}){
        getStudentList()
            .then(result => {
                commit('SET_STUDENT_LIST', result);
                return result;
            })
            .catch(error => {
                console.log(error);
            })
    },
    FETCH_CHECK_LIST({commit}) {
        getCheckList()
            .then(result => {
                commit('SET_CHECK_LIST', result);
                return result;
            })
            .catch(error => {
                console.log(error);
            })
    }
}
