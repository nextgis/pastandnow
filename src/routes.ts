import {
  type RouteRecordRaw,
  createRouter,
  createWebHistory,
} from 'vue-router';

import Main from './MainComponent.vue';
import About from './components/NextGIS/About.vue';
import Table from './components/Table/Table.vue';

const routes: RouteRecordRaw[] = [
  { path: '/table', component: Table },
  { path: '/about', component: About },
  { path: '/:catchAll(.*)', component: Main },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});
