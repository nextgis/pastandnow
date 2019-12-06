<template>
  <v-card
    class="mx-auto legend-card"
    max-width="300"
    max-height="500"
    tile
    v-if="legendItems.length"
  >
    <v-list disabled flat dense>
      <!-- <v-subheader>Легенда</v-subheader> -->
      <v-list-item-group color="primary" class="legend-items">
        <v-list-item v-for="(item, i) in legendItems" :key="i">
          <v-list-item-icon>
            <span v-html="item.icon.outerHTML"></span>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title v-text="item.text"></v-list-item-title>
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
}

// .legend-items {
//   overflow-y: auto;
// }
</style>
