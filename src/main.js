import Vue from "vue";
import App from "./App.vue";
import router from './router'
import "@aws-amplify/ui-vue";
import Amplify from "aws-amplify";
import awsconfig from "./aws-exports";

Amplify.configure(awsconfig);

new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");
