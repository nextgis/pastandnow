import VueRouter from 'vue-router';

import Main from './MainComponent.vue';
import About from './components/NextGIS/About.vue';
import Table from './components/Table/Table.vue';

import type { RouteConfig } from 'vue-router';

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
