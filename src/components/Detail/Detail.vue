<template>
  <div v-if="detail">
    <v-list dense>
      <v-list-tile v-for="(value, key) in detail" :key="key">
        <v-list-tile-content>
          <v-list-tile-title>{{key}} - {{ value }}</v-list-tile-title>
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
