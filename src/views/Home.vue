<template>
<div>
  <h1>안녕하세요!</h1>
  <p>{{ userData.attributes.email }}</p>
</div>
</template>

<script>
export default {
  computed:{
    userData(){
      return this.$store.state.userData;
    }
  }
}
</script>

<style scoped>

</style>
