<template>
  <VApp>
    <VMain>
      <!-- <MainPart /> -->
    </VMain>

    <LeftDrawer />
    <DetailDrawer />
    <ShareDialog />
  </VApp>
</template>

<script setup lang="ts">
import { onMounted, watch } from 'vue';
import { VApp } from 'vuetify/components';

import { prepareFilterData } from '../scripts/prepareFilterData';

import DetailDrawer from './components/DetailDrawer.vue';
import LeftDrawer from './components/LeftDrawer.vue';
import ShareDialog from './components/Share/ShareDialog .vue';
// import MainPart from './components/MainPart.vue';
import { url } from './services/url';
import { useAppStore } from './store/modules/app';
import { useOralStore } from './store/modules/oral';

const appStore = useAppStore();
const oralStore = useOralStore();

onMounted(async () => {
  const setFilterData = () => {
    const filterData = prepareFilterData(
      oralStore.items.map((x) => x.properties),
    );
    oralStore.setFilterData(filterData);
  };
  const id = url.get('id');
  if (id !== undefined) {
    try {
      const feature = await oralStore.setDetailById(id);
      if (feature) {
        watch(
          () => appStore.mapReady,
          () => {
            if (appStore.mapReady) {
              appStore.zoomTo(feature.properties.id1);
            }
          },
          { immediate: true },
        );
      }
    } catch (er) {
      url.remove('id');
    }
  }
  await oralStore.getAllItems();
  setFilterData();
  oralStore.resetSpecialFilter();
  await oralStore.loadStories();
  setFilterData();

  oralStore.getPhotos();
});
</script>

<style lang="scss">
* {
  padding: 0;
  margin: 0;
}

html,
body {
  width: 100%;
  height: 100%;
  overflow: hidden !important;
  font-size: 14px;
}

.fullscreen-dialog {
  .dialog-titlebar {
    flex-shrink: 0;
  }

  .dialog-body {
    flex-grow: 1;
    overflow-y: auto;
    overflow-x: auto;
  }
}

.subtitle {
  color: #a0a8ab;
}

.flex-body-content {
  overflow: auto;
}

.shadowed {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.24);
}

*::-webkit-scrollbar-track {
  background-color: inherit;
}

*::-webkit-scrollbar {
  width: 8px;
  background-color: inherit;
}

*::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.35);
}
*::-webkit-scrollbar-corner {
  background-color: transparent;
}

.theme--dark {
  *::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0.55);
  }
}
</style>
