<template>
  <v-app>
    <v-main>
      <oral-map :mapOptions="mapOptions" :fullFilling="true">
        <vue-ngw-control position="top-left" :margin="true">
          <v-btn v-if="!drawer" @click="drawer = !drawer" fab small class="rectangle-fab" color="#fff">
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
    </v-main>

    <v-navigation-drawer v-model="drawer" stateless fixed app width="360">
      <div class="drawer-content d-flex flex-column">
        <div class="flex-header-content">
          <v-btn class="detail-drawer__header-close" @click="drawer = false" text icon small dark>
            <v-icon>{{svg.close}}</v-icon>
          </v-btn>
          <div class="place-select">
            <items-filter></items-filter>
          </div>
          <v-list v-if="filterPanelOpen">
            <v-list-item @click="filterPanelOpen = false">
              <v-icon class="text--secondary mr-2">{{svg.arrow_back}}</v-icon>
              <span class="text--secondary"> Вернуться к списку объектов </span>
            </v-list-item>
          </v-list>
          <div v-else class="list-toolbar" :class="{ 'shadowed' : listIsScrolled }">
            <div class="d-flex justify-space-between align-center mb-4">
              <span class="subtitle-1 font-weight-medium">
                Объекты
                <v-chip class="list-toolbar__count font-weight-medium" small>
                  <template v-if="isFilterSet">
                    {{filtered.length}}&nbsp;<span class="text--secondary">из&nbsp;{{activeCityItems.length}}</span>
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
              :loading="!searchReady"
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

    <v-navigation-drawer class="detail-drawer" :value="!!detail" stateless width="360" absolute app right>
      <div v-if="detail" class="drawer-content d-flex flex-column">
        <div class="detail-drawer__header flex-header-content"
          :class="{'shadowed': detailIsScrolled }"
          v-scroll:#detail-content="onDetailScroll">
          <div class="pb-3 d-flex justify-space-between align-center">
            <v-btn class="detail-drawer__header-close" @click="detail = false" text icon small>
              <v-icon>{{svg.close}}</v-icon>
            </v-btn>
            <v-chip
              class="detail-drawer__header-chip text-uppercase font-weight-bold"
              :color="detail.properties.status === 'существующий'? '#7bd235' : '#d2357b'"
              dark
              small
              label
            >{{detail.properties.status}}</v-chip>
          </div>
          <div class="subtitle-1 font-weight-medium">{{detail.properties.name}}</div>
          <div class="caption text--secondary">{{detail.properties.type}}</div>
        </div>
        <div class="detail-drawer__content flex-grow-1 flex-body-content" id="detail-content">
          <detail></detail>
        </div>
        <div class="detail-drawer__footer flex-footer-content">
          <div class="bottom-buttons">
            <div class="bottom-buttons__item">
              <v-btn text color="primary" @click="openFeedbackPage">
                <v-icon left>{{svg.feedback}}</v-icon>
                Обратная связь
              </v-btn>
            </div>
            <v-divider
              class="mx-1 my-2"
              inset
              vertical
            ></v-divider>
            <div class="bottom-buttons__item">
              <v-btn text @click="zoomTo = detail.id" color="primary">
                <v-icon left>{{svg.target}}</v-icon>
                Показать на карте
              </v-btn>
            </div>
          </div>
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

.place-select {
  background: $primary;
}

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

.bottom-buttons {
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
}

.detail-drawer{
  &__header,
  &__content,
  &__footer{
    padding-left: 20px;
    padding-right: 20px;
  }

  &__header{
    padding-top: 16px;
    padding-bottom: 16px;
  }

  &__footer{
    background-color: #f1f4f5;
    padding-top: 4px;
    padding-bottom: 4px;
  }

  &__header-close{
    position: absolute;
    top: 15px;
    right: 16px;
  }

  &__header-chip{
    font-size: 10px;
  }
}

.shadowed{
  box-shadow: 0 2px 8px rgba(0,0,0,.24);
}
</style>
