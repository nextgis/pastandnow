import VueRouter, { RouteConfig } from 'vue-router';
import About from './components/NextGIS/About.vue';
import Table from './components/Table/Table.vue';
import TestRouter from './components/NextGIS/TestRouter.vue';
import Main from './Main.vue';

const routes: RouteConfig[] = [
  { path: '/', component: Main },
  // { path: '/test', component: TestRouter }
  { path: '/table', component: Table },
  { path: '/about', component: About }
];
export const router: VueRouter = new VueRouter({
  mode: 'history',
  routes
});
