<template>
  <div class="filter-panel">
    <h5 class="text--secondary mb-1">СПЕЦИАЛЬНЫЕ ФИЛЬТРЫ</h5>

    <v-checkbox
      key="allSpecialFilters"
      v-model="allSpecialFilters"
      class="filter-panel__checkbox mt-0"
      dense
      hide-details
      label="Все"
      :indeterminate="
        !!specialFilters.length &&
        specialFilters.length < specialFilterItems.length
      "
      @change="toggleAllSpecialFilters"
    ></v-checkbox>
    <v-divider></v-divider>
    <v-checkbox
      v-for="v in specialFilterItems"
      :key="v.value"
      :input-value="specialFilters.includes(v.value)"
      class="filter-panel__checkbox mt-0"
      dense
      hide-details
      :label="v.text"
      @change="toggleSpecialFilter(v.value)"
    ></v-checkbox>
    <h5 class="text--secondary mt-5 mb-1">ТИПЫ СЮЖЕТОВ</h5>
    <v-autocomplete
      v-model="narrativeTypesSelected"
      :items="narrativeTypeItems"
      dense
      outlined
      chips
      item-text="name"
      item-value="name"
      multiple
    >
      <template #selection="data">
        <v-chip
          class="filter-panel__chip primary--text my-1 mx-0"
          small
          label
          v-bind="data.attrs"
          :input-value="data.selected"
          close
          @click="data.select"
          @click:close="removeNarrativeType(data.item)"
        >
          <span class="text-truncate">{{ data.item.name }}</span>
        </v-chip>
      </template>
      <template #item="data">
        <v-list-item-content>
          {{ data.item.name }}
        </v-list-item-content>
      </template>
    </v-autocomplete>
  </div>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue';

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
    margin-left: -4px;
  }

  &__chip {
    &::v-deep .v-icon {
      color: inherit;
    }
  }
}
</style>
