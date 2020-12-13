<template>
<div>
  <button class="btn-danger" @click.prevent="getTodos">GET</button>
  <button class="btn-primary" :disabled='lastTodoId==""'  @click.prevent="getTodo">GET ONE</button>
  <button class="btn-dark" :disabled='lastTodoId==""' @click.prevent="putTodos">PUT</button>
  <button class="btn-warning" @click.prevent="postTodos">POST</button>
  <button class="btn-success" :disabled='lastTodoId==""' @click.prevent="deleteTodos">DELETE</button>
  <div>CUrrent Todo: {{ lastTodoId || "Not set. Add a new todo" }}</div>
  <pre v-for="todo in todos">{{ todo }}</pre>
</div>
</template>

<script>
import { API } from 'aws-amplify'

export default {
  data(){
    return {
      todos : {},
      lastTodoId : "",
    }
  },
name: "Todo",
  created () {
    API.get('todosApi', '/todos', {}).then(result => {
      console.log(result)
      this.todos = JSON.parse(result.body)
    }).catch(err => {
      console.log(err)
    })
  },
  methods: {
    getTodos(){
      API.get('todosApi', '/todos', {}).then(result => {
        console.log(result)
        this.todos = result.body
      }).catch(err => {
        console.log(err)
      })
    },
    getTodo(){
      const id = this.lastTodoId
      if(!id) return
      API.get('todosApi', `/todos/${id}`, {}).then(result => {
        console.log(result)
      }).catch(err => {
        console.log(err)
      })
    },
    putTodos(){
      const id = this.lastTodoId
      if (!id) return
      console.log(`updateTodo-${id}`)
      API.put('todosApi', '/todos', {
        body: {
          id: id,
          text: "todo-2",
          complete: true
        }
      }).then(result => {
        console.log(result)
      }).catch(err => {
        console.log(err)
      })
    },
    postTodos(){
      API.post('todosApi', '/todos', {
        body: {
          text: "todo-1"
        }
      }).then(result => {
        console.log(result)
        this.lastTodoId = JSON.parse(result.body).id
      }).catch(err => {
        console.log(err)
      })
    },
    deleteTodos(){
      const id = this.lastTodoId
      if(!id) return
      console.log(`deleteTod-${id}`)
      API.del('todosApi', `/todos/${id}`, {}).then(result => {
        console.log(result)
        this.lastTodoId = ''
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>

<style scoped>

</style>
