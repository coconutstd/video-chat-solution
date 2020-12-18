<template>
<v-container fluid>
  {{ this.$route.params.id }}
  <div v-for="item in meetingFaceData">{{ item }}</div>
</v-container>
</template>

<script>
export default {
  created() {
    this.$store.dispatch('FETCH_MEETING_FACE', this.$route.params.id);
  },
  computed:{
    meetingFaceData () {
      return this.$store.state.meetingFaceData;
    }
  }
}
</script>

<style scoped>

</style>
