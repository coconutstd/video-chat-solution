<template>
  <v-container fluid>
    선생님뷰
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

      <v-dialog
          v-model="dialog"
          width="500"
          v-for="item in this.$store.state.checkList"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-btn
              color="red lighten-2"
              dark
              v-bind="attrs"
              v-on="on"
          >
            {{ item.createdAt }}  {{ item.meeting_title }}
          </v-btn>
        </template>

        <v-card>
          <v-card-title class="headline grey lighten-2">
            Privacy Policy
          </v-card-title>

          <v-card-text>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
          </v-card-text>

          <v-divider></v-divider>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
                color="primary"
                text
                @click="dialog = false"
            >
              I accept
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
  </v-container>
</template>

<script>
import ddForm from 'vue-dd-form';
import { createCheckList } from "../api/index";
import { Time } from '../face_module/js/time';

export default {
  components: {
    ddForm
  },
  data(){
    return {
      'student': [],
      output: {
        students: {
          "meeting_title": "",
          "students": [],
        },
        advanced: {},
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
    }
  },
  async created(){
    await this.$store.dispatch('FETCH_STUDENT_LIST');
    this.descriptions.students["students"]["options"] = [...Array.from(this.$store.state.studentList.values()).map(item => item.name)];
    await this.$store.dispatch('FETCH_CHECK_LIST');
  },
  methods: {
    registerChecklist(){
      const createdAt = new Time();
      console.log(this.output.students.students);
      const postData = this.output.students.students.map(item =>  {
        return {
          'name' : item,
          'createdAt': this.date,
          'meeting_title': this.output.students.meeting_title,
          'isChecked': false
        }
      })
      console.log(this.date);
      console.log(postData);
      postData.forEach(item => {
        createCheckList(item);
      })
      alert('등록완료');
    }
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
