import { Component, Mixins, Watch } from 'vue-property-decorator';
import bbox from '@turf/bbox';

import VueNgwMapbox from '@nextgis/vue-ngw-mapbox';
import { fetchNgwLayerFeatures } from '@nextgis/ngw-kit';

import config from '../../config';
import { oralModule } from '../../store/modules/oral';
import { appModule } from '../../store/modules/app';
import { getOralPaint } from '../../utils/getHistoryIcons';

import type {
  Feature,
  Point,
  FeatureCollection,
  LineString,
  MultiPolygon,
} from 'geojson';
import type {
  FeatureLayerAdapter,
  GeoJsonAdapterOptions,
  VectorAdapterLayerType,
  VectorLayerAdapter,
} from '@nextgis/webmap';
import type {
  OralFeature,
  OralGeomType,
  OralLineFeature,
  OralPointFeature,
  OralPolygonFeature,
  OralProperties,
} from '../../interfaces';
import { connector } from '../../services/ngw';
import { getPathPaint } from '../../utils/getHistoryPaint';

const { ngwLineLayerId, ngwPolygonLayerId } = config;

interface OralFeatures {
  point: OralPointFeature[];
  line: OralLineFeature[];
  poly: OralPolygonFeature[];
}
interface OralLayers {
  point: FeatureLayerAdapter<OralProperties, Point> | null;
  line: FeatureLayerAdapter<OralProperties, LineString> | null;
  poly: FeatureLayerAdapter<OralProperties, MultiPolygon> | null;
}

@Component
export class OralMap extends Mixins(VueNgwMapbox) {
  layers: OralLayers = {
    point: null,
    line: null,
    poly: null,
  };

  initZoomSet = false;

  selected!: VectorLayerAdapter;

  private loaded = false;

  get filtered(): OralFeature[] {
    return oralModule.filtered;
  }

  get activeCity(): string {
    return oralModule.activeCity;
  }

  get items(): OralFeature[] {
    return [...oralModule.items];
  }

  get detailItem(): false | OralFeature {
    return oralModule.detailItem;
  }

  get centerId(): number | null {
    return appModule.centerId;
  }

  @Watch('items')
  onItemsChange(
    newFeatures: OralPointFeature[],
    old: OralPointFeature[],
  ): void {
    if (newFeatures.length !== old.length) {
      if (this.ngwMap && this.layers) {
        this._setLayersData(newFeatures);
      }
    }
  }

  @Watch('filtered')
  onFilteredChange(filtered: OralPointFeature[]): void {
    if (this.loaded) {
      this.drawOralLayers(filtered);
      if (!this.initZoomSet) {
        this.zoomToFiltered();
        this.initZoomSet = true;
      }
    }
  }

  @Watch('activeCity')
  onFiltersChange(activeCity: string, oldCity: string): void {
    if (this.loaded) {
      if (activeCity !== oldCity) {
        const watcher = this.$watch('filtered', () => {
          this.zoomToFiltered();
          watcher();
        });
      }
    }
  }

  @Watch('detailItem')
  setSelected(item: OralFeature): void {
    const layer = this.layers;
    // if (layer) {
    //   if (item && layer.select) {
    //     if (layer.getSelected) {
    //       const isAlredySelected = layer
    //         .getSelected()
    //         .some((x) => x.feature && x.feature.id === item.id);
    //       if (isAlredySelected) {
    //         return;
    //       }
    //     }
    //     layer.select([['$id', 'eq', item.id]]);
    //   } else if (layer.unselect) {
    //     // unselect all
    //     layer.unselect();
    //   }
    // }
  }

  @Watch('centerId')
  zoomTo(id: number): void {
    const layer = this.layers;
    // if (id && layer && layer.getLayers) {
    //   const layers = layer.getLayers();
    //   if (layers && layers.length) {
    //     const layer = layers.find((x) => x.feature && x.feature.id === id);
    //     const feature = layer && (layer.feature as Feature<Point>);
    //     feature && this._zoomToFeature(feature);
    //   }
    // }
  }

  async mounted(): Promise<void> {
    this.ngwMap.onLoad().then(() => {
      this._onLoad();
    });
  }

  async drawOralLayers(features: OralPointFeature[]): Promise<OralFeature[]> {
    const geoms: OralGeomType[] = ['poly', 'line', 'point'];
    const oralFeatures = await this._getOralFeatures(features);
    for (const g of geoms) {
      await this._drawOralLayer(g, oralFeatures[g]);
    }

    if (this.centerId) {
      this.zoomTo(this.centerId);
    }
    return features;
  }

