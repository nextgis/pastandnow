<template>
  <div v-if="detail && meta">
<!-- араж использовался как автобусный парк [1960-е, ГИГ] -->
    <div v-if="photos && photos.length">

      <a v-for="photo in photos" :key="photo.id" @click="dialog = true; bigImgSrc = photo.link_big">
        <v-img
          :src="photo.link_small"
          class="grey lighten-2"
        >
        </v-img>
      </a>

      <v-dialog v-model="dialog" scrollable content-class="photo-dialog">
        <v-btn class="close-img-dialog-btn" color="info" @click="dialog = false">
          Закрыть
        </v-btn>
        <v-img
          :src="bigImgSrc"
          contain
        >
        </v-img>

      </v-dialog>
    </div>

    <v-list dense>
      <v-list-tile
        v-for="item in meta"
        :key="item.value"
        v-if="detail[item.value] && (!item.noHide ? more : true)"
        class="detail-prop-list pb-3"
        style=""
      >
        <v-list-tile-content>
          <v-list-tile-sub-title>{{ item.text }}</v-list-tile-sub-title>

          <span v-if="item.type === 'Story'">
            <component v-bind:is="components[item.type]" :text="getText(item)"></component>
          </span>
          <v-list-tile-title v-else v-html="getText(item)"></v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
    </v-list>
    <div class="text-xs-center">
      <v-btn color="info" small v-if="needMore" @click="more = !more">
        <span v-if="!more">Подробнее</span>
        <span v-else>Свернуть</span>
      </v-btn>
    </div>
  </div>
</template>

<script lang="ts">
export { Detail as default } from './Detail';
</script>

<style lang="scss">

.detail-prop-list .v-list__tile {
  height: auto!important;
}

.show-photo-card .v-card__text {
  padding: 0;
}

.photo-dialog {
  box-shadow: none;
  max-height: 100% !important;
  margin: 0 !important;
}

.close-img-dialog-btn {
  position: absolute !important;
  right: 0;
  z-index: 500;
  overflow: visible;
}

</style>
