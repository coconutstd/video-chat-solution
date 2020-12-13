<template>
<div>
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
