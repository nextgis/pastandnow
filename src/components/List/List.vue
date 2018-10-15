<template>
    <v-list dense>
      <v-list-tile v-for="item in items" :key="item.id">
        <v-list-tile-content>
          <v-list-tile-title>{{ item.name }}</v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
    </v-list>
</template>

<script lang="ts">
export { List as default } from './List';
</script>

<style lang="scss">

</style>
