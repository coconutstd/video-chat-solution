<template>
  <v-app>
    <amplify-authenticator>
      <tool-bar></tool-bar>
      <v-main>
        <router-view></router-view>
      </v-main>
      <amplify-sign-in
          header-text="옴니프로젝트"
          username-alias="username"
          slot="sign-in"
          :form-fields.prop="signInFormFields"
      ></amplify-sign-in>
    </amplify-authenticator>
  </v-app>
</template>
<script>
import {onAuthUIStateChange} from '@aws-amplify/ui-components'
import ToolBar from "./components/ToolBar.vue"
import Home from "@/views/Home";

export default {
  name: 'AuthStateApp',
  components: {
    ToolBar,
    Home,
  },

  created() {
    onAuthUIStateChange((authState, authData) => {
      this.authState = authState;
      this.user = authData;
      this.$store.commit('SET_USERDATA', authData);
    })
  },
  data() {
    return {
      user: undefined,
      authState: undefined,
      signInFormFields: [
        {
          type: 'username',
          label: '이메일',
          placeholder: '이메일을 입력해주세요',
          required: true,
        },
        {
          type: 'password',
          label: '비밀번호',
          placeholder: '비밀번호를 입력해주세요',
          required: true,
        }
      ]
    }
  },
  beforeDestroy() {
    return onAuthUIStateChange;
  }
}
</script>

<style>
:root {
  --amplify-primary-color: #ff6347;
  --amplify-primary-tint: #ff7359;
  --amplify-primary-shade: #e0573e;
}
</style>
