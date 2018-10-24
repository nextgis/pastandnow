import Vue from 'vue';
// import VueRouter from 'vue-router';
// import { router } from './routes';
import store from './store';
import App from './App.vue';
import { version } from '../package.json';
import Vuetify from 'vuetify/lib';
import 'vuetify/src/stylus/app.styl';
// import 'material-design-icons-iconfont/dist/material-design-icons.css';

Vue.use(Vuetify);
// Vue.use(VueRouter);

const app = new Vue({
  // router,
  store,
  render: h => h(App),
});
app.$mount('#app');

declare global {
  interface Window {
    version: string;
  }
}

window.version = version;
