<template>
  <amplify-authenticator>
      <ToolBar></ToolBar>
      <router-view v-bind:user="user"></router-view>
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
      authState: undefined
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
</style>
