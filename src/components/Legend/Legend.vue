<template>
  <v-card
    class="mx-auto legend-card"
    max-width="300"
    max-height="500"
    dark
    tile
    v-if="legendItems.length"
  >
    <v-list disabled flat dense>
      <!-- <v-subheader>Легенда</v-subheader> -->
      <v-list-item-group color="primary" class="legend-items">
        <v-list-item v-for="(item, i) in legendItems" :key="i">
          <SymbolComponent class="mr-2" :paint="item.icon"></SymbolComponent>
          <v-list-item-content>
            <v-list-item-title v-text="item.text" class="text-capitalize"></v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-item-group>
    </v-list>
  </v-card>
</template>

<script lang="ts" src="./Legend.ts"></script>

<style lang="scss" scoped>
.legend-card {
  overflow-y: auto;
  background: rgba(0,0,0,.75)!important;
}

// .legend-items {
//   overflow-y: auto;
// }
</style>
