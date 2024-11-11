<template>
  <VueNgwMap v-bind="attrs" @load="onMapLoad">
    <slot></slot>
  </VueNgwMap>
</template>
<script setup lang="ts">
import { fetchNgwLayerFeatures } from '@nextgis/ngw-kit';
import VueNgwMap from '@nextgis/vue-ngw-maplibre-gl';
import bbox from '@turf/bbox';
import { computed, ref, useAttrs, watch } from 'vue';

import config from '../config';
import { connector } from '../services/ngw';
import { useAppStore } from '../store/modules/app';
import { useOralStore } from '../store/modules/oral';
import { getOralPaint } from '../utils/getHistoryIcons';
import { getPathPaint } from '../utils/getHistoryPaint';
import { encodePlaceValue } from '../utils/place';

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
import type { NgwMap } from '@nextgis/ngw-map';
import type {
  FeatureLayerAdapter,
  GeoJsonAdapterOptions,
  VectorAdapterLayerType,
} from '@nextgis/webmap';
import type { Feature, FeatureCollection } from 'geojson';

const { ngwLineLayerId, ngwPolygonLayerId } = config;

const attrs = useAttrs();
const app = useAppStore();

const initZoomSet = ref(false);
const zoomToFilteredFlag = ref(false);
const loaded = ref(false);

const oralStore = useOralStore();

const filtered = computed<OralPointFeature[]>(() => oralStore.filtered);
const activePlace = computed<Partial<PlaceProperties>>(
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
  if (loaded.value) {
    drawOralLayers(filteredFeatures);
    if (!initZoomSet.value) {
      zoomToFiltered();
      initZoomSet.value = true;
    }
  }
});

watch(activePlace, (newPlace, oldPlace) => {
  if (loaded.value) {
    const activeCity = encodePlaceValue(newPlace, 'city');
    const oldCity = encodePlaceValue(oldPlace, 'city');
    if (activeCity !== oldCity) {
      removeOralLayers();
      zoomToFilteredFlag.value = true;
    }
  }
});

watch(detailItem, (item) => {
  if (item && loaded.value) {
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
  loaded.value = false;
  const geoms: OralGeomType[] = ['poly', 'line', 'point'];
  const oralFeatures = await getOralFeatures(
    JSON.parse(JSON.stringify(features)),
  );
  for (const g of geoms) {
    await drawOralLayer(g, oralFeatures[g]);
  }
  loaded.value = true;
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
    const extent = bbox({
      type: 'FeatureCollection',
      features,
    });
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

const drawOralLayer = async (geo: OralGeomType, features: OralFeature[]) => {
  const layerId = app.layers[geo];
  const layer = app.ngwMap?.getLayer(
    layerId,
  ) as FeatureLayerAdapter<OralProperties>;
  if (!layer) {
    const typeAlias: Record<OralGeomType, VectorAdapterLayerType> = {
      point: 'point',
      poly: 'polygon',
      line: 'line',
    };
    const data = prepareLayerData(features, geo);
    const adapterOptions: GeoJsonAdapterOptions<OralFeature> = {
      id: geo,
      data,
      type: typeAlias[geo] || 'point',
      paint: (feature) => {
        const geo = feature.properties.geo;
        if (geo && geo !== 'point') {
          return getPathPaint(feature, { weight: 2, fillOpacity: 0.4 }, true);
        }
        return getOralPaint(feature, { radius: 8 }, true);
      },
      selectedPaint: (feature) => {
        const geo = feature.properties.geo;
        if (geo && geo !== 'point') {
          return getPathPaint(feature, { weight: 4, fillOpacity: 0.8 });
        }
        return getOralPaint(feature, {
          radius: 13,
          weight: 3,
        });
      },
      waitFullLoad: true,
      selectable: true,
      unselectOnSecondClick: true,
      visibility: true,
      labelField: 'name',
      labelOnHover: true,
      onSelect: (e) => {
        if (e.type !== 'api') {
          const feature = e.features && e.features[0];
          const id = feature
            ? feature.properties
              ? Number(feature.properties.id1)
              : null
            : null;
          useOralStore().setDetail(id);
        }
      },
    };

    await app.ngwMap?.addGeoJsonLayer(adapterOptions);
    app.layers[geo] = geo;
  } else if (layer.propertiesFilter) {
    layer.propertiesFilter([
      ['id1', 'in', features.map((x) => x.properties.id1)],
    ]);
  }
};

const getOralFeatures = async (
  features: OralPointFeature[],
): Promise<OralFeatures> => {
  const oralFeatures: OralFeatures = {
    point: [],
    line: [],
    poly: [],
  };
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

const prepareLayerData = (
  features: OralFeature[],
  geom: OralGeomType = 'point',
): FeatureCollection => {
  const forMap: Feature[] = [];
  for (const x of features) {
    forMap.push({
      type: x.type,
      id: x.id,
      geometry: x.geometry,
      properties: {
        id1: x.properties.id1,
        type: x.properties.type,
        name: x.properties.name,
        geo: x.properties.geo || geom,
      },
    });
  }
  return { type: 'FeatureCollection', features: forMap };
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
  app.setNgwMap(ngwMap_);
  await ngwMap_.addNgwLayer({ resource: config.districtsLayer });
  // const items = filtered.value;
  // if (items && items.length) {
  //   await drawOralLayers(items);
  // }
  // app.setMapReady(true);
  // loaded.value = true;
};
</script>
