import VueRouter, { RouteConfig } from 'vue-router';
import About from './components/NextGIS/About.vue';
import Table from './components/Table/Table.vue';
import Main from './Main.vue';

const routes: RouteConfig[] = [
  // { path: '/test', component: TestRouter }
  { path: '/table', component: Table },
  { path: './about', component: About },
  { path: '*', component: Main },
];
export const router: VueRouter = new VueRouter({
  // base:  window.location.pathname,
  mode: 'history',
  routes,
});
