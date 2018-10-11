<template>
  <div>
    <div id="map"></div>
    <router-view class="view"></router-view>
  </div>
</template>

<script lang="ts">
export { App as default } from './App';
</script>


<style lang="scss">
#map {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  z-index: 10;
}

* {
  padding: 0;
  margin: 0;
}

body {
  line-height: 1.4em;
  color: #454545;
}
</style>
