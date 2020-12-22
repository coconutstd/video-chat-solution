<template>
  <v-container fluid v-if="!loading">
    <h1 style="display:inline;">안녕하세요!</h1>
    <v-btn v-if="userData.isTeacher==='teacher'" to="/teacher">선생님</v-btn>
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
</template>

<script>
import MeetingCard from "../components/MeetingCard.vue";
import MainInfoCard from "../components/MainInfoCard.vue";
import bus from "../utils/bus.js";
import {createUserInfo} from "@/api";

export default {
  data() {
    return {
        items: [
          {'title' : 'one', 'userId' : '이준의', "bgcolor" : "#F44336"},
          {'title' : 'two', 'userId' : '김유철', "bgcolor" : "#E91E63"},
          {'title' : 'three', 'userId' : '정해창', "bgcolor" : "#9C27B0"},
        ],
        loading: true
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
  async created() {
    bus.$emit('start:spinner');
    await createUserInfo().catch(error => console.log('이미 유저 정보가 있습니다'));
    await this.$store.dispatch('FETCH_MEETING_LIST')
    bus.$emit('end:spinner');
    this.loading = false;
  }
}
</script>

<style scoped>

</style>
