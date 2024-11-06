<template>
  <v-app>
    <v-main>
      <OralMap :map-options="mapOptions" :full-filling="true">
        <vue-ngw-control position="top-left" :margin="true">
          <v-btn
            v-if="!drawer"
            fab
            small
            class="rectangle-fab"
            color="#fff"
            @click="drawer = !drawer"
          >
            <v-icon class="drawe-icon" :class="{ active: drawer }">{{
              svg.chevron_right
            }}</v-icon>
          </v-btn>
        </vue-ngw-control>
        <vue-ngw-control position="bottom-left" :margin="true">
          <div v-if="legendOpen" class="d-flex flex-column">
            <v-card
              v-if="legendItems.length"
              class="mx-auto legend-card"
              max-width="300"
              max-height="500"
              dark
            >
              <div class="legend-header flex-header-content">
                <div class="d-flex justify-space-between align-center">
                  <span class="legend-card__title">Легенда</span>
                  <v-btn
                    class="legend__close"
                    icon
                    small
                    @click="legendOpen = false"
                  >
                    <v-icon>{{ svg.close }}</v-icon>
                  </v-btn>
                </div>
              </div>
              <div class="flex-grow-1 flex-body-content legend-body">
                <LegendComponent class="pt-0" />
              </div>
            </v-card>
          </div>
          <div v-else>
            <v-btn
              fab
              small
              class="rectangle-fab"
              color="#fff"
              @click="legendOpen = !legendOpen"
            >
              <v-icon :class="{ active: drawer }">{{ svg.list }}</v-icon>
            </v-btn>
          </div>
        </vue-ngw-control>
      </OralMap>
    </v-main>

    <v-navigation-drawer v-model="drawer" stateless fixed app width="360">
      <div class="drawer-content d-flex flex-column">
        <div class="flex-header-content">
          <v-btn
            class="detail-drawer__header-close"
            text
            icon
            small
            dark
            @click="drawer = false"
          >
            <v-icon>{{ svg.close }}</v-icon>
          </v-btn>
          <div class="place-select">
            <SelectPlace />
          </div>
          <v-list v-if="filterPanelOpen">
            <v-list-item @click="filterPanelOpen = false">
              <v-icon class="text--secondary mr-2">{{ svg.arrow_back }}</v-icon>
              <span class="text--secondary"> Вернуться к списку объектов </span>
            </v-list-item>
          </v-list>
          <div
            v-else
            class="list-toolbar"
            :class="{ shadowed: listIsScrolled }"
          >
            <div class="d-flex justify-space-between align-center mb-4">
              <span class="subtitle-1 font-weight-medium">
                Объекты
                <v-chip class="list-toolbar__count font-weight-medium" small>
                  <template v-if="isFilterSet">
                    {{ filtered.length }}&nbsp;<span class="text--secondary"
                      >из&nbsp;{{ activePlaceItems.length }}</span
                    >
                  </template>
                  <template v-else>
                    {{ activePlaceItems.length }}
                  </template>
                </v-chip>
              </span>
              <span>
                <v-btn
                  v-if="isFilterSet"
                  class="px-1"
                  small
                  text
                  color="primary"
                  @click="resetNonPlaceFilter"
                >
                  Сбросить
                </v-btn>
                <v-btn
                  text
                  icon
                  small
                  class="filter-btn"
                  @click="filterPanelOpen = true"
                >
                  <v-icon
                    class="filter-btn"
                    color="primary"
                    @click="filterPanelOpen = true"
                    >{{ svg.filter }}</v-icon
                  >
                </v-btn>
              </span>
            </div>
            <v-text-field
              v-model="listSearchText"
              :loading="!searchReady"
              cache-items
              flat
              solo
              dense
              outlined
              hide-no-data
              hide-details
              clearable
              placeholder="Поиск..."
              :prepend-inner-icon="svg.search"
            ></v-text-field>
          </div>
        </div>
        <div id="panel-content" class="flex-grow-1 flex-body-content">
          <div
            v-if="items && items.length"
            v-scroll:#panel-content="onPanelScroll"
            class="pb-3"
          >
            <FilterPanel
              v-if="filterPanelOpen"
              @close="filterPanelOpen = false"
            ></FilterPanel>
            <ListComponent v-else class="pt-0"></ListComponent>
          </div>
          <div v-if="featuresLoading">
            <div class="pa-3 text-center">
              <v-progress-circular
                indeterminate
                color="primary"
              ></v-progress-circular>
            </div>
          </div>
        </div>
        <!-- <div class="flex-footer-content">
          <v-item-group class="bottom-button">
            <v-btn text color="grey">
              <v-icon>save_alt</v-icon>
            </v-btn>
            <v-btn text @click="page = 'table'" color="grey">
              <v-icon @click="page = 'table'">table_chart</v-icon>
            </v-btn>
          </v-item-group>
        </div>-->
      </div>
    </v-navigation-drawer>

    <v-navigation-drawer
      class="detail-drawer"
      :value="detailDrawer"
      stateless
      width="360"
      absolute
      app
      right
    >
      <div v-if="detail" class="drawer-content d-flex flex-column">
        <div
          v-scroll:#detail-content="onDetailScroll"
          class="detail-drawer__header flex-header-content"
          :class="{ shadowed: detailIsScrolled }"
        >
          <div class="pb-3 d-flex justify-space-between align-center">
            <v-btn
              class="detail-drawer__header-close"
              text
              icon
              small
              @click="detail = null"
            >
              <v-icon>{{ svg.close }}</v-icon>
            </v-btn>
            <v-chip
              class="detail-drawer__header-chip text-uppercase font-weight-bold"
              :color="
                detail.properties.status === 'существующий'
                  ? '#7bd235'
                  : '#d2357b'
              "
              dark
              small
              label
              >{{ detail.properties.status }}</v-chip
            >
          </div>
          <div class="subtitle-1 font-weight-medium">
            {{ detail.properties.name }}
          </div>
          <div class="caption text--secondary">
            {{ detail.properties.type }}
          </div>
        </div>
        <div
          id="detail-content"
          class="detail-drawer__content flex-grow-1 flex-body-content"
        >
          <DetailComponent />
        </div>
        <div class="detail-drawer__footer flex-footer-content">
          <div class="bottom-buttons">
            <div class="bottom-buttons__item">
              <v-btn text color="primary" @click="openFeedbackPage">
                <v-icon left>{{ svg.feedback }}</v-icon>
                Обратная связь
              </v-btn>
            </div>
            <v-divider class="mx-1 my-2" inset vertical></v-divider>
            <div class="bottom-buttons__item">
              <v-btn
                text
                color="primary"
                @click="zoomTo(detail.properties.id1)"
              >
                <v-icon left>{{ svg.target }}</v-icon>
                На карте
              </v-btn>
            </div>
            <v-divider class="mx-1 my-2" inset vertical></v-divider>
            <div class="bottom-buttons__item">
              <v-btn text color="primary" @click="shareDialog = true">
                <v-icon left>{{ svg.share }}</v-icon>
              </v-btn>
            </div>
          </div>
        </div>
      </div>
    </v-navigation-drawer>
    <v-dialog v-model="shareDialog" width="500">
      <v-card>
        <v-card-title class="text-h5 grey lighten-2"> Поделиться </v-card-title>

        <v-card-text>
          <ShareComponent v-if="detail" :item="detail" />
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="shareDialog = false">
            Закрыть
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script setup lang="ts">
import {
  mdiArrowLeft,
  mdiChevronRight,
  mdiClose,
  mdiCrosshairsGps,
  mdiFilter,
  mdiFormatListBulleted,
  mdiMagnify,
  mdiMapMarker,
  mdiMessageAlert,
  mdiShareVariant,
} from '@mdi/js';
import { VueNgwControl } from '@nextgis/vue2-ngw-map';
import { computed, onMounted, ref, watch } from 'vue';

