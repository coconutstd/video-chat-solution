<template>
<div>
  <div v-for="todo in todos">
    {{ item.title }}
  </div>
</div>
</template>

<script>
import { API } from 'aws-amplify'

export default {
  data(){
    return {
      todos : {}
    }
  },
name: "Todo",
  created () {
    API.get('todosApi', '/todos', {}).then(result => {
      this.todos = JSON.parse(result.body)
    }).catch(err => {
      console.log(err)
    })
  }
}
</script>

<style scoped>

</style>
