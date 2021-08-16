<template>
  <div>
    <v-text-field
      class="pt-2 pb-2"
      :value="url"
      flat
      dense
      readonly
      outlined
      hide-details
      @click:append="copyUrl"
    ></v-text-field>
    <!-- :append-icon="icons.copy" -->
    <v-divider></v-divider>
    <div class="share-network-list pt-2">
      <ShareNetwork
        v-for="n in networks"
        :network="n.network"
        :key="n.network"
        :style="{ backgroundColor: n.color }"
        :url="url"
        :title="title"
        :description="description"
        :quote="quote"
        :hashtags="hashtags"
      >
        <v-icon>{{ n.icon }}</v-icon>
        <span>{{ n.name }}</span>
      </ShareNetwork>
    </div>
    <v-snackbar v-model="snackbar" timeout="2000">
      Ссылка скопирована в буфер обмена
      <template v-slot:action="{ attrs }">
        <v-btn color="success" text v-bind="attrs" @click="snackbar = false">
          Закрыть
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script lang="ts">
export { Comments as default } from './Share';
</script>

<style lang="scss" scoped>
.share-network-list {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  max-width: 1000px;
  margin: auto;
}

a[class^='share-network-'] {
  height: 35px;
  flex: none;
  color: #ffffff;
  background-color: #333;
  border-radius: 3px;
  overflow: hidden;
  display: flex;
  flex-direction: row;
  align-content: center;
  align-items: center;
  cursor: pointer;
  margin: 0 10px 10px 0;
  text-decoration: none;
}

a[class^='share-network-'] span {
  padding: 0 10px;
  flex: 1 1;
  font-weight: 500;
}

a.share-network-twitter {
  background-color: #1da1f2;
}

a.share-network-fakeblock {
  background-color: #41b883;
}
</style>
