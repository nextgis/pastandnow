import Vue from 'vue';
import VueRouter from 'vue-router';
import App from './App.vue';
import { router } from './routes';
import store from './store';

Vue.use(VueRouter);

const app = new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App),
});
