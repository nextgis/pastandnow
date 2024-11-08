<template>
  <div v-if="detail && meta" class="detail">
    <VList density="compact" class="pt-0">
      <VListItem
        v-for="item in properties"
        :key="item.value"
        class="detail-prop-list px-0 pb-0"
      >
        <span class="text-caption text-secondary">{{ item.text }}</span>
        <span class="text-body-2" v-html="getText(item)"></span>
      </VListItem>
      <VListItem
        v-if="photos && photos.length"
        class="detail-prop-list px-0 pb-2"
      >
        <VListItemSubtitle>Фото</VListItemSubtitle>
        <div class="photo-containerr">
          <a
            v-for="(photo, i) in photos"
            :key="photo.id"
            @click="
              dialog = true;
              selectedPhoto = i;
            "
          >
            <VImg :src="photo.link_small" class="bg-grey-lighten-2 mt-2"></VImg>
          </a>
        </div>
      </VListItem>
      <VListItem class="detail-prop-list px-0 pb-2">
        <!-- <Comments v-if="id" :id="id" :key="id"></Comments> -->
      </VListItem>
    </VList>

    <VDialog
      v-model="dialog"
      class="ma-0 pa-3"
      fullscreen
      content-class="photo-dialog"
    >
      <VCarousel
        v-model="selectedPhoto"
        height="75vh"
        :show-arrows="photos.length > 1"
      >
        <VCarouselItem v-for="(photo, k) in photos" :key="k">
          <VImg :src="photo.link_big" height="100%" cover></VImg>
        </VCarouselItem>
      </VCarousel>
      <VBtn
        icon
        variant="text"
        size="small"
        class="close-img-dialog-btn"
        @click="dialog = false"
      >
        <VIcon>{{ svg.close }}</VIcon>
      </VBtn>
    </VDialog>
  </div>
</template>

<script setup lang="ts">
import { mdiClose } from '@mdi/js';
import { computed, ref } from 'vue';
import {
  VBtn,
  VCarousel,
  VCarouselItem,
  VDialog,
  VIcon,
  VImg,
  VList,
  VListItem,
  VListItemSubtitle,
} from 'vuetify/components';

import { useAppStore } from '../store/modules/app';
import { useOralStore } from '../store/modules/oral';
import { isValidUrl } from '../utils/isValidUrl';

// import Comments from './Comments/CommentsComponent.vue';

import type {
  LayerMetaItem,
  OralPhotoProperties,
  OralProperties,
} from '../interfaces';

declare global {
  interface Window {
    openDetail: (e: string) => Promise<void>;
  }
}

const url = 'https://pastandnow.ru';
const dialog = ref(false);
const selectedPhoto = ref(0);
const svg = { close: mdiClose };

const oralStore = useOralStore();
const appStore = useAppStore();

const detail = computed(() => {
  return oralStore.detailItem && oralStore.detailItem.properties;
});

const photos = computed(() => {
  const photo = oralStore.photos.find((x: OralPhotoProperties) => {
    return (
      detail.value && x.link_small && x.id_obj === Number(detail.value.id1)
    );
  });
  return photo ? [photo] : [];
});

// const id = computed(() => {
//   return oralStore.detailItem && oralStore.detailItem.properties.id1;
// });

const meta = computed(() => {
  return oralStore.meta;
});

const properties = computed(() => {
  return meta.value.filter((x) => {
    const detailValue = getDetail(x.value);
    return detailValue && (x.detail ?? true);
  });
});

const getDetail = (key: string): undefined | string | number | null => {
  const v = key as keyof OralProperties;
  let value = detail.value ? detail.value[v] : undefined;
  if (typeof value === 'string') {
    value = value.replace(/\[([^[\]]*)\]\((.*?)\)/gm, (m, text, url) => {
      let url_: string | null = null;
      if (/^#\d+$/.test(url)) {
        const id1 = url.replace('#', '');
        url_ = window.location.origin + '/?id=' + id1;
        window.openDetail = async (e: string) => {
          const feature = await oralStore.setDetailById(Number(e));
          feature && appStore.zoomTo(String(feature.properties.id1));
        };
        return `<a target="_blank" onclick="return openDetail(${id1})">${
          text || url
        }</a>`;
      }
      if (isValidUrl(url)) {
        url_ = url;
      }
      if (url_) {
        return `<a href="${url_}" target="_blank">${text || url}</a>`;
      }
      return m;
    });
  }
  return value;
};

const getText = (alias: LayerMetaItem): string | number | undefined | null => {
  if (alias.type) {
    const value = getDetail(alias.value);
    if (alias.type === 'NarratorLink') {
      const detailValue = getDetail(alias.value);
      if (value && typeof detailValue === 'string') {
        const names = detailValue.split(',').map((x) => x.trim());
        const links: string[] = getAuthorLinks(names);
        return (
          names &&
          names
            .map((x, i) => {
              const link = links ? links[i] || links[0] : '';
              const href = (url + '/' + link).replace(/([^:]\/)\/+/g, '$1');
              return `<a href="${href}" target="_blank">${x}</a>`;
            })
            .join(', ')
        );
      }
    } else if (alias.type === 'Special') {
      return value === 1
        ? `<i
          aria-hidden="true"
          class="v-icon material-icons"
          style="color: green;"
        >check
        </i>`
        : `<i
          aria-hidden="true"
          class="v-icon material-icons"
          style="color: red;"
        >close
        </i>`;
    }
  }
  return getDetail(alias.value);
};

const getAuthorLinks = (names: string[]): string[] => {
  return names.map((name) =>
    name
      .replace(/\*/g, '0')
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]/g, ''),
  );
};
</script>

<style lang="scss" scoped>
.detail-prop-list {
  &:first-child {
    :deep(.v-list-item-text) {
      padding-top: 0;
    }
  }
}

.photo-containerr {
  width: 100%;
  overflow: hidden;
}

.show-photo-card :deep(.v-card-text) {
  padding: 0;
}

:deep(.photo-dialog) {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 24px;
  background-color: rgba(0, 0, 0, 0.7);
}

:deep(.v-carousel__controls) {
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

.detail {
  :deep(.v-list-item-text) {
    padding-top: 6px;
    padding-bottom: 6px;
  }
}
</style>
