<template>
  <div class="legend">
    <div v-for="(item, i) in legendItems" :key="i" class="legend__item">
      <div class="legend__item-label">
        <SymbolComponent class="mr-2" :paint="item.icon" :geo="item.geo" />
        <span class="" v-text="capitalize(item.text)" />
      </div>
      <VSwitch
        :model-value="activeTypes.includes(item.text)"
        class="legend__item-switcher ml-3 mt-0"
        density="compact"
        hide-details
        color="white"
        inset
        @update:modelValue="onSwitchChange(item.text, $event)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { capitalize } from '@nextgis/utils';
import { computed, onMounted } from 'vue';
import { VSwitch } from 'vuetify/components';

import { useOralStore } from '../store/modules/oral';

import SymbolComponent from './SymbolComponent.vue';

import type { LegendItem } from '../interfaces';

const oralStore = useOralStore();
const legendItems = computed(() => {
  const items = [...oralStore.legendItems].sort((a, b) =>
    a.name > b.name ? 1 : -1,
  ) as LegendItem[];

  return items.map((x) => {
    return {
      text: x.name,
      geo: x.geo,
      icon: x.item,
    };
  });
});

const activeTypes = computed({
  get: () => oralStore.activeTypes || [],
  set: (items: string[]) => {
    oralStore.setActiveTypes(items);
    items = [...items];
    const arrayCompare = [...legendItems.value]
      .map((x) => x.text)
      .sort()
      .every(function (value, index) {
        return value === items.sort()[index];
      });
    if (arrayCompare) {
      oralStore.setTypesFilter(undefined);
    } else {
      oralStore.setTypesFilter(items);
    }
  },
});

onMounted(() => {
  if (!oralStore.activeTypes) {
    oralStore.setActiveTypes(oralStore.legendItems.map((x) => x.name));
  }
});

const onSwitchChange = (itemName: string, status: boolean | null) => {
  const updatedActiveTypes = status
    ? [...activeTypes.value, itemName]
    : activeTypes.value.filter((item) => item !== itemName);
  activeTypes.value = updatedActiveTypes;
};
</script>

<style lang="scss" scoped>
.legend {
  width: 200px;
  padding: 16px;

  &__item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 4px;
  }

  &__item-label {
    display: flex;
    align-items: center;
  }
}
</style>
