import { createApp } from 'vue';

import pkg from '../package.json';

import App from './App.vue';
import vuetify from './plugins/vuetify';
import pinia from './store';

// import './style/mapbox.scss';
// import './style/custom-vuetify.scss';

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
