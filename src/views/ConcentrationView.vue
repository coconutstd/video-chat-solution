<template>
<v-container fluid>
  나의 집중 현황
  <div class="text-lg-center pa-5" style="width: 100%;" v-if="chartLoading">
    <v-progress-circular
        width="7"
        size="70"
        indeterminate
        color="red"
    ></v-progress-circular>
  </div>
  <v-row>
    <v-col v-for="chartData in chartDatas" cols="12" md="6">
      <v-card  min-height="550">
        <line-chart :chartData="chartData" v-if="!chartLoading" ></line-chart>
      </v-card>
    </v-col>
  </v-row>

</v-container>
</template>

<script>
import LineChart from "../plugins/LineChart";
import bus from '../utils/bus.js';

export default {
  components:{
    LineChart
  },
  data(){
    return {
      chartLoading: true,
      chartDatas: [],
    }
  },
  async created(){
    await this.$store.dispatch('FETCH_USER_SCORE', this.$store.state.userData.username)
      .then(() => {
        bus.$emit('end:spinner');
        this.init();
      })
      .catch(error => console.log(error))
  },
  methods: {
    init(){
      setTimeout(() => {
        let fetchedData = [...this.$store.state.userScoreData];
        let totalScore = fetchedData.reduce((sum, cur) => {
          return sum + cur.applied_score;
        }, 0)
        let title_set = new Set();
        let date_set = new Set();
        fetchedData.forEach( cur => {
          title_set.add(cur.meeting_title);
          date_set.add(cur.createdAt.split(' ')[0]);
        })
        console.log(totalScore);
        console.log(title_set);
        console.log(date_set);

        fetchedData.sort((a, b) => {
          return a.createdAt < b.createdAt ? -1 : a.createdAt < b.createdAt ? 1 : 0;
        })

        let dailyData = [];
        date_set.forEach(date => {
          const perDayData = fetchedData.filter(item => item.createdAt.startsWith(date))
          const tempPerDayData = perDayData.map(item => {
            return [item.createdAt, item.applied_score];
          })
          dailyData.push({[date] : tempPerDayData});
        })
        console.log(dailyData);

        dailyData.forEach((data) => {
          this.chartDatas.push({
            labels: data[Object.keys(data)[0]].map(item => item[0].split(' ')[1]),
            datasets: [{
              label: Object.keys(data)[0],
              backgroundColor: '#f87979',
              data: data[Object.keys(data)[0]].map(item => item[1]),
            }]
          });
        })
        this.chartLoading = false;
      }, 1000);
    }
  }

}

</script>

<style scoped>

</style>
