<template>
<div>
  할일목록
  <p v-for="item in fetchedTodos">{{ item }}</p>
</div>
</template>

<script>
export default {

  computed: {
    fetchedTodos(){
      return this.$store.state.todos;
    }
  },
  created () {
    this.$store.dispatch('FETCH_TODOS');
  }
}
</script>

<style scoped>

</style>
