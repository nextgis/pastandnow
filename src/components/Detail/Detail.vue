<template>
  <div v-if="detail && meta">
    <v-list dense>
      <v-list-tile
        v-for="item in meta"
        :key="item.value"
        v-if="detail[item.value] && (!item.noHide ? more : true)"
        class="pb-3"
      >
        <v-list-tile-content>
          <v-list-tile-sub-title>{{ item.text }}</v-list-tile-sub-title>
          <v-list-tile-title v-html="getText(item)"></v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
    </v-list>
    <div class="text-xs-center">
      <v-btn color="info" small v-if="needMore" @click="more = !more">
        <span v-if="!more">Подробнее</span>
        <span v-else>Свернуть</span>
      </v-btn>
    </div>
  </div>
</template>

<script lang="ts">
export { Detail as default } from './Detail';
</script>

<style lang="scss">
</style>
