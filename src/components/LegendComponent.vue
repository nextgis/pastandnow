<template>
  <div class="legend" dense>
    <div v-for="(item, i) in legendItems" :key="i" class="legend__item">
      <div class="legend__item-label">
        <SymbolComponent
          class="mr-2"
          :paint="item.icon"
          :geo="item.geo"
        ></SymbolComponent>
        <span class="" v-text="capitalize(item.text)"></span>
      </div>
      <v-switch
        :input-value="activeTypes.includes(item.text)"
        class="legend__item-switcher ml-3 mt-0"
        inset
        dense
        hide-details
        color="primary"
        @change="onSwitchChange(item.text, $event)"
      ></v-switch>
    </div>
  </div>
</template>

<script lang="ts">
import { capitalize } from '@nextgis/utils';
import { computed, defineComponent, onMounted } from 'vue';

import { useOralStore } from '../store/modules/oral';

import SymbolComponent from './SymbolComponent.vue';

export default defineComponent({
  components: { SymbolComponent },
  setup() {
    const oralStore = useOralStore();
    const legendItems = computed(() =>
      [...oralStore.legendItems]
        .sort((a, b) => (a.name > b.name ? 1 : -1))
        .map((x) => {
          return {
            text: x.name,
            // geo: x.geo,
            icon: x.item,
          };
        }),
    );

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

    const capitalizeStr = (str: string): string => {
      return capitalize(str);
    };

    const onSwitchChange = (itemName: string, status: boolean) => {
      const updatedActiveTypes = status
        ? [...activeTypes.value, itemName]
        : activeTypes.value.filter((item) => item !== itemName);
      activeTypes.value = updatedActiveTypes;
    };

    return {
      legendItems,
      activeTypes,
      onSwitchChange,
      capitalize: capitalizeStr,
    };
  },
});
</script>

<style lang="scss" scoped>
.legend {
  width: 200px;
  padding: 16px;

  &__item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 8px;
  }

  &__item-label {
    display: flex;
    align-items: center;
  }
}
</style>