  zoomToFiltered(): void {
    const layer = this.layers;
    // if (layer && layer.getLayers) {
    //   const layers = layer.getLayers();
    //   const features = layers
    //     .filter((x) => {
    //       return x.visible;
    //     })
    //     .map((x) => x.feature);
    //   if (features.length) {
    //     const extent = bbox({
    //       type: 'FeatureCollection',
    //       features,
    //     });
    //     this.ngwMap.fitBounds(extent, { maxZoom: 16, padding: 20 });
    //   }
    // }
  }

  private async _drawOralLayer(geo: OralGeomType, features: OralFeature[]) {
    const layer = this.layers[geo];
    if (!layer) {
      const typeAlias: Record<OralGeomType, VectorAdapterLayerType> = {
        point: 'point',
        poly: 'polygon',
        line: 'line',
      };
      const data = this._prepareLayerData(features, geo);
      const adapterOptions: GeoJsonAdapterOptions<OralFeature> = {
        data,
        type: typeAlias[geo] || 'point',
        paint: (feature) => {
          const geo = feature.properties.geo;
          if (geo && geo !== 'point') {
            return getPathPaint(feature, { fillOpacity: 0.3 }, true);
          }
          return getOralPaint(feature, { radius: 8 }, true);
        },
        selectedPaint: (feature) => {
          const geo = feature.properties.geo;
          if (geo && geo !== 'point') {
            return getPathPaint(feature, { fillOpacity: 0.8 }, true);
          }
          return getOralPaint(feature, {
            radius: 13,
            weight: 3,
          });
        },
        // unselectOnClick: false,
        selectable: true,
        unselectOnSecondClick: true,
        visibility: true,
        labelField: 'name',
        labelOnHover: true,
        onSelect: (e) => {
          const feature = e.features && e.features[0];

          const id = feature
            ? feature.properties
              ? Number(feature.properties.id1)
              : null
            : null;
          oralModule.setDetail(id);
        },
      };

      // if (geo !== 'point') {
      //   adapterOptions.paint = {
      //     fill: true,
      //     color: 'red',
      //     opacity: 0.3,
      //     type: 'path',
      //   };
      //   adapterOptions.selectedPaint = { opacity: 0.3 };
      // }

      await this.ngwMap.addGeoJsonLayer(adapterOptions).then((layerId) => {
        const l = this.ngwMap.getLayer(layerId) as FeatureLayerAdapter<
          OralProperties,
          any
        >;
        this.layers[geo] = l;
      });
    } else if (layer.propertiesFilter) {
      // layer.propertiesFilter([
      //   ['id1', 'in', features.map((x) => x.properties.id1)],
      // ]);
    }
  }

  private async _getOralFeatures(
    features: OralPointFeature[],
  ): Promise<OralFeatures> {
    const oralFeatures: OralFeatures = {
      point: [],
      line: [],
      poly: [],
    };
    const lineIds: number[] = [];
    const polygonIds: number[] = [];
    for (const f of features) {
      const geo = f.properties.geo;
      const id1 = f.properties.id1;
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
        oralFeatures[geo] = geoFeatures;
      }
    }
    return oralFeatures;
  }

  private async _setLayersData(features: OralPointFeature[]): Promise<void> {
    const oralFeatures = await this._getOralFeatures(features);
    const geoms: OralGeomType[] = ['point', 'line', 'poly'];
    for (const g of geoms) {
      const layer = this.layers[g];
      const features = this._prepareLayerData(oralFeatures[g], g);
      if (layer) {
        this.ngwMap.setLayerData(layer, features);
      }
    }
  }

  private _prepareLayerData(
    features: OralFeature[],
    geom: OralGeomType = 'point',
  ): FeatureCollection {
    const forMap: Feature[] = [];
    for (const x of features) {
      forMap.push({
        type: x.type,
        id: x.id,
        geometry: x.geometry,
        properties: {
          id: x.id,
          id1: x.properties.id1,
          type: x.properties.type,
          name: x.properties.name,
          geo: x.properties.geo || geom,
        },
      });
    }
    return { type: 'FeatureCollection', features: forMap };
  }

  private async _onLoad() {
    await this.ngwMap.addNgwLayer({ resource: config.districtsLayer });
    const items = this.filtered;
    if (items && items.length) {
      const _items = JSON.parse(JSON.stringify(items));
      await this.drawOralLayers(_items);
    }
    this.loaded = true;
  }

  private _zoomToFeature(feature: Feature<Point>) {
    const lngLat =
      feature && (feature.geometry.coordinates as [number, number]);
    if (lngLat) {
      this.ngwMap.setView(lngLat, 14);
      // reset zoomTo storage value
      appModule.zoomTo(null);
    }
  }
}
