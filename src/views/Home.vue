<template>
<div>
  <h1>안녕하세요!</h1>
  <router-link :to="`/home/${userData.username}`">{{ userData.attributes.email }}</router-link>
  <pre>
    {{ meetingData }}
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
    },
    meetingData(){
      return this.$store.state.meetingList;
    }
  },
  created() {
    this.$store.dispatch('FETCH_MEETING_LIST');
  }
}
</script>

<style scoped>

</style>
