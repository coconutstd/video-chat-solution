import {getFaceData, getMeetingList, getMeetingFaceDate, getUserScoreData, getUserData, getStudentList, getCheckList, getDayCheckList } from "../api/index.js";

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
        return getMeetingList()
            .then((result)=>{
                commit('SET_MEETING_LIST', JSON.parse(result.body));
            })
            .catch(error => {
                console.log(error);
            })
    },
    FETCH_USER_SCORE({commit}, userid){
        return getUserScoreData(userid)
            .then(result => {
                commit('SET_USER_SCORE', result);
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
        return getUserData(userid)
            .then(result => {
                commit('SET_USER_DATA', result);
            })
            .catch(error => {
                console.log(error);
            })
    },
    FETCH_STUDENT_LIST({commit}){
        return getStudentList()
            .then(result => {
                commit('SET_STUDENT_LIST', result);
            })
            .catch(error => {
                console.log(error);
            })
    },
    FETCH_CHECK_LIST({commit}) {
        return getCheckList()
            .then(result => {
                commit('SET_CHECK_LIST', result);
            })
            .catch(error => {
                console.log(error);
            })
    },
    FETCH_DAY_CHECK_LIST({commit}, {title, createdAt}) {
        return getDayCheckList(createdAt, title)
            .then(result => {
                commit('SET_DAY_CHECK_LIST', result);
                return result;
            })
            .catch(error => {
                console.log(error);
            })
    }
}
