<template>
  <v-app>
    <amplify-authenticator>
      <tool-bar></tool-bar>
      <v-main>
        <div class="text-lg-center pa-5" style="width: 100%;" v-if="loadingStatus">
          <v-progress-circular
              width="7"
              size="70"
              indeterminate
              color="red"
          ></v-progress-circular>
        </div>
        <router-view>
        </router-view>
      </v-main>
      <amplify-sign-up
          header-text="회원가입"
          slot="sign-up"
          username-alias="email"
          :form-fields.prop="signUpformFields"
      ></amplify-sign-up>
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
import bus from './utils/bus.js'

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
    bus.$on('start:spinner', this.startSpinner);
    bus.$on('end:spinner', this.endSpinner);
  },
  methods: {
    startSpinner() {
      this.loadingStatus = true;
    },
    endSpinner() {
      this.loadingStatus = false;
    }
  },
  data() {
    return {
      loadingStatus: false,
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
      ],
      signUpformFields: [
        {
          type: 'email',
          label: '이메일',
          placeholder: '이메일 주소를 입력해주세요',
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
    bus.$off('start:spinner', this.startSpinner);
    bus.$off('end:spinner', this.endSpinner);
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
