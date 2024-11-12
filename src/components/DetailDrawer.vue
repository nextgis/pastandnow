<template>
  <VNavigationDrawer
    v-model="detailDrawer"
    class="sidebar-drawer"
    location="right"
    width="360"
  >
    <div v-if="detail" class="drawer-content d-flex flex-column">
      <div
        v-scroll:#detail-content="onDetailScroll"
        class="sidebar-drawer__header flex-header-content"
        :class="{ shadowed: detailIsScrolled }"
      >
        <div class="pb-3 d-flex justify-space-between align-center">
          <VBtn
            class="sidebar-drawer__header-close"
            variant="text"
            :size="'small'"
            @click="detail = null"
          >
            <VIcon>{{ svg.close }}</VIcon>
          </VBtn>
          <VChip
            class="sidebar-drawer__header-chip text-uppercase font-weight-bold"
            :color="
              detail.properties.status === 'существующий'
                ? '#7bd235'
                : '#d2357b'
            "
            size="small"
            label
            variant="elevated"
          >
            {{ detail.properties.status }}
          </VChip>
        </div>
        <div class="text-subtitle-1 font-weight-medium">
          {{ detail.properties.name }}
        </div>
        <div class="text-caption text-secondary">
          {{ detail.properties.type }}
        </div>
      </div>
      <div
        id="detail-content"
        class="sidebar-drawer__content flex-grow-1 flex-body-content"
      >
        <DetailComponent />
      </div>
      <div class="sidebar-drawer__footer flex-footer-content">
        <div class="bottom-buttons">
          <div class="bottom-buttons__item">
            <VBtn variant="text" color="primary" @click="openFeedbackPage">
              <VIcon start>
                {{ svg.feedback }}
              </VIcon>
              Обратная связь
            </VBtn>
          </div>
          <VDivider class="mx-1 my-2" inset vertical />
          <div class="bottom-buttons__item">
            <VBtn
              variant="text"
              color="primary"
              @click="zoomTo(detail.properties.id1)"
            >
              <VIcon start>
                {{ svg.target }}
              </VIcon>
              На карте
            </VBtn>
          </div>
          <VDivider class="mx-1 my-2" inset vertical />
          <div class="bottom-buttons__item">
            <VBtn variant="text" color="primary" @click="shareDialog = true">
              <VIcon start>
                {{ svg.share }}
              </VIcon>
            </VBtn>
          </div>
        </div>
      </div>
    </div>
  </VNavigationDrawer>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import {
  VBtn,
  VChip,
  VDivider,
  VIcon,
  VNavigationDrawer,
} from 'vuetify/components';

import DetailComponent from '../components/DetailComponent.vue';
import config from '../config';
import { svg } from '../constants';
import { useWindowSize } from '../hooks/useWindowSize';
import { url } from '../services/url';
import { useAppStore } from '../store/modules/app';
import { useOralStore } from '../store/modules/oral';

import type { OralFeature } from '../interfaces';

const { feedbackUrl } = config;

const appStore = useAppStore();
const oralStore = useOralStore();

const { windowSize, isMobile } = useWindowSize();

const detailIsScrolled = ref(false);
const shareDialog = ref(false);

const detailDrawer = computed(() => !!oralStore.detailItem);

const zoomTo = (id: string) => appStore.zoomTo(id);

const openFeedbackPage = () => window.open(feedbackUrl, '_blank');

const onDetailScroll = (e: { target: HTMLElement }) =>
  (detailIsScrolled.value = e.target.scrollTop > 0);

const detail = computed({
  get: () => oralStore.detailItem,
  set: (value: null | OralFeature) => {
    const id1 = value && value.properties.id1;
    oralStore.setDetail(id1 ? Number(id1) : null);
  },
});

const drawer = computed({
  get: () => appStore.drawer,
  set: (value: boolean) => appStore.setDrawer(value),
});

const resolveDrawer = () => {
  if (detail.value && isMobile.value) {
    drawer.value = false;
  }
};

watch(detail, (val: null | OralFeature) => {
  const id = val && val.properties.id1;
  if (!id) {
    detailIsScrolled.value = false;
    url.remove('id');
  } else {
    url.set('id', id !== undefined ? String(id) : '');
  }
  if (window.parent) {
    window.parent.postMessage(JSON.stringify({ detail: id }), '*');
  }
});

watch(() => windowSize.value, resolveDrawer);
watch(detail, resolveDrawer);
</script>

<style lang="scss" scoped>
.bottom-buttons {
  width: 100%;
  display: flex;
  justify-content: space-around;

  .v-btn {
    flex-grow: 1;
    margin: 0;
  }
}
</style>
