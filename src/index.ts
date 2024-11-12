import { createApp } from 'vue';

import pkg from '../package.json';

import vuetify from './plugins/vuetify';
import App from './App.vue';
import pinia from './store';

declare global {
  interface Window {
    version: string;
  }
}
window.version = pkg.version;

const app = createApp(App);

app.use(vuetify);
app.use(pinia);

app.mount('#app');
