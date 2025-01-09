<template>
  <div>
    <VList class="items-list" density="compact">
      <VListItem
        v-for="(item, i) in portion"
        :key="i"
        :active="isItemActive(item)"
        class="items-list-item align-start"
        @click="setDetail(Number(item.id1))"
      >
        <template #prepend>
          <SymbolComponent
            :paint="getItemPaint(item)"
            :geo="item.geo || 'point'"
            class="mr-2 mt-1 list-item-icon"
          />
        </template>
        <VListItemTitle class="items-list-item__title">{{
          item.name
        }}</VListItemTitle>
        <VListItemSubtitle>{{ item.type }}</VListItemSubtitle>
      </VListItem>
    </VList>
    <div v-if="displayItems.length > portion.length" class="text-center">
      <VBtn variant="text" color="primary" @click="addPortion">
        Показать ещё
      </VBtn>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import {
  VBtn,
  VList,
  VListItem,
  VListItemSubtitle,
  VListItemTitle,
} from 'vuetify/components';

import { useAppStore } from '../../store/modules/app';
import { useOralStore } from '../../store/modules/oral';
import { getHistoryPaint } from '../../utils/getHistoryPaint';
import SymbolComponent from '../SymbolComponent.vue';

import type { PathPaint } from '@nextgis/paint';

import type { OralFeature, OralProperties } from '../../interfaces';

const portionCount = 30;
const portion = ref<OralProperties[]>([]);
const active = ref<number | null>(null);

const oralStore = useOralStore();
const appStore = useAppStore();

const listSearchText = computed(() => oralStore.listSearchText);
const items = computed(() => oralStore.sortedFeatures.map((x) => x.properties));
const filtered = computed<OralFeature[]>(() => oralStore.filtered);
const detail = computed<OralFeature | null>(() => oralStore.detailItem);
const displayItems = computed(() => getDisplayItems());

const addPortion = () => {
  const itemsList = displayItems.value;
  const portionsLength = portion.value.length;
  const itemsLength = itemsList.length;
  if (portionsLength < itemsLength) {
    const newPortions = [...portion.value];
    const addLength = portionsLength + portionCount;
    const len = addLength > itemsLength ? itemsLength : addLength;
    for (let i = portionsLength; i < len; i++) {
      newPortions.push(itemsList[i]);
    }
    portion.value = newPortions;
  }
};

const getDisplayItems = (): OralProperties[] => items.value;

const getItemPaint = (item: OralProperties) =>
  getHistoryPaint(item) as PathPaint;

const setDetail = (id: number) => {
  oralStore.setDetail(id);
  appStore.zoomTo(id);
};

const isItemActive = (item: OralProperties) => {
  return detail.value?.properties.id1 === item.id1;
};

watch([detail, items, filtered], () => {
  const detailItem = detail.value;
  const index = detailItem
    ? portion.value.findIndex((x) => x.id1 === detailItem.properties.id1)
    : null;
  active.value = index;
});

watch([listSearchText, filtered], () => {
  portion.value = [];
  addPortion();
});

onMounted(() => {
  if (detail.value) {
    const index = detail.value
      ? portion.value.findIndex((x) => x.id1 === detail.value?.properties.id1)
      : null;
    active.value = index;
  }
  addPortion();
});
</script>

<style lang="scss" scoped>
.items-list {
  font-size: 14px;
}

.items-list-item__title {
  white-space: normal;
}
</style>
