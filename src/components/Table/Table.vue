<template>
  <v-app>

    <v-data-table
      :headers="headers"
      :items="items"
      :search="search"
      :pagination.sync="pagination"
      hide-actions
    >
      <template slot="headerCell" slot-scope="props">
        <v-tooltip bottom>
          <span slot="activator">
            {{ props.header.text }}
          </span>
        </v-tooltip>
      </template>
      <template slot="items" slot-scope="props">
        <td v-for="h in headers" :key="h.value">
          <span v-if="props.item[h.value] && props.item[h.value].length < 40">{{ props.item[h.value] }}</span>
          <span v-else><show-more-field :text="props.item[h.value]" :charCount="40"></show-more-field></span>
        </td>
      </template>
    </v-data-table>

  </v-app>
</template>

<script lang="ts">
export { Table as default } from './Table';
</script>

<style lang="scss">

.v-table__overflow {
  overflow-x: inherit;
  overflow-y: inherit;
}
</style>
