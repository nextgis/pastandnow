<template>
  <v-app>

    <v-content>
      <ngw-map :center="[37.63, 55.75]" :zoom="10">
        <!-- <map-control position="topleft">
          <div v-if="!drawer">
          <v-btn @click="drawer = !drawer" fab small>
            <v-icon large class="drawe-icon" :class="{ active: drawer }">chevron_right</v-icon>
          </v-btn>
          <span class="title">Устная память Москвы</span>
          </div>
        </map-control> -->
      </ngw-map>
    </v-content>

    <v-navigation-drawer
      v-model="drawer"
      stateless
      fixed
      app
      width="350"
    >
      <drawer-container>
        <div slot="header">
          <v-layout justify-space-between>
            Устная память Москвы
            <v-btn @click="drawer = false" flat icon class="pa-0 ma-0">
              <v-icon>close</v-icon>
            </v-btn>
          </v-layout>
        </div>
        <div v-if="items && items.length">
          <div>
            <!-- <v-expansion-panel
              expand
            >
              <v-expansion-panel-content>
                <div slot="header">Фильтр</div>

              </v-expansion-panel-content>
            </v-expansion-panel> -->
            <items-filter></items-filter>

            <div class="pl-3 pr-3">
              <v-text-field
                class="pa-0"
                v-model="listSearchText"
                hide-details
                solo
                clearable
                label="Поиск"
                prepend-inner-icon="search"
              ></v-text-field>
            </div>
            <!-- <v-divider></v-divider> -->
          </div>

          <div>
            <list></list>
          </div>
        </div>
        <div v-else>
          <div class="pa-3 text-xs-center">
            <v-progress-circular
              indeterminate
              color="primary"
            ></v-progress-circular>
          </div>
        </div>
        <template slot="footer">
          <v-item-group class='bottom-button'>
            <v-btn flat color="grey">
              <v-icon>save_alt</v-icon>
            </v-btn>
            <v-btn flat @click="page = 'table'" color="grey">
              <v-icon @click="page = 'table'">table_chart</v-icon>
            </v-btn>
          </v-item-group>
        </template>

      </drawer-container>
    </v-navigation-drawer>

    <v-navigation-drawer
      :value="!!detail"
      stateless
      width="400"
      absolute
      app
      right
    >
      <drawer-container v-if="detail">
        <template slot="header">
          <v-btn @click="detail = false" flat icon class="pa-0 ma-0">
            <v-icon>close</v-icon>
          </v-btn>
          {{detail.properties.name}}
        </template>
        <detail></detail>
        <template slot="footer">
          <v-item-group class='bottom-button'>
            <v-btn flat  color="grey">
              <v-icon>feedback</v-icon>
            </v-btn>
            <v-btn flat  color="grey">
              <v-icon>save_alt</v-icon>
            </v-btn>
            <v-btn flat @click="zoomTo = detail.id" color="grey">
              <v-icon>place</v-icon>
            </v-btn>
          </v-item-group>
        </template>

      </drawer-container>
    </v-navigation-drawer>


  </v-app>
</template>

<script lang="ts">
export { Main as default } from './Main';
</script>


<style lang="scss">
.drawe-icon {
  &.active {
    -webkit-transform: rotate(-180deg);
    transform: rotate(-180deg);
  }
}

.bottom-button {
  width: 100%;
  display: flex;
  justify-content: space-around;
  .v-btn {
    flex-grow: 1;
    margin: 0;
  }
}
</style>
