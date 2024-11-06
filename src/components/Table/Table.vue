<template>
  <v-app>
    <v-data-table
      :headers="headers"
      :items="items"
      :search="search"
      :items-per-page="itemsPerPage"
      hide-default-footer
    >
      <template #headerCell="{ header }">
        <v-tooltip bottom>
          <span slot="activator">{{ header.text }}</span>
        </v-tooltip>
      </template>
      <template #item="{ item }">
        <td v-for="h in headers" :key="h.value">
          <span v-if="item[h.value] && item[h.value].length < 40">{{
            item[h.value]
          }}</span>
          <span v-else>
            <show-more-field
              :text="item[h.value]"
              :char-count="40"
            ></show-more-field>
          </span>
        </td>
      </template>
    </v-data-table>
  </v-app>
</template>

<script lang="ts">
import { computed, defineComponent, watch } from 'vue';

import { useOralStore } from '../../store/modules/oral';

import ShowMoreField from './ShowMoreField.vue';

import type { OralProperties } from '../../interfaces';
import type { PropType } from 'vue';

export default defineComponent({
  name: 'TableComponent',
  components: { ShowMoreField },
  props: {
    search: {
      type: String,
      required: true,
    },
    paginationSync: {
      type: Function as PropType<(value: unknown) => void>,
      required: true,
    },
  },
  setup(props) {
    const oralStore = useOralStore();
    const itemsPerPage = 20;

    const headers = [
      { text: 'Адрес', value: 'addr' },
      { text: 'долгота', value: 'lat' },
      { text: 'широта', value: 'lon' },
      { text: 'Название объекта', value: 'name' },
      { text: 'Тип объекта', value: 'type' },
      { text: 'Статус объекта', value: 'status' },
      { text: 'Район', value: 'rayon' },
      { text: 'Неофициальное название', value: 'unoff' },
      { text: 'ОПИСАНИЕ', value: 'description' },
      { text: 'Локальный нарратив', value: 'narrativ_l' },
      { text: 'Биографический нарратив', value: 'narrativ_b' },
      { text: 'Нарратив о практиках', value: 'narrativ_p' },
      { text: 'Описание места', value: 'descript2' },
      { text: 'Рассказчик', value: 'narrator' },
      { text: 'Визуальные материалы', value: 'visual' },
      { text: 'Москва дворовая', value: 'mos1' },
      { text: 'Москва церковная', value: 'mos2' },
      { text: 'Москва бездомная', value: 'mos3' },
      { text: 'Москва подземная', value: 'mos4' },
      { text: 'Москва субкультурная', value: 'mos5' },
      { text: 'Москва легендарная', value: 'mos6' },
    ];

    const items = computed<OralProperties[]>(() =>
      oralStore.sortFeatures.map((x) => x.properties),
    );

    watch(
      () => props.paginationSync,
      (value) => {
        props.paginationSync(value);
      },
    );

    return {
      headers,
      items,
      itemsPerPage,
    };
  },
});
</script>

<style lang="scss">
.v-table__overflow {
  overflow-x: inherit;
  overflow-y: inherit;
}
</style>
