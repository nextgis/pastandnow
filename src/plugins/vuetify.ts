import Vue from 'vue';
import Vuetify from 'vuetify/lib';

import type { Framework } from 'vuetify';

Vue.use(Vuetify);

export default new Vuetify({
  icons: {
    iconfont: 'mdiSvg', //'mdi' || 'mdiSvg' || 'md' || 'fa' || 'fa4' || 'faSvg'
  },
  theme: {
    dark: false,
    themes: {
      light: {
        primary: '#005e7c',
      },
    },
  },
});

declare module 'vue/types/vue' {
  export interface Vue {
    $vuetify: Framework;
  }
}
