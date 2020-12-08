<template>
  <amplify-authenticator>
      <ToolBar></ToolBar>
      <router-view v-bind:user="user"></router-view>
    <amplify-sign-in
        header-text="옴니프로젝트"
        username-alias="username"
        slot="sign-in"
        :form-fields.prop="signInFormFields"
    ></amplify-sign-in>
    <amplify-sign-out></amplify-sign-out>
  </amplify-authenticator>

</template>
<script>
import { onAuthUIStateChange } from '@aws-amplify/ui-components'
import ToolBar from "./ToolBar.vue"

export default {
  name: 'AuthStateApp',
  components: {
    ToolBar
  },
  created() {
    onAuthUIStateChange((authState, authData) => {
      this.authState = authState;
      this.user = authData;
    })
  },
  data() {
    return {
      user: undefined,
      authState: undefined,
      signInFormFields: [
        {
          type: 'username',
          label: '아이디',
          placeholder: '아이디를 입력해주세요',
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
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

:root {
  --amplify-primary-color: #ff6347;
  --amplify-primary-tint: #ff7359;
  --amplify-primary-shade: #e0573e;
}
</style>
