import { Component, Mixins, Watch } from 'vue-property-decorator';
import bbox from '@turf/bbox';

import VueNgwMapbox from '@nextgis/vue-ngw-mapbox';
import { fetchNgwLayerFeatures } from '@nextgis/ngw-kit';

import config from '../../config';
import { appModule } from '../../store/modules/app';
import { oralModule } from '../../store/modules/oral';
import { getOralPaint } from '../../utils/getHistoryIcons';

import type { Feature, Point, FeatureCollection } from 'geojson';
import type {
  GeoJsonAdapterOptions,
  VectorAdapterLayerType,
  FeatureLayerAdapter,
  VectorLayerAdapter,
} from '@nextgis/webmap';
import type {
  OralFeature,
  OralGeomType,
  OralProperties,
  OralLineFeature,
  OralPointFeature,
  OralPolygonFeature,
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
  point: string;
  line: string;
  poly: string;
}

@Component
export class OralMap extends Mixins(VueNgwMapbox) {
  layers: OralLayers = {
    point: '',
    line: '',
    poly: '',
  };

  initZoomSet = false;
  zoomToFilteredFlag = false;

  selected!: VectorLayerAdapter;

  private loaded = false;

  get filtered(): OralPointFeature[] {
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
        this._removeOralLayers();
        this.zoomToFilteredFlag = true;
      }
    }
  }

  @Watch('detailItem')
  setSelected(item: OralFeature): void {
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
      this._forEachGeomLayer(({ layer }) => {
        const a = isAlreadySelected(layer);
        return a;
      });
    if (item) {
      if (someLayerSelected()) {
        return;
      }
      const type = item.properties.geo || 'point';
      const layer = this.ngwMap.getLayer(
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
    } else {
      this._forEachGeomLayer(({ layer }) => {
        layer.unselect && layer.unselect();
      });
    }
  }

  @Watch('centerId')
  zoomTo(id: number): void {
    if (id) {
      this._forEachGeomLayer(({ layer }) => {
        if (id && layer && layer.getLayers) {
          const layers = layer.getLayers();
          if (layers && layers.length) {
            const layer = layers.find(
              (x) => x.feature && x.feature.properties.id1 === id,
            );
            const feature = layer && (layer.feature as Feature<Point>);
            if (feature) {
              this._zoomToFeature(feature);
              return true;
            }
          }
        }
      });
      appModule.zoomTo(null);
    }
  }

  async mounted(): Promise<void> {
    this.ngwMap.onLoad().then(() => {
      this._onLoad();
    });
  }

  async drawOralLayers(features: OralPointFeature[]): Promise<OralFeature[]> {
    const geoms: OralGeomType[] = ['poly', 'line', 'point'];
    const oralFeatures = await this._getOralFeatures(
      JSON.parse(JSON.stringify(features)),
    );
    for (const g of geoms) {
      await this._drawOralLayer(g, oralFeatures[g]);
    }
    if (this.zoomToFilteredFlag) {
      this.zoomToFiltered();
      this.zoomToFilteredFlag = false;
    }
    if (this.centerId) {
      this.zoomTo(this.centerId);
    }
    return features;
  }

  zoomToFiltered(): void {
    const features: Feature[] = [];
    this._forEachGeomLayer(({ layer }) => {
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
      this.ngwMap.fitBounds(extent, { maxZoom: 16, padding: 20 });
    }
  }

  private _removeOralLayers() {
    for (const l in this.layers) {
      this.ngwMap.removeLayer(l);
    }
  }

  private _forEachGeomLayer(
    cb: (opt: {
      layer: FeatureLayerAdapter<OralProperties>;
      geo: OralGeomType;
    }) => boolean | void,
  ): boolean {
    const geoms: OralGeomType[] = ['poly', 'line', 'point'];
    for (const geo of geoms) {
      const layerId = this.layers[geo];
      const layer = this.ngwMap.getLayer(
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
  }

  private async _drawOralLayer(geo: OralGeomType, features: OralFeature[]) {
    const layerId = this.layers[geo];
    const layer = this.ngwMap.getLayer(
      layerId,
    ) as FeatureLayerAdapter<OralProperties>;
    if (!layer) {
      const typeAlias: Record<OralGeomType, VectorAdapterLayerType> = {
        point: 'point',
        poly: 'polygon',
        line: 'line',
      };
      const data = this._prepareLayerData(features, geo);
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

      await this.ngwMap.addGeoJsonLayer(adapterOptions).then(() => {
        this.layers[geo] = geo;
      });
    } else if (layer.propertiesFilter) {
      layer.propertiesFilter([
        ['id1', 'in', features.map((x) => x.properties.id1)],
      ]);
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
      await this.drawOralLayers(items);
    }
    this.loaded = true;
  }

  private _zoomToFeature(feature: Feature) {
    if (feature.geometry.type === 'Point') {
      const lngLat =
        feature && (feature.geometry.coordinates as [number, number]);
      if (lngLat) {
        this.ngwMap.setView(lngLat, 15);
        // reset zoomTo storage value
      }
    } else {
      const extent = bbox(feature);
      this.ngwMap.fitBounds(extent, { maxZoom: 15 });
    }
  }
}
