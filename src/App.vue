<template>
  <v-app>
    <v-navigation-drawer
      v-model="drawer"
      stateless
      fixed
      app
    >

    <drawer-container>
      <div slot="header">Устная память Москвы</div>
      <div v-if="items && items.length">
        <div>
          <v-expansion-panel
            expand
          >
            <v-expansion-panel-content>
              <div slot="header">Фильтр</div>
              <items-filter></items-filter>
            </v-expansion-panel-content>
          </v-expansion-panel>

          <v-divider></v-divider>
        </div>

        <div>
          <list></list>
        </div>
      </div>
      <div v-else>
        <div class="text-xs-center">
          <v-progress-circular
            indeterminate
            color="primary"
          ></v-progress-circular>
        </div>
      </div>

    </drawer-container>

    </v-navigation-drawer>


    <v-navigation-drawer
      :value="!!detail"
      stateless
      width="400"
      app
      right
    >
      <drawer-container v-if="detail">
        <div slot="header">
          <v-btn @click="detail = false" flat icon class="pa-0 ma-0">
            <v-icon>close</v-icon>
          </v-btn>
          {{detail.name}}
        </div>
        <detail></detail>
      </drawer-container>

    </v-navigation-drawer>

    <v-content>
      <ngw-map :center="[55.75, 37.63]" :zoom="10">
        <map-control position="topleft">
          <v-btn @click="drawer = !drawer" fab small>
            <v-icon large class="drawe-icon" :class="{ active: drawer }">chevron_right</v-icon>
          </v-btn>
        </map-control>
      </ngw-map>
    </v-content>
    <router-view></router-view>
  </v-app>
</template>

<script lang="ts">

export { App as default } from './App';

</script>


<style lang="scss">

* {
  padding: 0;
  margin: 0;
}

html, body {
  width: 100%;
  height: 100%;
  overflow: hidden !important;
}

.drawe-icon {
  &.active {
    -webkit-transform: rotate(-180deg);
    transform: rotate(-180deg);
  }
}

</style>
