<template>
  <v-app>
    <v-layout align-center justify-center column fill-height>
      <v-data-table
        :headers="headers"
        :items="items"
        hide-actions
      >
        <template slot="headerCell" slot-scope="props">
          <v-tooltip bottom>
            <span slot="activator">
              {{ props.header.text }}
            </span>
            <span>
              {{ props.header.text }}
            </span>
          </v-tooltip>
        </template>
        <template slot="items" slot-scope="props">
          <td v-for="h in headers" :key="h.value">{{ props.item[h.value] }}</td>
        </template>
      </v-data-table>
    </v-layout>
  </v-app>
</template>

<script lang="ts">
export { Table as default } from './Table';
</script>

<style lang="scss">

html, body {
  width: 100%;
  height: 100%;
  overflow: auto !important;
}
</style>
