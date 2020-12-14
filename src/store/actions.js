import { getFaceData } from "../api/index.js";

export default {

    FETCH_FACE({commit}){
        getFaceData()
            .then(({body}) => {
                commit('SET_FACEDATA', JSON.parse(body));
            })
            .catch(error => {
                console.log(error);
            })
    }
}
