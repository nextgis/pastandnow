import Vue from 'vue';
import VueRouter from 'vue-router';
import App from './App.vue';
// import { router } from './routes';
import store from './store';
import Vuetify from 'vuetify';
import 'vuetify/dist/vuetify.min.css';
import { version } from '../package.json';
// import 'material-design-icons-iconfont/dist/material-design-icons.css';

Vue.use(Vuetify);
Vue.use(VueRouter);

const app = new Vue({
  el: '#app',
  // router,
  store,
  render: h => h(App),
});

declare global {
  interface Window {
    version: string;
  }
}

window.version = version;
