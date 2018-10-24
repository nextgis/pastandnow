// initial state
// shape: [{ id, quantity }]

export type AppPages = 'main' | 'table' | 'about';
export interface AppState {
  drawer?: boolean;
  page?: AppPages;
  center?: [number, number];
}

const _state: AppState = {
  drawer: true,
  page: 'main',
  center: null,
};

// getters
const _getters = {};

// actions
const actions = {


  showDrawer({ commit }) {
    commit('showDrawer');
  },

  hideDrawer({ commit }) {
    commit('hideDrawer');
  },

  toggleDrawer({commit}, value: boolean) {
    if (value) {
      commit('showDrawer');
    } else {
      commit('hideDrawer');
    }
  },

  setPage({commit}, page: AppPages) {
    commit('setPage', page);
  },

  zoomTo({commit}, id: number) {
    commit('setCenter', id);
  }

};

// mutations
const mutations = {

  showDrawer(state) {
    state.drawer = true;
  },

  hideDrawer(state) {
    state.drawer = false;
  },

  setPage(state, page: AppPages) {
    state.page = page;
  },

  setCenter(state, id: number) {
    state.center = id;
  }

};

export default {
  namespaced: true,
  state: _state,
  getters: _getters,
  actions,
  mutations
};
