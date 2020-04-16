<template>
  <div class="detail" v-if="detail && meta">
    <v-list dense class="pt-0">
      <v-list-item
        v-for="item in properties"
        :key="item.value"
        class="detail-prop-list px-0 pb-0"
        style
      >
        <v-list-item-content>
          <span class="caption text--secondary">{{ item.text }}</span>
          <span class="body-2" v-html="getText(item)"></span>
        </v-list-item-content>
      </v-list-item>
      <v-list-item v-if="photos && photos.length" class="detail-prop-list px-0 pb-2">
        <v-list-item-content v-if="photos && photos.length">
          <v-list-item-subtitle>Фото</v-list-item-subtitle>
          <div class="photo-containerr">
            <a
              v-for="(photo, i) in photos"
              :key="photo.id"
              @click="dialog = true; selectedPhoto = i"
            >
              <v-img :src="photo.link_small" class="grey lighten-2 mt-2"></v-img>
            </a>
          </div>
        </v-list-item-content>
      </v-list-item>
    </v-list>

    <v-dialog class="ma-0 pa-3" v-model="dialog" fullscreen content-class="photo-dialog">
       <v-carousel
          height="75vh"
          hide-delimiters
          :show-arrows = "photos.length > 1"
          v-model="selectedPhoto"
        >
          <v-carousel-item
            v-for="(photo, k) in photos"
            :key="k"
          >
            <v-img :src="photo.link_big" height="100%" contain></v-img>
          </v-carousel-item>
        </v-carousel>
        <v-btn icon text dark small class="close-img-dialog-btn" @click="dialog = false">
          <v-icon>close</v-icon>
        </v-btn>
    </v-dialog>
  </div>
</template>

<script lang="ts">
export { Detail as default } from "./Detail";
</script>

<style lang="scss" scoped>
.detail-prop-list {
  &:first-child{
    .v-list-item__content{
      padding-top: 0;
    }
  }
  .v-list__tile {
    height: auto !important;
  }
}

.photo-containerr {
  width: 100%;
  overflow: hidden;
}

.show-photo-card .v-card__text {
  padding: 0;
}

.v-dialog__content::v-deep .photo-dialog {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 24px;
  background-color: rgba(0,0,0,.7);
}

.v-dialog__content::v-deep .v-carousel__controls{
  position: fixed;
  bottom: 12px;
  left: 0;
  right: 0;
}

.close-img-dialog-btn {
  position: fixed;
  right: 10px;
  top: 10px;
  z-index: 10;
}

.detail{
  .v-list-item__content{
    padding-top: 6px;
    padding-bottom: 6px;
  }
}
</style>
