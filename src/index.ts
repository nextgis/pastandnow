import Vue from 'vue';
// import VueRouter from 'vue-router';
// import { router } from './routes';
import store from './store';
import App from './App.vue';
import pkg from '../package.json';

import vuetify from './plugins/vuetify';

//styles
import './style/mapbox.sass';
import './style/custom-vuetify.sass';

// Vue.use(VueRouter);

const app = new Vue({
  // router,
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
