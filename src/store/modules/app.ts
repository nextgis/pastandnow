// initial state
// shape: [{ id, quantity }]
const _state = {
  drawer: true
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
  }



};

// mutations
const mutations = {

  showDrawer(state) {
    state.drawer = true;
  },

  hideDrawer(state) {
    state.drawer = false;
  }

};

export default {
  namespaced: true,
  state: _state,
  getters: _getters,
  actions,
  mutations
};
