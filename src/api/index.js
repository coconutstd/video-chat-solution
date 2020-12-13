import {API} from "aws-amplify";

function fetchTodos() {
    return API.get('todosApi', '/todos', {});
}

function fetchTodo(id) {
    return API.get('todosApi', `/todos/${id}`, {});
}

function putTodo(id){
    API.put('todosApi', '/todos', {
        body: {
            id: id,
            text: "todo-2",
            complete: true
        }
    });
}

function postTodo(){
    API.post('todosApi', '/todos', {
        body: {
            text: "todo-1"
        }
    });
}

function deleteTodo(id){
    API.del('todosApi', `/todos/${id}`, {});
}

export { fetchTodos, fetchTodo, putTodo, postTodo, deleteTodo }