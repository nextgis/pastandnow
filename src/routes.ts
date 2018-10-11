import VueRouter, { RouteConfig } from 'vue-router';
import About from './components/About.vue';

const routes: RouteConfig[] = [
  { path: '/' },
  // { path: '/', redirect: '/about' },
  { path: '/about', component: About }
];
export const router: VueRouter = new VueRouter({
  mode: 'history',
  routes
});
