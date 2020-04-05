<template>
  <div v-if="detail && meta">
    <v-list dense>
      <v-list-item
        v-for="item in properties"
        :key="item.value"
        class="detail-prop-list pl-0 pb-0"
        style
      >
        <v-list-item-content>
          <span class="caption text--secondary">{{ item.text }}</span>
          <span class="body-2" v-html="getText(item)"></span>
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
              <v-img :src="bigImgSrc"></v-img>
            </v-dialog>
          </div>
        </v-list-item-content>
      </v-list-item>
    </v-list>
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
  overflow: hidden;
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