import { prepareFilterData } from '../scripts/prepareFilterData';

import DetailComponent from './components/DetailComponent.vue';
import FilterPanel from './components/FilterPanel.vue';
import LegendComponent from './components/LegendComponent.vue';
import ListComponent from './components/List/ListComponent.vue';
import OralMap from './components/OralMap.vue';
import SelectPlace from './components/SelectPlace/SelectPlace.vue';
import ShareComponent from './components/Share/ShareComponent.vue';
import config from './config';
import { useWindowSize } from './hooks/useWindowSize';
import { connector } from './services/ngw';
import { url } from './services/url';
import { useAppStore } from './store/modules/app';
import { useOralStore } from './store/modules/oral';
import throttle from './store/utils/throttle';

import type { OralFeature, OralProperties } from './interfaces';
import type { NgwMapOptions } from '@nextgis/ngw-map';

const { qmsId, feedbackUrl } = config;

const appStore = useAppStore();
const oralStore = useOralStore();
const { windowSize, isMobile } = useWindowSize();

const legendOpen = ref(true);
const shareDialog = ref(false);
const filterPanelOpen = ref(false);
const listIsScrolled = ref(false);
const detailIsScrolled = ref(false);
const throttleSave = ref(
  throttle((value: string) => {
    oralStore.setListSearchText(value);
  }, 1000),
);

const svg = {
  close: mdiClose,
  filter: mdiFilter,
  search: mdiMagnify,
  place: mdiMapMarker,
  share: mdiShareVariant,
  target: mdiCrosshairsGps,
  arrow_back: mdiArrowLeft,
  feedback: mdiMessageAlert,
  list: mdiFormatListBulleted,
  chevron_right: mdiChevronRight,
};

const mapOptions: NgwMapOptions = {
  connector,
  target: 'map',
  center: [37.63, 55.75],
  zoom: 10,
  qmsId,
  controls: ['ZOOM', 'ATTRIBUTION'],
  controlsOptions: {
    ZOOM: { position: 'top-right' },
    ATTRIBUTION: { position: 'bottom-right' },
  },
};

const detailDrawer = computed(() => !!oralStore.detailItem);

const items = computed<OralProperties[]>(() =>
  oralStore.items.map((x) => x.properties),
);

