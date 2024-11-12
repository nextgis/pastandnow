import {
  createRouter,
  createWebHistory,
  type RouteRecordRaw,
} from 'vue-router';

import About from './components/NextGIS/About.vue';
import Table from './components/Table/Table.vue';
import Main from './MainComponent.vue';

const routes: RouteRecordRaw[] = [
  { path: '/table', component: Table },
  { path: '/about', component: About },
  { path: '/:catchAll(.*)', component: Main },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});
