<template>
  <amplify-authenticator>
      <Home></Home>
      <amplify-sign-out></amplify-sign-out>
  </amplify-authenticator>

</template>
<script>
import { onAuthUIStateChange } from '@aws-amplify/ui-components'
import Home from "./Home";

export default {
  name: 'AuthStateApp',
  components: {
    Home
  },
  created() {
    onAuthUIStateChange((authState, authData) => {
      this.authState = authState;
      this.user = authData;
      this.$router.push('/home')
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
