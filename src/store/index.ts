import Vue from 'vue';
import Vuex from 'vuex';

import type { AppState } from './modules/app';
import type { OralState } from './modules/oral';

Vue.use(Vuex);

// @ts-ignore
const strict = process.env.NODE_ENV !== 'production';

export interface RootState {
  app: AppState;
  oral: OralState;
}

// Declare empty store first, dynamically register all modules later.
export default new Vuex.Store<RootState>({ strict });
