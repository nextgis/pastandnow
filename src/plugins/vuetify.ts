import Vue from 'vue';
// @ts-ignore
import Vuetify from 'vuetify/lib';
import { Framework } from 'vuetify';

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
