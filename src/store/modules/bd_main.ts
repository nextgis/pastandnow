import ngw, { BdMainItem } from '../../api/ngw';

// initial state
// shape: [{ id, quantity }]
const _state = {
  items: [],
  meta: false,
  filtered: [],
  detailItem: false,
};

// getters
const _getters = {
  features: (state, getters, rootState) => state.filtered,
  sortFeatures: (state, getters, rootState) => {
    const filtered = [...state.filtered] as BdMainItem[];
    return filtered.sort((a, b) => {
      return a.properties.name.toUpperCase() > b.properties.name.toUpperCase() ? 1 : -1;
    });
  }
};

// actions
const actions = {

  getAllItems({ commit }) {
    ngw.getLayerMeta(meta => {
      commit('setMeta', meta);
      ngw.getLayerGeoJson(items => {
        commit('setItems', items);
      });
    });

  },

  setFilter({ commit, state }, items) {
    commit('setFilter', items);
    const detail = state.detailItem;
    if (detail) {
      const item = items.find((x: BdMainItem) => x.id === detail.id);
      if (!item) {
        commit('setDetail', false);
      }
    }
  },

  setDetail({ commit, state }, id: number) {
    let item = state.filtered.find((x: BdMainItem) => x.id === id);
    const detail = state.detailItem;
    if (detail && detail.id === id) {
      item = false;
    }
    commit('setDetail', item);
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

  setDetail(state, item) {
    state.detailItem = item;
  },

  setMeta(state, meta) {
    state.meta = meta;
  }

};

export default {
  namespaced: true,
  state: _state,
  getters: _getters,
  actions,
  mutations
};
