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
      <div class="drawer-content d-flex flex-column">
        <div class="drawer-header-content">
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
        <div class="flex-grow-1 drawer-body-content">
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
        </div>
        <!-- <div class="drawer-footer-content">
          <v-item-group class="bottom-button">
            <v-btn text color="grey">
              <v-icon>save_alt</v-icon>
            </v-btn>
            <v-btn text @click="page = 'table'" color="grey">
              <v-icon @click="page = 'table'">table_chart</v-icon>
            </v-btn>
          </v-item-group>
        </div>-->
      </div>
    </v-navigation-drawer>

    <v-navigation-drawer :value="!!detail" stateless width="360" absolute app right>
      <div v-if="detail" class="drawer-content d-flex flex-column pt-3 pb-0 pa-5">
        <div class="drawer-header-content pb-5">
          <div class="pb-3 d-flex justify-space-between">
            <v-btn @click="detail = false" text icon>
              <v-icon>close</v-icon>
            </v-btn>
            <v-chip class="ma-2" color="#7bd235" dark small label>{{detail.properties.status}}</v-chip>
          </div>
          <div>{{detail.properties.name}}</div>
          <div class="subtitle subtitle-2">{{detail.properties.type}}</div>
        </div>
        <div class="flex-grow-1 drawer-body-content">
          <detail></detail>
        </div>
        <div class="drawer-footer-content">
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
        </div>
      </div>
    </v-navigation-drawer>
  </v-app>
</template>

<script lang="ts">
export { Main as default } from "./Main";
</script>


<style lang="scss">
// @import "./style/variables.scss";

.drawer-content {
  height: 100%;
}

.subtitle {
  color: #a0a8ab;
}

.drawer-body-content {
  overflow: auto;
}

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
