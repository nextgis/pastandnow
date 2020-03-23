<template>
  <div v-if="detail && meta">
    <v-list dense>
      <v-list-item
        v-for="item in noHideMeta"
        :key="item.value"
        class="detail-prop-list pl-0 pb-0"
        style
      >
        <v-list-item-content>
          <v-list-item-subtitle>{{ item.text }}</v-list-item-subtitle>
          <span v-if="item.type === 'Story'">
            <component v-bind:is="components[item.type]" :text="getText(item)"></component>
          </span>
          <v-list-item-title v-else v-html="getText(item)"></v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-list-item class="detail-prop-list pl-0 pb-2">
        <v-list-item-content v-if="photos && photos.length">
          <v-list-item-subtitle>Фото</v-list-item-subtitle>
          <div class="photo-containerr">
            <a
              v-for="photo in photos"
              :key="photo.id"
              @click="dialog = true; bigImgSrc = photo.link_big"
            >
              <v-img :src="photo.link_small" class="grey lighten-2"></v-img>
            </a>

            <v-dialog v-model="dialog" scrollable content-class="photo-dialog">
              <v-btn class="close-img-dialog-btn" color="info" @click="dialog = false">Закрыть</v-btn>
              <v-img :src="bigImgSrc" contain></v-img>
            </v-dialog>
          </div>
        </v-list-item-content>
      </v-list-item>
    </v-list>
    <!-- <div class="text-center">
      <v-btn color="info" small v-if="needMore" @click="more = !more">
        <span v-if="!more">Подробнее</span>
        <span v-else>Свернуть</span>
      </v-btn>
    </div>-->
  </div>
</template>

<script lang="ts">
export { Detail as default } from "./Detail";
</script>

<style lang="scss" scoped>
.detail-prop-list .v-list__tile {
  height: auto !important;
}

.photo-containerr {
  width: 100%;
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
