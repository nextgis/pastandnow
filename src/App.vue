<template>
  <div id="container">
    <div id="left">
      <ul>
        <li
          v-for="item in items"
          :key="item.id">
          {{ item.name }}
        </li>
      </ul>
    </div>
    <div id="center">
      <div id="map"></div>
    </div>
    <router-view class="view"></router-view>
  </div>
</template>

<script lang="ts">
export { App as default } from './App';
</script>


<style lang="scss">

#container {
  display: flex;
  height: 100%;
}

#left {
  flex: 0 1 300px; /* Positive flex-shrink */
  overflow: auto;
}
#center {
  flex: 1 1 auto; /* Positive flex-shrink */
}

#map {
  position: relative;
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

html, body {
  width: 100%;
  height: 100%;
}
</style>
