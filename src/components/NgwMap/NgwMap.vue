<template>
  <div id="map"></div>
</template>

<script lang="ts">
export { NgwMap as default } from './NgwMap';
</script>

<style lang="scss">
  #map {
    position: relative;
    top: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    z-index: 10;
  }
</style>
