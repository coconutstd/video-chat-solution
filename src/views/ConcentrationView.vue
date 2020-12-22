<template>
<v-container fluid v-if="!chartLoading" >
  나의 집중 현황
  <v-row>
    <v-col v-for="chartData in chartDatas" cols="12" md="6">
      <v-card  min-height="550">
        <line-chart :chartData="chartData"></line-chart>
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
  created(){
    bus.$emit('start:spinner');
    this.$store.dispatch('FETCH_USER_SCORE', this.$store.state.userData.username)
      .then(() => {
        bus.$emit('end:spinner');
        this.drawChart();
        this.chartLoading = false;
      })
      .catch(error => console.log(error))
  },
  methods: {
    drawChart(){
      const fetchedData = [...this.$store.state.userScoreData]
          .sort((a, b) => {
            return a.createdAt < b.createdAt ? -1 : a.createdAt < b.createdAt ? 1 : 0;
          })

      const keySets = fetchedData.reduce((keySets, item) => {
        keySets.date.add(item.createdAt.split(' ')[0]);
        return keySets;
      }, {
        date : new Set()
      })

      const dailyData = [...keySets.date.values()].reduce((dailyData, date) => {
        const perDayData = fetchedData.filter(item => item.createdAt.startsWith(date)).map(item => [item.createdAt, item.applied_score]);
        return [...dailyData, {[date] : perDayData}];
      }, []);

      this.chartDatas = [...dailyData.map((data) => {
        return {
          labels: data[Object.keys(data)[0]].map(item => item[0].split(' ')[1]),
          datasets: [{
            label: Object.keys(data)[0],
            backgroundColor: '#f87979',
            data: data[Object.keys(data)[0]].map(item => item[1]),
          }]
        }
      })]
    }
  }

}

</script>

<style scoped>

</style>
