import Vue from 'vue';

import pkg from '../package.json';

import App from './App.vue';
import vuetify from './plugins/vuetify';
import store from './store';

//styles
import './style/mapbox.sass';
import './style/custom-vuetify.sass';

const app = new Vue({
  vuetify,
  store,
  render: (h) => h(App),
});
app.$mount('#app');

declare global {
  interface Window {
    version: string;
  }
}

window.version = pkg.version;
