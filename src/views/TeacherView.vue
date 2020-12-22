<template>
  <v-container fluid v-if="!loading">
    <v-divider></v-divider>
    출석부 등록
    <v-date-picker
        v-model="date"
        full-width
        class="mt-4"
    ></v-date-picker>
    <dd-form
        class="preview-form__interface preview-form__interface--advanced"
        :descriptions="descriptions.students"
        :data="output.students"
        @submit="registerChecklist"
    >
    </dd-form>

    <v-divider></v-divider>
    출석부 목록

    <v-expansion-panels multiple hover>
      <v-expansion-panel
          v-for="(item,i) in filteredCheckList"
          :key="i"
      >
        <v-expansion-panel-header>
          {{ item[0] }} {{ item [1] }} 출석부
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <div v-for="student in item[2]">
            <span>
              {{student.name}}
            </span>
            <span v-if="student.isChecked">출석완료 </span>
            <span v-else>미출석</span>
            <v-icon v-if="student.isChecked" color="green">mdi-check</v-icon>
            <v-icon v-else>mdi-account-off</v-icon>
          </div>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </v-container>
</template>

<script>
import ddForm from 'vue-dd-form';
import { createCheckList } from "../api/index";
import { Time } from '../face_module/js/time';
import bus from '../utils/bus.js';

export default {
  components: {
    ddForm,
  },
  data(){
    return {
      output: {
        students: {
          "meeting_title": "",
          "students": [],
        },
      },
      descriptions: {
        students: {
          "meeting_title": {
            "view" : "text",
            "label" : "회의 제목"
          },
          "students": {
            "view": "checkbox",
            "label": "학생명단",
            "options": [
            ]
          }
        },
      },
      picker: new Date().toISOString().substr(0, 10),
      date: null,
      filteredCheckList: [],
      loading: true,
    }
  },
  computed:{
    dayCheckList(){
      return this.$store.state.dayCheckList;
    }
  },
  async created(){
    bus.$emit('start:spinner');
    await this.fetchData();
    bus.$emit('end:spinner');
    this.loading = false;
  },
  methods: {
    async fetchData(){
      await this.$store.dispatch('FETCH_STUDENT_LIST');
      this.descriptions = {...Object.assign({},
            {
              students: {
                "meeting_title": {
                  "view" : "text",
                  "label" : "회의 제목"
                },
                "students":{
                  "view": "checkbox",
                  "label": "학생명단",
                  "options": [...this.$store.state.studentList.map(item => item.name)]
                }
              }
            })}
      await this.$store.dispatch('FETCH_CHECK_LIST');
      const checkList = this.$store.state.checkList.reduce((items, item) => {
        if(items[0].includes(item.createdAt) && items[1].includes(item.meeting_title))
          return items;
        else
          return [[...items[0], item.createdAt], [...items[1], item.meeting_title]]
      }, [[],[]])
      for(let i = 0; i < checkList[0].length; ++i){
        this.filteredCheckList.push([checkList[0][i], checkList[1][i]]);
      }
      this.filteredCheckList = [...this.filteredCheckList.sort()];

      this.filteredCheckList = this.filteredCheckList.map(item => {
        let retVal = [...item];
        this.$store.dispatch('FETCH_DAY_CHECK_LIST', {createdAt: item[0], title:item[1]})
            .then(result => {
              retVal.push(result);
            })
        return retVal;
      })
    },
    registerChecklist(){
      const createdAt = new Time();
      const postData = this.output.students.students.map(item =>  {
        return {
          'name' : item,
          'createdAt': this.date,
          'meeting_title': this.output.students.meeting_title,
          'isChecked': false
        }
      })
      console.log(postData);
      if(postData[0].meeting_title === undefined || postData[0].createdAt === undefined) {
        alert('회의제목, 날짜를 모두 입력해주세요');
        return;
      }
      postData.forEach(item => {
        createCheckList(item);
      })
      alert('등록완료');
    }
  },
  beforeDestroy() {
    this.$store.commit('UNSET_DAY_CHECK_LIST');
  }
}
</script>

<style lang="scss">
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
.copyright {
  text-align: left;
  padding-left: 20px;
  color: #959595;
  font-weight: 500;
}
.highlight {
  color: #42b983;
}
.switcher {
  &__item {
    cursor: pointer;
    color: #2c3e50;
    transition: 0.3s all ease;
    font-size: 18px;
    padding: 0 20px;
    &--active, &:hover {
      color: #42b983;
      text-decoration: underline;
    }
  }
}
.preview-form {
  width: 100%;
  background: white;
  padding: 40px 0;
  margin-top: 40px;
  &__interface {
    text-align: left;
    max-width: 700px;
    margin: 0 auto;
    &--wrappers {
      max-width: 100% !important;
      .view--root > .view--branch {
        flex-direction: row !important;
        flex-wrap: wrap !important;
        justify-content: left;
      }
      .row--boxed {
        margin-right: 60px;
      }
      .row--boxed .view__wrapper, .row--boxed .view__container {
        width: 100%;
      }
      .milestones {
        margin-top: 60px;
      }
    }
  }
}
.preview-code {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  margin-top: 60px;
  &__box {
    width: 42.5%;
  }
}
</style>
