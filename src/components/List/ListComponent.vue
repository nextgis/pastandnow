<template>
  <div>
    <v-list class="items-list" dense>
      <v-list-item-group v-model="active">
        <v-list-item
          v-for="(item, i) in portion"
          :key="i"
          class="align-start"
          @click="setDetail(Number(item.id1))"
        >
          <SymbolComponent
            :paint="getItemPaint(item)"
            :geo="item.geo || 'point'"
            class="mr-2 mt-2 list-item-icon"
          />
          <v-list-item-content>
            <div>{{ item.name }}</div>
            <v-list-item-subtitle>{{ item.type }}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list-item-group>
    </v-list>
    <div v-if="displayItems.length > portion.length" class="text-center">
      <v-btn text color="primary" @click="addPortion">Показать ещё</v-btn>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';

import { useAppStore } from '../../store/modules/app';
import { useOralStore } from '../../store/modules/oral';
import { getHistoryPaint } from '../../utils/getHistoryPaint';
import SymbolComponent from '../SymbolComponent.vue';

import type { OralFeature, OralProperties } from '../../interfaces';
import type { PathPaint } from '@nextgis/paint';

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
</style>
