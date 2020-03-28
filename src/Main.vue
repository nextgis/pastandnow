<template>
  <v-app>
    <v-content>
      <oral-map :mapOptions="mapOptions" :fullFilling="true">
        <vue-ngw-control position="top-left" :margin="true">
          <v-btn @click="drawer = !drawer" fab small class="rectangle-fab">
            <v-icon large class="drawe-icon" :class="{ active: drawer }">chevron_right</v-icon>
          </v-btn>
        </vue-ngw-control>
        <vue-ngw-control position="bottom-left" :margin="true">
          <v-card
            class="mx-auto legend-card"
            max-width="300"
            max-height="500"
            dark
            tile
            v-if="module.legendItems.length"
          >
            <div v-if="legendOpen" class="d-flex flex-column">
              <div class="flex-header-content">
                <div class="d-flex justify-space-between">
                  <span class="pl-2 title font-weight-light">Легенда</span>
                  <v-btn @click="legendOpen = false" text icon>
                    <v-icon>close</v-icon>
                  </v-btn>
                </div>
              </div>
              <div class="flex-grow-1 flex-body-content legend-body">
                <Legend></Legend>
              </div>
            </div>
            <div v-else>
              <v-btn @click="legendOpen = !legendOpen" fab small class="rectangle-fab">
                <v-icon class :class="{ active: drawer }">format_list_bulleted</v-icon>
              </v-btn>
            </div>
          </v-card>
        </vue-ngw-control>
      </oral-map>
    </v-content>

    <v-navigation-drawer v-model="drawer" stateless fixed app width="360">
      <div class="drawer-content d-flex flex-column">
        <div class="flex-header-content">
          <items-filter></items-filter>
          <v-list v-if="filterPanelOpen">
            <v-list-item @click="filterPanelOpen = false">
              <v-list-item-icon>
                <v-icon>arrow_back</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>Вернуться к списку объектов</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
          <div v-else>
            <div class="pt-2 mx-4 d-flex justify-space-between">
              <span class="subtitle-1 font-weight-bold">
                Объекты
                <v-chip class="font-weight-light" small>
                  <span v-if="isFilterSet">
                    <span class="font-weight-bold">{{filtered.length}}</span> из&nbsp;
                  </span>
                  {{items.length}}
                </v-chip>
              </span>
              <span class="subtitle-1 caption" color="primary">
                <v-btn v-if="isFilterSet" text small @click="resetFilter">Сбросить</v-btn>
                <v-btn text icon @click="filterPanelOpen = true">
                  <v-icon>filter_list</v-icon>
                </v-btn>
              </span>
            </div>
            <v-text-field
              class="mx-4 pt-2 pb-2"
              v-model="listSearchText"
              cache-items
              flat
              solo
              dense
              outlined
              hide-no-data
              hide-details
              clearable
              label="Поиск"
              prepend-inner-icon="search"
            ></v-text-field>
          </div>
        </div>
        <div class="flex-grow-1 flex-body-content">
          <div v-if="items && items.length">
            <FilterPanel v-if="filterPanelOpen" @close="filterPanelOpen = false"></FilterPanel>
            <list v-else></list>
          </div>
          <div v-else>
            <div class="pa-3 text-center">
              <v-progress-circular indeterminate color="primary"></v-progress-circular>
            </div>
          </div>
        </div>
        <!-- <div class="flex-footer-content">
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
        <div class="flex-header-content pb-5">
          <div class="pb-3 d-flex justify-space-between">
            <v-btn @click="detail = false" text icon>
              <v-icon>close</v-icon>
            </v-btn>
            <v-chip
              class="ma-2"
              :color="detail.properties.status === 'существующий'? '#7bd235' : '#d2357b'"
              dark
              small
              label
            >{{detail.properties.status}}</v-chip>
          </div>
          <div>{{detail.properties.name}}</div>
          <div class="subtitle subtitle-2">{{detail.properties.type}}</div>
        </div>
        <div class="flex-grow-1 flex-body-content">
          <detail></detail>
        </div>
        <div class="flex-footer-content">
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

.rectangle-fab {
  border-radius: inherit;
}

.legend-body {
  overflow: auto;
  max-height: 400px;
}

.drawer-content {
  height: 100%;
}

.subtitle {
  color: #a0a8ab;
}

.flex-body-content {
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
