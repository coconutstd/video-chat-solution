<template>
<div>
  UserView
  <p v-for="item in userFaceData">{{ item }}</p>
</div>
</template>

<script>
export default {
  computed:{
    userFaceData(){
      return this.$store.state.userFaceData;
    }
  },
  created(){
    // console.log(this.$route);
    this.$store.dispatch('FETCH_USER_FACE', this.$route.params.id);
  }
}
</script>

<style scoped>

</style>
