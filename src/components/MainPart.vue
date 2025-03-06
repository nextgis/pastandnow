<template>
  <OralMap v-if="mapOptions" :map-options="mapOptions" full-filling>
    <VueNgwControl position="top-left" margin>
      <VBtn
        v-if="!appStore.drawer"
        class="rectangle-fab bg-white"
        :icon="svg.chevron_right"
        variant="text"
        color="grey"
        @click="appStore.toggleDrawer"
      >
      </VBtn>
    </VueNgwControl>
    <VueNgwControl position="top-right" margin>
      <VBtn
        class="rectangle-fab bg-white"
        :icon="svg.fit"
        variant="text"
        color="grey"
        @click="appStore.zoomToFiltered"
      >
      </VBtn>
    </VueNgwControl>
    <VueNgwControl position="bottom-left" margin>
      <div v-if="appStore.legendOpen" class="d-flex flex-column">
        <VCard
          v-if="oralStore.legendItems.length"
          class="mx-auto legend-card"
          max-width="300"
          max-height="500"
          theme="dark"
        >
          <div class="legend-header flex-header-content">
            <div class="d-flex justify-space-between align-center">
              <span class="legend-card__title">Легенда</span>
              <VBtn
                class="legend__close"
                variant="text"
                :icon="svg.close"
                density="compact"
                color="white"
                @click="appStore.legendOpen = false"
              >
              </VBtn>
            </div>
          </div>
          <div class="flex-grow-1 flex-body-content legend-body">
            <LegendComponent class="pt-0" />
          </div>
        </VCard>
      </div>
      <div v-else>
        <VBtn
          class="rectangle-fab bg-white"
          :icon="svg.list"
          variant="text"
          color="grey"
          @click="appStore.toggleLegend"
        >
        </VBtn>
      </div>
    </VueNgwControl>
  </OralMap>
</template>

<script setup lang="ts">
import { VueNgwControl } from '@nextgis/vue-ngw-map';
import { onMounted, shallowRef } from 'vue';
import { VBtn, VCard } from 'vuetify/components';

import LegendComponent from '../components/LegendComponent.vue';
import OralMap from '../components/OralMap.vue';
import config from '../config';
import { svg } from '../constants';
import { connector } from '../services/ngw';
import { useAppStore } from '../store/modules/app';
import { useOralStore } from '../store/modules/oral';

import type { NgwMapOptions } from '@nextgis/ngw-map';
import type { StyleSpecification } from 'maplibre-gl';

const { qmsId } = config;

const appStore = useAppStore();
const oralStore = useOralStore();
const mapOptions = shallowRef<NgwMapOptions | null>(null);

onMounted(async () => {
  let style: Partial<StyleSpecification> | undefined = undefined;
  try {
    const resp = await fetch(config.geoservice.url);
    style = (await resp.json()) as StyleSpecification;
    style = {
      transition: {
        duration: 0,
        delay: 0,
      },
      ...style,
    };
  } catch {
    //
  }

  mapOptions.value = {
    connector,
    target: 'map',
    center: [105.3188, 61.524],
    zoom: 3,
    qmsId: style ? undefined : qmsId,
    controls: ['ZOOM', 'ATTRIBUTION'],
    controlsOptions: {
      ZOOM: { position: 'top-right' },
      ATTRIBUTION: { position: 'bottom-right' },
    },
    mapAdapterOptions: {
      style: style ? style : undefined,
    },
  };
});
</script>

<style lang="scss" scoped>
@use '@/styles/settings' as settings;

.rectangle-fab {
  border-radius: settings.$border-radius-root;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.25);
}

.legend-body {
  overflow: auto;
  max-height: 50vh;
}

.legend__close {
  opacity: 0.5;
  margin-right: -8px;

  &:hover {
    opacity: 1;
  }
}

.legend-card {
  &.v-theme--dark {
    background-color: rgba(0, 0, 0, 0.75);
  }

  .legend-header {
    padding: 12px 16px 0;
    margin-bottom: 2px;
  }

  &__title {
    font-size: 14px;
    font-weight: 600;
  }
}
</style>
