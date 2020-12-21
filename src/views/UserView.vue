<template>
<div>
  <v-container fluid>
    사용자 사진 업로드
    <v-file-input
        label="File input"
        filled
        show-size
        accept="image/png, image/jpeg, image/jpg"
        prepend-icon="mdi-camera"
        @change="previewImage"
        v-model="image"
    ></v-file-input>
    <v-btn @click="uploadImage">
      업로드
    </v-btn>
    <v-img :src="url"></v-img>
    <v-spacer></v-spacer>

    <dd-form
        class="preview-form__interface preview-form__interface--basic"
        :descriptions="descriptions.basic"
        :data="output.basic"
        @submit="updateUser"
    >
    </dd-form>
  </v-container>

</div>
</template>

<script>
import Amplify, { Storage } from 'aws-amplify';
import awsconfig from '../aws-exports';
import { updateUserInfo } from "../api";
import ddForm from 'vue-dd-form';
import descriptionsBasic from '../assets/descriptions-basic.json'
import { Time } from '../face_module/js/time';

Amplify.configure(awsconfig);

export default {
  components: {
    ddForm
  },
 data(){
   return {
     url: null,
     image: null,
     output: {
       basic: {
         "name": this.$store.state.userData.name,
         "education": {
           "status": this.$store.state.userData.isTeacher,
         }
       },
       advanced: {},
       dynamic: {},
       custom: {},
       wrappers: {},
     },
     descriptions: {
       basic: descriptionsBasic,
     },
   }
 },
  methods: {
    previewImage() {
      this.url= URL.createObjectURL(this.image)
    },
    uploadImage(){
      if(this.image === null) {
        alert('이미지를 등록해주세요');
        return
      }
      Storage.put(`${this.$store.state.userData.username}/1.jpg`, this.image, {
        acl: 'public-read'
      })
        .then(result => console.log(result))
        .catch(err => console.log(err))
      alert('업로드 되었습니다.');
    },
    updateUser(){
      const updatedAt = new Time();
      if(this.output.basic.name === '' || this.output.basic.education.status === '') {
        alert('이름, 구분 모두 입력해주세요');
        return;
      }
      updateUserInfo({
        isTeacher : this.output.basic.education.status,
        name : this.output.basic.name,
        updatedAt : `${updatedAt.yyyymmdd()} ${updatedAt.hhmmssms()}`
      })
      alert('정보가 업데이트 되었습니다.');
    }
  }
}
</script>

<style scoped>

</style>
