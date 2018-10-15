<template>
  <v-app>
    <v-navigation-drawer
      v-model="drawer"
      fixed
      app
    >

    <drawer-container header="Устная память Москвы">
      <div>
        <items-filter></items-filter>
        <v-divider></v-divider>
      </div>

      <div>
        <list></list>
      </div>
    </drawer-container>

    </v-navigation-drawer>


    <v-navigation-drawer
      :value="!!detail"
      width="400"
      app
      right
    >

      <drawer-container v-if="detail" :header="detail.name">
        <detail></detail>
      </drawer-container>

    </v-navigation-drawer>

    <v-content>
      <ngw-map :center="[55.75, 37.63]" :zoom="10"></ngw-map>
    </v-content>
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

</style>
