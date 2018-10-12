<template>
  <v-app id="inspire">
    <v-navigation-drawer
      v-model="drawer"
      fixed
      app
    >
      <v-toolbar flat class="transparent">
        <v-list class="pa-0">
          <v-list-tile avatar>

            <v-list-tile-content>
              <v-list-tile-title>Устная история Москвы</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-toolbar>

      <v-divider></v-divider>

      <v-list dense>
        <v-list-tile v-for="item in items" :key="item.id">
          <v-list-tile-content>
            <v-list-tile-title>{{ item.name }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-content>
        <div id="map"></div>
    </v-content>
  </v-app>
</template>

<script lang="ts">

export { App as default } from './App';

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

* {
  padding: 0;
  margin: 0;
}

html, body {
  width: 100%;
  height: 100%;
  overflow: hidden !important;
}
</style>
