<template>
  <v-app>
    <v-content>
      <oral-map :mapOptions="mapOptions" :fullFilling="true">
        <vue-ngw-control position="top-left" :margin="true">
          <div v-if="!drawer">
            <v-layout align-center justify-start row fill-height class="ma-1">
              <v-btn @click="drawer = !drawer" fab small>
                <v-icon large class="drawe-icon" :class="{ active: drawer }">chevron_right</v-icon>
              </v-btn>
              <span class="title ml-1">Устная память</span>
            </v-layout>
          </div>
        </vue-ngw-control>
        <vue-ngw-control position="bottom-left" :margin="true">
          <Legend></Legend>
        </vue-ngw-control>
      </oral-map>
    </v-content>

    <v-navigation-drawer v-model="drawer" stateless fixed app width="360">
      <drawer-container>
        <div class="filter-block">
          <items-filter></items-filter>

          <div>
            <v-text-field
              class="mx-4 pt-2 pb-2"
              v-model="listSearchText"
              hide-details
              solo
              clearable
              label="Поиск"
              prepend-inner-icon="search"
            ></v-text-field>
          </div>
        </div>
        <div v-if="items && items.length">
          <div>
            <list></list>
          </div>
        </div>
        <div v-else>
          <div class="pa-3 text-center">
            <v-progress-circular indeterminate color="primary"></v-progress-circular>
          </div>
        </div>
        <template slot="footer">
          <v-item-group class="bottom-button">
            <v-btn text color="grey">
              <v-icon>save_alt</v-icon>
            </v-btn>
            <v-btn text @click="page = 'table'" color="grey">
              <v-icon @click="page = 'table'">table_chart</v-icon>
            </v-btn>
          </v-item-group>
        </template>
      </drawer-container>
    </v-navigation-drawer>

    <v-navigation-drawer :value="!!detail" stateless width="400" absolute app right>
      <drawer-container v-if="detail">
        <template slot="header">
          <v-btn @click="detail = false" text icon class="pa-0 ma-0">
            <v-icon>close</v-icon>
          </v-btn>
          {{detail.properties.name}}
        </template>
        <detail></detail>
        <template slot="footer">
          <v-item-group class="bottom-button">
            <v-tooltip top>
              <template v-slot:activator="{ on }">
                <v-btn text color="grey" @click="openFeedbackPage" v-on="on">
                  <v-icon>feedback</v-icon>
                </v-btn>
              </template>
              <span>Обратная связь</span>
            </v-tooltip>

            <!-- <v-btn text color="grey">
              <v-icon>save_alt</v-icon>
            </v-btn>-->
            <v-tooltip top>
              <template v-slot:activator="{ on }">
                <v-btn text @click="zoomTo = detail.id" color="grey" v-on="on">
                  <v-icon>place</v-icon>
                </v-btn>
              </template>
              <span>Показать на карте</span>
            </v-tooltip>
          </v-item-group>
        </template>
      </drawer-container>
    </v-navigation-drawer>
  </v-app>
</template>

<script lang="ts">
export { Main as default } from "./Main";
</script>


<style lang="scss">
// @import "./style/variables.scss";

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
