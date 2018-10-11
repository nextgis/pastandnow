import Vue from 'vue';
import VueRouter from 'vue-router';
import App from './App.vue';
import { router } from './routes';

Vue.use(VueRouter);

const app = new Vue({
  el: '#app',
  router,
  render: h => h(App),
});
