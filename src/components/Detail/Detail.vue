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

      <!-- <v-carousel>
        <a v-for="photo in photos" :key="photo.id" @click="dialog = true; bigImgSrc = photo.link_big">
          <v-carousel-item
            :src="photo.link_small"
            class="grey lighten-2"
          >
          </v-carousel-item>
        </a>
      </v-carousel> -->

      <v-dialog v-model="dialog" scrollable>
        <v-card v-if="bigImgSrc">
          <v-card-text>
            <div class="title grey--text" style="padding: 0 7px">
              <v-img
                :src="bigImgSrc"
                class="grey lighten-2"
              >
              </v-img>
            </div>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn flat @click.stop="dialog = false;">Закрыть</v-btn>
          </v-card-actions>
        </v-card>
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

</style>
