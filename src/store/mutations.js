export default {
    SET_USERDATA(state, userdata){
        state.userData = userdata;
    },
    SET_FACEDATA(state, facedata){
        state.faceData = facedata;
    },
    SET_USER_FACEDATA(state, userfacedata){
        state.userFaceData = userfacedata;
    },
    SET_MEETING_LIST(state, meetinglist){
        state.meetingList = meetinglist;
    },
    SET_USER_SCORE(state, userscoredata){
        state.userScoreData = userscoredata;
    },
    SET_MEETING_FACE(state, meetingfacedata){
        state.meetingFaceData = meetingfacedata;
    },
    SET_USER_DATA(state, userdata){
        state.userData = Object.assign({}, state.userData, userdata);
    },
    SET_STUDENT_LIST(state, studentlist){
        state.studentList = studentlist;
    },
    SET_CHECK_LIST(state, checklist){
        state.checkList = checklist;
    },
    SET_DAY_CHECK_LIST(state, checklist){
        state.dayCheckList = [...state.dayCheckList, checklist];
    },
    UNSET_DAY_CHECK_LIST(state){
        state.dayCheckList = [];
    },
    SET_MEETING_INFO(state, meetingInfo){
        state.meetingInfo = meetingInfo;
    },
    UNSET_MEETING_INFO(state){
        state.meetingInfo = {};
    }

}
