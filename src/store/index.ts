import Vue from 'vue';
import Vuex from 'vuex';
import bdMain from './modules/bd_main';
// import createLogger from '../../../src/plugins/logger';

// Example projects
// https://github.com/vuejs/vuex/tree/dev/examples/
// Vuex and typescript
// https://github.com/utahta/vue-vuex-typescript-example

Vue.use(Vuex);

// const debug = process.env.NODE_ENV !== 'production';

export default new Vuex.Store({
  modules: {
    bdMain
  },
  // strict: debug,
  // plugins: debug ? [createLogger()] : []
});
