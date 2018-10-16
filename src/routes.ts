import VueRouter, { RouteConfig } from 'vue-router';
import About from './components/NextGIS/About.vue';
import Table from './components/Table/Table.vue';
import Main from './Main.vue';

const routes: RouteConfig[] = [
  // { path: '/', redirect: '/about' },
  { path: '/', component: Main },
  { path: '/table', component: Table },
  { path: '/about', component: About }
];
export const router: VueRouter = new VueRouter({
  mode: 'history',
  routes
});
