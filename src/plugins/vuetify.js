import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';
import ko from 'vuetify/lib/locale/ko';

Vue.use(Vuetify);

export default new Vuetify({
    lang: {
      locales: { ko },
      current: 'ko',
    },
});
