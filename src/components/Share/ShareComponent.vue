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

    <v-divider></v-divider>
    <div class="share-network-list pt-2">
      <ShareNetwork
        v-for="n in networks"
        :key="n.network"
        :network="n.network"
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
      <template #action="{ attrs }">
        <v-btn color="success" text v-bind="attrs" @click="snackbar = false">
          Закрыть
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script setup lang="ts">
import { mdiEmail, mdiTelegram, mdiVk } from '@mdi/js';
import { Clipboard } from '@nextgis/utils';
import { computed, ref } from 'vue';
// import VueSocialSharing from 'vue-social-sharing';

import type { OralFeature } from '../../interfaces';

// Vue.use(VueSocialSharing);

const props = defineProps({
  item: {
    type: Object as () => OralFeature,
    required: true,
  },
});

const description = ref('');
const snackbar = ref(false);

const hashtags = 'pastandnow';

const networks = [
  {
    network: 'email',
    name: 'Email',
    icon: mdiEmail,
    color: '#333333',
  },
  {
    network: 'telegram',
    name: 'Telegram',
    icon: mdiTelegram,
    color: '#0088cc',
  },
  {
    network: 'vk',
    name: 'Vk',
    icon: mdiVk,
    color: '#4a76a8',
  },
];

const url = computed(
  () => `https://pastandnow.ru/?id=${props.item.properties.id1}`,
);
const title = computed(() => props.item.properties.name || '');
const quote = computed(() => props.item.properties.name || '');

const copyUrl = () => {
  const isCopy = Clipboard.copy(url.value);
  if (isCopy) {
    snackbar.value = true;
  }
};
</script>

<style setup lang="scss" scoped>
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
