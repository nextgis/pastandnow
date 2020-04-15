<template>
  <v-app>
    <v-content>
      <oral-map :mapOptions="mapOptions" :fullFilling="true">
        <vue-ngw-control position="top-left" :margin="true">
          <v-btn @click="drawer = !drawer" fab small class="rectangle-fab" color="#fff">
            <v-icon class="drawe-icon" :class="{ active: drawer }">{{svg.chevron_right}}</v-icon>
          </v-btn>
        </vue-ngw-control>
        <vue-ngw-control position="bottom-left" :margin="true">
          <div v-if="legendOpen" class="d-flex flex-column">
            <v-card
              class="mx-auto legend-card"
              max-width="300"
              max-height="500"
              dark
              v-if="module.legendItems.length"
            >
              <div class="legend-header flex-header-content">
                <div class="d-flex justify-space-between align-center">
                  <span class="legend-card__title">Легенда</span>
                  <v-btn class="legend__close" @click="legendOpen = false" icon small>
                    <v-icon>{{svg.close}}</v-icon>
                  </v-btn>
                </div>
              </div>
              <div class="flex-grow-1 flex-body-content legend-body">
                <Legend class="pt-0"></Legend>
              </div>
            </v-card>
            </div>
          <div v-else>
            <v-btn @click="legendOpen = !legendOpen" fab small class="rectangle-fab" color="#fff">
              <v-icon :class="{ active: drawer }">{{svg.list}}</v-icon>
            </v-btn>
          </div>
        </vue-ngw-control>
      </oral-map>
    </v-content>

    <v-navigation-drawer v-model="drawer" stateless fixed app width="360">
      <div class="drawer-content d-flex flex-column">
        <div class="flex-header-content">
          <items-filter></items-filter>
          <v-list v-if="filterPanelOpen">
            <v-list-item @click="filterPanelOpen = false">
              <v-icon class="light-text mr-2">{{svg.arrow_back}}</v-icon>
              <span class="light-text"> Вернуться к списку объектов </span>
            </v-list-item>
          </v-list>
          <div v-else class="list-toolbar" :class="{ 'shadowed' : listIsScrolled }">
            <div class="d-flex justify-space-between mb-4">
              <span class="subtitle-1 font-weight-medium">
                Объекты
                <v-chip class="list-toolbar__count font-weight-medium" small>
                  <template v-if="isFilterSet">
                    {{filtered.length}}&nbsp;<span class="light-text">из&nbsp;{{activeCityItems.length}}</span>
                  </template>
                  <template v-else>
                    {{activeCityItems.length}}
                  </template>
                </v-chip>
              </span>
              <span>
                <v-btn class="px-1" small text color="primary" v-if="isFilterSet" @click="resetFilter">Сбросить</v-btn>
                <v-btn text icon small @click="filterPanelOpen = true" class="filter-btn">
                  <v-icon class="filter-btn"
                    color="primary"
                    @click="filterPanelOpen = true">{{svg.filter}}</v-icon>
                </v-btn>
              </span>
            </div>
            <v-text-field
              v-model="listSearchText"
              cache-items
              flat
              solo
              dense
              outlined
              hide-no-data
              hide-details
              clearable
              placeholder="Поиск..."
              :prepend-inner-icon="svg.search"
            ></v-text-field>
          </div>
        </div>
        <div class="flex-grow-1 flex-body-content" id="panel-content">
          <div v-if="items && items.length" class="pb-3"
            v-scroll:#panel-content="onPanelScroll">
            <FilterPanel v-if="filterPanelOpen" @close="filterPanelOpen = false"></FilterPanel>
            <list v-else class="pt-0"></list>
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
              <v-icon>{{svg.close}}</v-icon>
            </v-btn>
            <v-chip
              class="ma-2"
              :color="detail.properties.status === 'существующий'? '#7bd235' : '#d2357b'"
              dark
              small
              label
            >{{detail.properties.status}}</v-chip>
          </div>
          <div class="font-weight-medium">{{detail.properties.name}}</div>
          <div class="caption text--secondary">{{detail.properties.type}}</div>
        </div>
        <div class="flex-grow-1 flex-body-content">
          <detail></detail>
        </div>
        <div class="flex-footer-content">
          <v-item-group class="bottom-button">
            <v-tooltip top>
              <template v-slot:activator="{ on }">
                <v-btn text color="grey" @click="openFeedbackPage" v-on="on">
                  <v-icon>{{svg.feedback}}</v-icon>
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
                  <v-icon>{{svg.place}}</v-icon>
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


<style>
.v-text-field.v-input--dense .v-input__prepend-inner .v-input__icon > .v-icon {
  margin-top: 0;
}
</style>

<style lang="scss" scoped>

.rectangle-fab {
  border-radius: $border-radius-root;
  box-shadow: 0 2px 4px rgba(0, 0, 0, .25);

  .v-btn__content .v-icon {
    color: $icon-color;
  }

  &:hover{
    .v-btn__content .v-icon {
      color: $icon-color-active;
    }
  }
}

.legend-body {
  overflow: auto;
  max-height: 50vh;
}

.legend__close{
  opacity: .5;
  margin-right: -8px;

  &:hover{
    opacity: 1;
  }
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

.legend-card{
  &.theme--dark{
    background-color: rgba(0,0,0,.75);
  }

  .legend-header{
    padding: 12px 16px 0;
  }

  &__title{
    font-size: 14px;
    font-weight: 600;
  }
}

.list-toolbar{
  padding: 16px 20px 20px;

  &.shadowed{
    box-shadow: 0 2px 8px rgba(0,0,0,.24);
  }
}
</style>
