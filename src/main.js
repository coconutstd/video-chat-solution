import Vue from "vue";
import App from "./App.vue";
import { applyPolyfills, defineCustomElements } from '@aws-amplify/ui-components/loader'
import { Amplify } from 'aws-amplify'
import awsconfig from "./aws-exports";
import { store } from './store/index.js';
import { router } from './router/index.js';
import vuetify from './plugins/vuetify';

Amplify.configure(awsconfig);

applyPolyfills().then(() => {
  defineCustomElements(window)
})

Vue.config.ignoredElements = [/amplify-\w*/];


new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App)
}).$mount("#app");
