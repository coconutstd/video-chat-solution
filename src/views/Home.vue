<template>
<div>
  <h1>안녕하세요!</h1>
  <p>{{ userData.attributes.email }}</p>
  <pre>
    {{ faceData }}
  </pre>
</div>
</template>

<script>
export default {
  computed:{
    userData(){
      return this.$store.state.userData;
    },
    faceData(){
      return this.$store.state.faceData;
    }
  },
  created() {
    this.$store.dispatch('FETCH_FACE');
  }
}
</script>

<style scoped>

</style>
