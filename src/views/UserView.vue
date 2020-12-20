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
  </v-container>

</div>
</template>

<script>
import Amplify, { Storage } from 'aws-amplify';
import awsconfig from '../aws-exports';
Amplify.configure(awsconfig);

export default {
 data(){
   return {
     url: null,
     image: null,
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
      })
        .then(result => console.log(result))
        .catch(err => console.log(err))
      alert('업로드 되었습니다.');
    }
  }
}
</script>

<style scoped>

</style>
