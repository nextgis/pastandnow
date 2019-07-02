import ngw, { BdMainItem } from '../../api/ngw';

// initial state
// shape: [{ id, quantity }]
const _state = {
  items: [],
  photos: [],
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

  getPhotos({ commit }) {
    ngw.getPhotos((photos) => {
      commit('setPhotos', photos);
    });
  },

  setFilter({ commit, state }, items) {
    commit('setFilter', items);
    const detail = state.detailItem;
    if (detail) {
      const item = items.find((x: BdMainItem) => {
        const id = x.properties.id;
        return id === detail.id;
      });
      if (!item) {
        commit('setDetail', false);
      }
    }
  },

  setDetail({ commit, state }, id: number) {
    let item = state.filtered.find((x: BdMainItem) => {
      const _id = x.properties.id;
      return _id === id;
    });
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
  },

  setPhotos(state, photos) {
    state.photos = photos;
  }

};

export default {
  namespaced: true,
  state: _state,
  getters: _getters,
  actions,
  mutations
};
