<template>
  <VNavigationDrawer v-model="drawer" location="left" width="360">
    <div class="drawer-content d-flex flex-column">
      <div class="flex-header-content">
        <VBtn
          class="detail-drawer__header-close"
          variant="text"
          :size="'small'"
          @click="drawer = false"
        >
          <VIcon>{{ svg.close }}</VIcon>
        </VBtn>
        <div class="place-select">
          <SelectPlace />
        </div>
        <VList v-if="filterPanelOpen">
          <VListItem @click="filterPanelOpen = false">
            <template #prepend>
              <VIcon color="secondary">{{ svg.arrow_back }}</VIcon>
            </template>
            <VListItemTitle class="text-secondary">
              Вернуться к списку объектов
            </VListItemTitle>
          </VListItem>
        </VList>
        <div v-else class="list-toolbar" :class="{ shadowed: listIsScrolled }">
          <div class="d-flex justify-space-between align-center mb-4">
            <span class="text-subtitle-1 font-weight-medium">
              Объекты
              <VChip
                class="list-toolbar__count font-weight-medium"
                size="small"
              >
                <template v-if="isFilterSet">
                  {{ filtered.length }}&nbsp;<span class="text-secondary"
                    >из&nbsp;{{ activePlaceItems.length }}</span
                  >
                </template>
                <template v-else>
                  {{ activePlaceItems.length }}
                </template>
              </VChip>
            </span>
            <span>
              <VBtn
                v-if="isFilterSet"
                class="px-1"
                size="small"
                variant="text"
                color="primary"
                @click="resetNonPlaceFilter"
              >
                Сбросить
              </VBtn>
              <VBtn
                variant="text"
                :size="'small'"
                class="filter-btn"
                @click="filterPanelOpen = true"
              >
                <VIcon class="filter-btn" color="primary">{{
                  svg.filter
                }}</VIcon>
              </VBtn>
            </span>
          </div>
          <VTextField
            v-model="listSearchText"
            :loading="!searchReady"
            flat
            variant="solo"
            density="compact"
            hide-details
            clearable
            placeholder="Поиск..."
            :prepend-inner-icon="svg.search"
          ></VTextField>
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
            <VProgressCircular
              indeterminate
              color="primary"
            ></VProgressCircular>
          </div>
        </div>
      </div>
    </div>
  </VNavigationDrawer>
</template>

<script setup lang="ts">
import { debounce } from '@nextgis/utils';
import { computed, ref, watch } from 'vue';
import {
  VBtn,
  VChip,
  VIcon,
  VList,
  VListItem,
  VListItemTitle,
  VNavigationDrawer,
  VProgressCircular,
  VTextField,
} from 'vuetify/components';

import FilterPanel from '../components/FilterPanel.vue';
import ListComponent from '../components/List/ListComponent.vue';
import SelectPlace from '../components/SelectPlace/SelectPlace.vue';
import { svg } from '../constants';
import { useAppStore } from '../store/modules/app';
import { useOralStore } from '../store/modules/oral';

import type { OralProperties } from '../interfaces';

const appStore = useAppStore();
const oralStore = useOralStore();
const drawer = computed({
  get: () => appStore.drawer,
  set: (value: boolean) => appStore.setDrawer(value),
});

const listIsScrolled = ref(false);
const featuresLoading = computed(() => oralStore.featuresLoading);
const searchReady = computed(() => oralStore.searchReady);
const items = computed<OralProperties[]>(() =>
  oralStore.items.map((x) => x.properties),
);
const filtered = computed(() => oralStore.filtered);
const activePlaceItems = computed(() => oralStore.activePlaceItems);
const isFilterSet = computed(
  () => filtered.value.length !== activePlaceItems.value.length,
);
const resetNonPlaceFilter = () => {
  oralStore.resetNonPlaceFilter();
};

const listSearchText = computed({
  get: () => oralStore.listSearchText,
  set: (value: string) => debounceSave.value(value),
});

const debounceSave = ref(debounce(oralStore.setListSearchText, 1000));

watch(listSearchText, (val: string) => oralStore.setFullTextFilter(val));

const onPanelScroll = (e: { target: HTMLElement }) =>
  (listIsScrolled.value = e.target.scrollTop > 0);

const filterPanelOpen = ref(false);
</script>

<style scoped lang="scss">
.drawer-content {
  height: 100%;
}

.place-select {
  /* background: $primary; */
}

.drawer-content {
  height: 100%;
}

.list-toolbar {
  padding: 16px 20px 20px;
}
</style>
