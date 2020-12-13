import { fetchTodos } from "../api/index.js";

export default {
    FETCH_TODOS({commit}){
        fetchTodos()
            .then(response => {
                console.log(response.body);
                commit('SET_TODOS', JSON.parse(response.body));
            })
            .catch(error => {
                console.log(error);
            })
    }
}