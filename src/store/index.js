import Vue from 'vue';
import Vuex from 'vuex';
import actions from "../store/actions.js";
import mutations from "../store/mutations.js";

Vue.use(Vuex);

export const store = new Vuex.Store({
    state : {
        todos: [],
        userData: {},
        faceData: {},
    },
    actions,
    mutations,
});
