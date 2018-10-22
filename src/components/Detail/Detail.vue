<template>
  <div v-if="detail && meta">
    <v-list dense>
      <v-list-tile v-for="item in meta" :key="item.value">
        <v-list-tile-content>
          <v-list-tile-title>{{item.text}} - {{ detail[value] }}</v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
    </v-list>
  </div>
</template>

<script lang="ts">
export { Detail as default } from './Detail';
</script>

<style lang="scss">
</style>
