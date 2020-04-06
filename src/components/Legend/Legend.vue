<template>
  <v-list dense>
    <v-list-item v-for="(item, i) in legendItems" :key="i" class="">
      <SymbolComponent class="mr-2" :paint="item.icon"></SymbolComponent>
      <v-list-item-content>
        <v-list-item-title v-text="capitalize(item.text)" class=""></v-list-item-title>
      </v-list-item-content>
      <v-switch
        class="ml-2 mt-0"
        v-model="activeTypes"
        :value="item.text"
        inset
        dense
        hide-details
        color="primary"
      ></v-switch>
    </v-list-item>
  </v-list>
</template>

<script lang="ts" src="./Legend.ts"></script>

<style lang="scss" scoped>
.legend-card {
  overflow-y: auto;
  background: rgba(0, 0, 0, 0.75) !important;
}

// .legend-items {
//   overflow-y: auto;
// }
</style>
