import Vue from "vue";
import App from "./App.vue";
import "@aws-amplify/ui-vue";
import Amplify from "aws-amplify";
import awsconfig from "./aws-exports";
import { store } from './store/index.js';
import { router } from './router/index.js';

Amplify.configure(awsconfig);

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
