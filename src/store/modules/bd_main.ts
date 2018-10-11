import ngw from '../../api/ngw';

// initial state
// shape: [{ id, quantity }]
const _state = {
  items: [],
};

// getters
const _getters = {
  features: (state, getters, rootState) => state.items
};

// actions
const actions = {

  getAllItems({ commit }) {
    ngw.getLayerGeoJson(items => {
      commit('setItems', items);
    });
  }

};

// mutations
const mutations = {

  setItems(state, items) {
    state.items = items;
  },

};

export default {
  namespaced: true,
  state: _state,
  getters: _getters,
  actions,
  mutations
};
