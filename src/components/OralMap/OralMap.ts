import { Component, Mixins, Watch } from 'vue-property-decorator';
import { Feature, Point, FeatureCollection } from 'geojson';
import bbox from '@turf/bbox';

import { GeoJsonAdapterOptions, VectorLayerAdapter } from '@nextgis/webmap';
// @ts-ignore
import VueNgwMapbox from '@nextgis/vue-ngw-mapbox';

import config from '../../config';
import { oralModule } from '../../store/modules/oral';
import { appModule } from '../../store/modules/app';

import { OralFeature } from '../../interfaces';
import { getHistoryIcon } from '../../utils/getHistoryIcons';

@Component
export class OralMap extends Mixins(VueNgwMapbox) {
  layer?: VectorLayerAdapter;

  initZoomSet = false;

  markers: { [name: string]: boolean } = {};
  selected!: VectorLayerAdapter;

  private loaded = false;

  get filtered(): OralFeature[] {
    return oralModule.filtered;
  }

  get activeCity(): string {
    return oralModule.activeCity;
  }

  get items(): OralFeature[] {
    return oralModule.items;
  }

  get detailItem(): false | OralFeature {
    return oralModule.detailItem;
  }

  get centerId(): number | null {
    return appModule.centerId;
  }

  @Watch('items')
  onItemsChange(newFeatures: OralFeature[], old: OralFeature[]): void {
    if (newFeatures.length !== old.length) {
      if (this.ngwMap && this.layer) {
        this.ngwMap.setLayerData(
          this.layer,
          this._prepareLayerData(newFeatures),
        );
      }
    }
  }

  @Watch('filtered')
  onFilteredChange(filtered: OralFeature[]): void {
    if (this.loaded) {
      this.drawMarkers(filtered);
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
    const layer = this.layer;
    if (layer) {
      if (item && layer.select) {
        if (layer.getSelected) {
          const isAlredySelected = layer
            .getSelected()
            .some((x) => x.feature && x.feature.id === item.id);
          if (isAlredySelected) {
            return;
          }
        }
        layer.select([['$id', 'eq', item.id]]);
      } else if (layer.unselect) {
        // unselect all
        layer.unselect();
      }
    }
  }

  @Watch('centerId')
  zoomTo(id: number): void {
    const layer = this.layer;
    if (id && layer && layer.getLayers) {
      const layers = layer.getLayers();
      if (layers && layers.length) {
        const layer = layers.find((x) => x.feature && x.feature.id === id);
        const feature = layer && (layer.feature as Feature<Point>);
        feature && this._zoomToFeature(feature);
      }
    }
  }

  async mounted(): Promise<void> {
    this.ngwMap.onLoad().then(() => {
      this._onLoad();
    });
  }

  async drawMarkers(features: OralFeature[]): Promise<OralFeature[]> {
    if (!this.layer) {
      const data = this._prepareLayerData(features);
      const adapterOptions: GeoJsonAdapterOptions<OralFeature> = {
        data,
        type: 'point',
        paint: (feature) => {
          return getHistoryIcon(feature, { radius: 8 }, true);
        },
        selectedPaint: (feature) => {
          return getHistoryIcon(feature, {
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
              ? Number(feature.properties.id)
              : null
            : null;
          oralModule.setDetail(id);
        },
      };

      await this.ngwMap.addGeoJsonLayer(adapterOptions).then((layerId) => {
        const l = this.ngwMap.getLayer(layerId) as VectorLayerAdapter;
        this.layer = l;
      });
    } else if (this.layer.propertiesFilter) {
      this.layer.propertiesFilter([['$id', 'in', features.map((x) => x.id)]]);
    }
    if (this.centerId) {
      this.zoomTo(this.centerId);
    }
    return features;
  }

  zoomToFiltered(): void {
    const layer = this.layer;
    if (layer && layer.getLayers) {
      const layers = layer.getLayers();
      const features = layers
        .filter((x) => {
          return x.visible;
        })
        .map((x) => x.feature);
      if (features.length) {
        const extent = bbox({
          type: 'FeatureCollection',
          features,
        });
        this.ngwMap.fitBounds(extent, { maxZoom: 16, padding: 20 });
      }
    }
  }

  private _prepareLayerData(features: OralFeature[]): FeatureCollection {
    const forMap: Feature[] = [];
    for (const x of features) {
      forMap.push({
        type: x.type,
        id: x.id,
        geometry: x.geometry,
        properties: {
          id: x.id,
          type: x.properties.type,
          name: x.properties.name,
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
      await this.drawMarkers(_items);
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
