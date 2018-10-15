import ngw from '../../api/ngw';

// initial state
// shape: [{ id, quantity }]
const _state = {
  items: [],
  filtered: []
};

// getters
const _getters = {
  features: (state, getters, rootState) => state.filtered
};

// actions
const actions = {

  getAllItems({ commit }) {
    ngw.getLayerGeoJson(items => {
      commit('setItems', items);
    });
  },

  setFilter({ commit }, items) {
    commit('setFilter', items);
  }


};

// mutations
const mutations = {

  setItems(state, items) {
    state.items = items;
    state.filtered = items;
  },

  setFilter(state, items) {
    state.filtered = items;
  },

};

export default {
  namespaced: true,
  state: _state,
  getters: _getters,
  actions,
  mutations
};
