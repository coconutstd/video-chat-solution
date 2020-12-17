<template>
<div>
  <v-container fluid>
    <h1 style="display:inline;">안녕하세요!</h1>
    <router-link to="/concentration">{{ userData.attributes.email }}</router-link>
    <v-row>
      <v-col v-for="item in items" cols="12" md="4">
        <MainInfoCard :data="item"></MainInfoCard>
      </v-col>
    </v-row>
    <v-row>
      <v-col v-for="item in meetingData" class="mt-2 mb-2" cols="12" md="4">
        <meeting-card :data="item"></meeting-card>
      </v-col>
    </v-row>
  </v-container>
</div>
</template>

<script>
import MeetingCard from "../components/MeetingCard.vue";
import MainInfoCard from "../components/MainInfoCard.vue";
export default {
  data() {
    return {
        items: [
          {'title' : 'one', 'userId' : '이준의', "bgcolor" : "#F44336"},
          {'title' : 'two', 'userId' : '김유철', "bgcolor" : "#E91E63"},
          {'title' : 'three', 'userId' : '정해창', "bgcolor" : "#9C27B0"},
        ]
    }
  },
  components:{
    MeetingCard,
    MainInfoCard
  },
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
