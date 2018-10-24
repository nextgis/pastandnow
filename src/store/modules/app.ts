// initial state
// shape: [{ id, quantity }]

export type AppPages = 'main' | 'table' | 'about';
export interface AppState {
  drawer?: boolean;
  page?: AppPages;
}

const _state: AppState = {
  drawer: true,
  page: 'main',
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
  }

};

export default {
  namespaced: true,
  state: _state,
  getters: _getters,
  actions,
  mutations
};
