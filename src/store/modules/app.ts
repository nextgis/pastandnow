import { type FeatureLayerAdapter } from '@nextgis/ngw-map';
import bbox from '@turf/bbox';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

import type {
  OralGeomType,
  OralLayers,
  OralProperties,
} from '../../interfaces';
import type { NgwMap } from '@nextgis/ngw-map';
import type { Feature, Point } from 'geojson';

export type AppPages = 'main' | 'table' | 'about';

export const useAppStore = defineStore('app', () => {
  const layers = ref<OralLayers>({ point: '', line: '', poly: '' });
  const drawer = ref(true);
  const mapReady = ref(true);
  const page = ref<AppPages>('main');

  const ngwMap = ref<NgwMap>();

  const showDrawer = () => {
    drawer.value = true;
  };

  const hideDrawer = () => {
    drawer.value = false;
  };

  const toggleDrawer = (value: boolean) => {
    drawer.value = value;
  };

  const setPage = (newPage: AppPages) => {
    page.value = newPage;
  };

  const setNgwMap = (mapId: NgwMap) => {
    ngwMap.value = mapId;
  };

  const setMapReady = (mapReadyVal: boolean) => {
    mapReady.value = mapReadyVal;
  };

  const zoomToFeature = (feature: Feature) => {
    if (feature.geometry.type === 'Point') {
      const lngLat = feature.geometry.coordinates as [number, number];
      if (lngLat && ngwMap.value) {
        ngwMap.value.setView(lngLat, 15);
      }
    } else {
      const extent = bbox(feature);
      ngwMap.value?.fitBounds(extent, { maxZoom: 15 });
    }
  };

  const forEachGeomLayer = (
    cb: (opt: {
      layer: FeatureLayerAdapter<OralProperties>;
      geo: OralGeomType;
    }) => boolean | void,
  ): boolean => {
    const geoms: OralGeomType[] = ['poly', 'line', 'point'];
    for (const geo of geoms) {
      const layerId = layers.value[geo];
      const layer = ngwMap.value?.getLayer(
        layerId,
      ) as FeatureLayerAdapter<OralProperties>;
      if (layer) {
        const isStop = cb({ layer, geo });
        if (isStop) {
          return true;
        }
      }
    }
    return false;
  };

  const zoomTo = (id: string | number) => {
    if (id) {
      forEachGeomLayer(({ layer }) => {
        if (layer && layer.getLayers) {
          const layers = layer.getLayers();
          if (layers && layers.length) {
            const targetLayer = layers.find(
              (x) =>
                x.feature && String(x.feature.properties.id1) === String(id),
            );
            const feature =
              targetLayer && (targetLayer.feature as Feature<Point>);
            if (feature) {
              zoomToFeature(feature);
              return true;
            }
          }
        }
      });
    }
  };

  return {
    page: computed(() => page.value),
    drawer: computed(() => drawer.value),
    ngwMap,
    layers,
    mapReady,
    forEachGeomLayer,
    zoomToFeature,
    toggleDrawer,
    setMapReady,
    showDrawer,
    hideDrawer,
    setNgwMap,
    setPage,
    zoomTo,
  };
});
