<template>
  <amplify-authenticator>
    <div class="page">
      <header>
        <ToolBar></ToolBar>
      </header>
      <section class="content">
        <router-view></router-view>
      </section>
      <footer>
        OMNI Project
      </footer>
    </div>
    <amplify-sign-in
        header-text="옴니프로젝트"
        username-alias="username"
        slot="sign-in"
        :form-fields.prop="signInFormFields"
    ></amplify-sign-in>
  </amplify-authenticator>

</template>
<script>
import { onAuthUIStateChange } from '@aws-amplify/ui-components'
import ToolBar from "./components/ToolBar.vue"

export default {
  name: 'AuthStateApp',
  components: {
    ToolBar
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

header{
  background-color: lightgray;
}

.page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
.content {
  flex: 1 auto;
  border: 1px solid lightgray;
}
footer{
  text-align: center;
}
</style>
