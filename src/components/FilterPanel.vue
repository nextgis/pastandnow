<template>
  <div class="filter-panel">
    <h5 class="text-grey mb-2">СПЕЦИАЛЬНЫЕ ФИЛЬТРЫ</h5>

    <VCheckbox
      :key="'allSpecialFilters'"
      v-model="allSpecialFilters"
      class="filter-panel__checkbox mt-0"
      density="compact"
      color="primary"
      hide-details
      label="Все"
      :indeterminate="
        !!specialFilters.length &&
        specialFilters.length < specialFilterItems.length
      "
      @update:model-value="toggleAllSpecialFilters"
    />
    <VDivider class="my-1" />
    <VCheckbox
      v-for="v in specialFilterItems"
      :key="v.value"
      :model-value="specialFilters.includes(v.value)"
      class="filter-panel__checkbox mt-0"
      density="compact"
      color="primary"
      hide-details
      :label="v.text"
      @update:model-value="toggleSpecialFilter(v.value)"
    />
    <h5 class="text-grey mt-5 mb-1">ТИПЫ СЮЖЕТОВ</h5>
    <VAutocomplete
      v-model="narrativeTypesSelected"
      :items="narrativeTypeItems"
      density="compact"
      variant="outlined"
      color="primary"
      chips
      item-title="name"
      item-value="name"
      multiple
    >
      <template #chip="{ props, item }">
        <VChip
          class="filter-panel__chip text-primary my-1 mx-0"
          density="compact"
          label
          size="small"
          v-bind="props"
          closable
          @click:close="removeNarrativeType(item.raw)"
        >
          <span class="text-truncate">{{ item.raw.name }}</span>
        </VChip>
      </template>
      <template #item="{ props }">
        <VListItem v-bind="props"></VListItem>
      </template>
    </VAutocomplete>
  </div>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue';
import {
  VAutocomplete,
  VCheckbox,
  VChip,
  VDivider,
  VListItem,
} from 'vuetify/components';

import { useOralStore } from '../store/modules/oral';

import type { LayerMetaItem, NarrativeTypeItem } from '../interfaces';

const oralStore = useOralStore();

const meta = computed<LayerMetaItem[]>(() => oralStore.meta);

const specialFilters = computed({
  get: () => oralStore.specialFilterSelected,
  set: (val) => oralStore.setSpecialFilterSelected(val),
});

const narrativeTypesSelected = computed({
  get: () => oralStore.narrativeTypeSelected,
  set: (val) => oralStore.setNarrativeTypeSelected(val),
});

const allSpecialFilters = computed({
  get: () => specialFilters.value.length === specialFilterItems.value.length,
  set: (val) => {
    if (val) {
      oralStore.resetSpecialFilter();
    } else {
      oralStore.setSpecialFilterSelected([]);
    }
  },
});

const specialFilterItems = computed<LayerMetaItem[]>(() =>
  meta.value
    .filter((x) => x.type === 'Special')
    .sort((a, b) => (a.text > b.text ? 1 : -1)),
);

const narrativeTypeItems = computed(() => {
  const city = oralStore.activePlace.city;
  const types = city ? oralStore.filterData.narrativeTypeItems[city] : [];
  return (types || []).map((name) => ({ name }));
});

watch(specialFilters, (val) => {
  oralStore.setSpecialFilter(val.length ? val : undefined);
});

watch(narrativeTypesSelected, (val) => {
  oralStore.setNarrativeType(val.length ? val : undefined);
});

const toggleAllSpecialFilters = () => {
  if (allSpecialFilters.value) {
    oralStore.resetSpecialFilter();
  } else {
    const allFilters = specialFilterItems.value.map((item) => item.value);
    oralStore.setSpecialFilterSelected(allFilters);
  }
};

const toggleSpecialFilter = (filter: string) => {
  const filters = [...specialFilters.value];
  const index = filters.indexOf(filter);
  if (index > -1) {
    filters.splice(index, 1);
  } else {
    filters.push(filter);
  }
  specialFilters.value = filters;
};

const removeNarrativeType = (item: NarrativeTypeItem) => {
  const narrativeTypesSelectedCopy = [...narrativeTypesSelected.value];
  const index = narrativeTypesSelectedCopy.indexOf(item.name);
  if (index >= 0) {
    narrativeTypesSelectedCopy.splice(index, 1);
    narrativeTypesSelected.value = narrativeTypesSelectedCopy;
  }
};
</script>

<style lang="scss" scoped>
.filter-panel {
  padding: 0 20px 20px;

  &__checkbox {
    :deep(.v-selection-control__input) {
      margin-left: -5px;
      margin-right: 5px;
    }
  }

  &__chip {
    :deep(.v-icon) {
      color: inherit;
    }
  }
}
</style>