const filtered = computed(() => oralStore.filtered);

const activePlaceItems = computed(() => oralStore.activePlaceItems);

const zoomTo = (id: string) => {
  appStore.zoomTo(id);
};

const isFilterSet = computed(
  () => filtered.value.length !== activePlaceItems.value.length,
);

const featuresLoading = computed(() => oralStore.featuresLoading);

const searchReady = computed(() => oralStore.searchReady);

const legendItems = computed(() => oralStore.legendItems);

const listSearchText = computed({
  get: () => oralStore.listSearchText,
  set: (value: string) => throttleSave.value(value),
});

const drawer = computed({
  get: () => appStore.drawer,
  set: (value: boolean) => appStore.toggleDrawer(value),
});

const detail = computed({
  get: () => oralStore.detailItem,
  set: (value: null | OralFeature) => {
    const id1 = value && value.properties.id1;
    oralStore.setDetail(id1 ? Number(id1) : null);
  },
});

watch(listSearchText, (val: string) => {
  oralStore.setFullTextFilter(val);
});

watch(detail, (val: null | OralFeature) => {
  const id = val && val.properties.id1;
  if (!id) {
    detailIsScrolled.value = false;
    url.remove('id');
  } else {
    url.set('id', id !== undefined ? String(id) : '');
  }
  // for work with IFRAME
  if (window.parent) {
    window.parent.postMessage(JSON.stringify({ detail: id }), '*');
  }
});

const resolveDrawer = () => {
  if (detail.value && isMobile.value) {
    drawer.value = false;
  }
};

watch(() => windowSize.value, resolveDrawer);
watch(detail, resolveDrawer);

const resetNonPlaceFilter = () => {
  oralStore.resetNonPlaceFilter();
};

onMounted(() => {
  throttleSave.value = throttle(setListSearchText, 1000);
});

onMounted(async () => {
  const setFilterData = () => {
    const filterData = prepareFilterData(
      oralStore.items.map((x) => x.properties),
    );
    oralStore.setFilterData(filterData);
  };
  const id = url.get('id');
  if (id !== undefined) {
    try {
      const feature = await oralStore.setDetailById(id);
      if (feature) {
        watch(
          () => appStore.mapReady,
          () => {
            if (appStore.mapReady) {
              appStore.zoomTo(feature.properties.id1);
            }
          },
          { immediate: true },
        );
      }
    } catch (er) {
      url.remove('id');
    }
  }
  oralStore.getAllItems().then(() => {
    setFilterData();
    oralStore.resetSpecialFilter();
    oralStore.loadStories().then(setFilterData);
  });
  oralStore.getPhotos();
});

const setListSearchText = (value: string) => {
  oralStore.setListSearchText(value);
};

const openFeedbackPage = () => {
  window.open(feedbackUrl, '_blank');
};

const onPanelScroll = (e: { target: HTMLElement }) => {
  listIsScrolled.value = e.target.scrollTop > 0;
};

const onDetailScroll = (e: { target: HTMLElement }) => {
  detailIsScrolled.value = e.target.scrollTop > 0;
};
</script>

<style>
.v-text-field.v-input--dense .v-input__prepend-inner .v-input__icon > .v-icon {
  margin-top: 0;
}
</style>

<style lang="scss" scoped>
.place-select {
  background: $primary;
}

.rectangle-fab {
  border-radius: $border-radius-root;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.25);

  .v-btn__content .v-icon {
    color: $icon-color;
  }

  &:hover {
    .v-btn__content .v-icon {
      color: $icon-color-active;
    }
  }
}

.legend-body {
  overflow: auto;
  max-height: 50vh;
}

.legend__close {
  opacity: 0.5;
  margin-right: -8px;

  &:hover {
    opacity: 1;
  }
}

.drawer-content {
  height: 100%;
}

.subtitle {
  color: #a0a8ab;
}

.flex-body-content {
  overflow: auto;
}

.drawe-icon {
  &.active {
    -webkit-transform: rotate(-180deg);
    transform: rotate(-180deg);
  }
}

.bottom-buttons {
  width: 100%;
  display: flex;
  justify-content: space-around;
  .v-btn {
    flex-grow: 1;
    margin: 0;
  }
}

.legend-card {
  &.theme--dark {
    background-color: rgba(0, 0, 0, 0.75);
  }

  .legend-header {
    padding: 12px 16px 0;
  }

  &__title {
    font-size: 14px;
    font-weight: 600;
  }
}

.list-toolbar {
  padding: 16px 20px 20px;
}

.detail-drawer {
  &__header,
  &__content,
  &__footer {
    padding-left: 20px;
    padding-right: 20px;
  }

  &__header {
    padding-top: 16px;
    padding-bottom: 16px;
  }

  &__footer {
    background-color: #f1f4f5;
    padding-top: 4px;
    padding-bottom: 4px;
  }

  &__header-close {
    position: absolute;
    top: 15px;
    right: 16px;
  }

  &__header-chip {
    font-size: 10px;
  }
}

.shadowed {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.24);
}
</style>
