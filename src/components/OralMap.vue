<template>
  <VueNgwMap v-bind="attrs" @load="onMapLoad">
    <slot />
  </VueNgwMap>
</template>
<script setup lang="ts">
import { fetchNgwLayerFeatures } from '@nextgis/ngw-kit';
import VueNgwMap from '@nextgis/vue-ngw-maplibre-gl';
import bbox from '@turf/bbox';
import { computed, ref, useAttrs, watch } from 'vue';

import config from '../config';
import { useOralLayer } from '../hooks/useOralLayer';
import { connector } from '../services/ngw';
import { useAppStore } from '../store/modules/app';
import { useOralStore } from '../store/modules/oral';
import { encodePlaceValue } from '../utils/place';

import type { NgwMap } from '@nextgis/ngw-map';
import type { FeatureLayerAdapter } from '@nextgis/webmap';
import type { Feature } from 'geojson';
import type { Map } from 'maplibre-gl';

import type {
  OralFeature,
  OralFeatures,
  OralGeomType,
  OralLineFeature,
  OralPointFeature,
  OralPolygonFeature,
  OralProperties,
  PlaceProperties,
} from '../interfaces';

const { ngwLineLayerId, ngwPolygonLayerId } = config;
const attrs = useAttrs() as Readonly<Record<string, unknown>>;
const app = useAppStore();

const { drawOralLayer, prepareLayerData } = useOralLayer();

const zoomToFilteredFlag = ref(false);

const oralStore = useOralStore();

const filtered = computed<OralPointFeature[]>(() => oralStore.filtered);
const activePlace = computed<Partial<PlaceProperties> | undefined>(
  () => oralStore.activePlace,
);
const items = computed<OralPointFeature[]>(() => [...oralStore.items]);
const detailItem = computed<OralFeature | null>(() => oralStore.detailItem);

watch(items, (newFeatures, oldFeatures) => {
  if (newFeatures.length !== oldFeatures.length) {
    if (app.layers) {
      setLayersData(newFeatures);
    }
  }
});

watch(filtered, (filteredFeatures) => {
  drawOralLayers(filteredFeatures);
  if (!app.initZoomSet) {
    zoomToFiltered();
    app.initZoomSet = true;
  }
});

watch(activePlace, (newPlace, oldPlace) => {
  const activeCity = newPlace ? encodePlaceValue(newPlace, 'city') : null;
  const oldCity = oldPlace ? encodePlaceValue(oldPlace, 'city') : null;
  if (activeCity !== oldCity) {
    removeOralLayers();
    zoomToFilteredFlag.value = true;
  }
});

watch(detailItem, (item) => {
  if (item) {
    setSelected(item);
  } else {
    app.forEachGeomLayer(({ layer }) => {
      if (layer.unselect) {
        layer.unselect();
      }
    });
  }
});

const drawOralLayers = async (features: OralPointFeature[]) => {
  // const geoms: OralGeomType[] = ['poly', 'line', 'point'];
  const geoms: OralGeomType[] = ['point'];
  const oralFeatures = await getOralFeatures(
    JSON.parse(JSON.stringify(features)),
  );
  for (const g of geoms) {
    await drawOralLayer(g, oralFeatures[g]);
  }

  if (zoomToFilteredFlag.value) {
    zoomToFiltered();
    zoomToFilteredFlag.value = false;
  }
  if (detailItem.value) {
    setSelected(detailItem.value);
  }
};

const zoomToFiltered = () => {
  const features: Feature[] = [];
  app.forEachGeomLayer(({ layer }) => {
    if (layer && layer.getLayers) {
      const layers = layer.getLayers();
      for (const x of layers) {
        if (x.feature && x.visible) {
          features.push(x.feature);
        }
      }
    }
  });
  if (features.length) {
    const extent = bbox({ type: 'FeatureCollection', features });
    app.ngwMap?.fitBounds(extent, { maxZoom: 16, padding: 20 });
  }
};

const removeOralLayers = () => {
  if (app.ngwMap) {
    for (const l in app.layers) {
      app.ngwMap.removeLayer(l);
    }
  }
};

const getOralFeatures = async (
  features: OralPointFeature[],
): Promise<OralFeatures> => {
  const oralFeatures: OralFeatures = { point: [], line: [], poly: [] };
  const lineIds: number[] = [];
  const polygonIds: number[] = [];
  for (const f of features) {
    const geo = f.properties.geo;
    const id1 = Number(f.properties.id1);
    if (geo === 'line') {
      lineIds.push(id1);
    } else if (geo === 'poly') {
      polygonIds.push(id1);
    } else {
      oralFeatures.point.push(f);
    }
  }
  const resourcesToFetch: [
    geo: OralGeomType,
    resourceId: number,
    featureIds: number[],
  ][] = [
    ['line', ngwLineLayerId, lineIds],
    ['poly', ngwPolygonLayerId, polygonIds],
  ];
  for (const r of resourcesToFetch) {
    const [geo, resourceId, ids] = r;
    if (ids.length) {
      ids.filter(Boolean).sort();

      const geoFeatures = await fetchNgwLayerFeatures<any, OralProperties>({
        connector,
        resourceId,
        cache: true,
        filters: [['id1', 'in', ids]],
      });
      oralFeatures[geo] = geoFeatures as OralPointFeature[] &
        OralLineFeature[] &
        OralPolygonFeature[];
    }
  }
  return oralFeatures;
};

const setLayersData = async (features: OralPointFeature[]) => {
  if (app.ngwMap) {
    const oralFeatures = await getOralFeatures(features);
    const geoms: OralGeomType[] = ['point', 'line', 'poly'];
    for (const g of geoms) {
      const layer = app.layers[g];
      const features = prepareLayerData(oralFeatures[g], g);
      if (layer) {
        app.ngwMap.setLayerData(layer, features);
      }
    }
  }
};

const setSelected = (item: OralFeature) => {
  const isAlreadySelected = (l: FeatureLayerAdapter<OralProperties>) => {
    return (
      l.getSelected &&
      l
        .getSelected()
        .some(
          (x) =>
            x.feature &&
            x.feature.properties &&
            x.feature.properties.id1 === item.properties.id1,
        )
    );
  };
  const someLayerSelected = () =>
    app.forEachGeomLayer(({ layer }) => isAlreadySelected(layer));
  if (someLayerSelected()) {
    return;
  }
  const type = item.properties.geo || 'point';
  const layer = app.ngwMap?.getLayer(
    type,
  ) as FeatureLayerAdapter<OralProperties>;
  if (layer) {
    if (layer.select) {
      layer.select([['id1', 'eq', item.properties.id1]]);
    } else if (layer.unselect) {
      // unselect all
      layer.unselect();
    }
  }
};

const onMapLoad = async (ngwMap_: NgwMap) => {
  app.setNgwMap(ngwMap_ as NgwMap<Map>);
  await ngwMap_.addNgwLayer({ resource: config.districtsLayer });
  app.setMapReady(true);
};
</script>
