import { Component, Mixins, Watch } from 'vue-property-decorator';
import { Map } from 'mapbox-gl';
import { Feature, Point, FeatureCollection } from 'geojson';
import bbox from '@turf/bbox';

import { VectorLayerAdapter } from '@nextgis/webmap';
import { NgwMap } from '@nextgis/ngw-map';
// @ts-ignore
import VueNgwMapbox from '@nextgis/vue-ngw-mapbox';

import config from '../../../config.json';
import { oralModule } from '../../store/modules/oral';
import { appModule } from '../../store/modules/app';

import { OralFeature } from '../../interfaces';
import { getHistoryIcon } from '../../utils/getHistoryIcons';

@Component
export class OralMap extends Mixins(VueNgwMapbox) {
  layer!: VectorLayerAdapter;

  ngwMap!: NgwMap<Map>;

  markers: { [name: string]: boolean } = {};
  selected!: VectorLayerAdapter;

  private loaded = false;

  get filtered(): OralFeature[] {
    return oralModule.filtered;
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
          this._prepareLayerData(newFeatures)
        );
      }
    }
  }

  @Watch('filtered')
  onFilteredChange(filtered: OralFeature[]): void {
    if (this.loaded) {
      this.drawMarkers(filtered);
      this.zoomToFiltered();
    }
  }

  @Watch('detailItem')
  setSelected(item: OralFeature): void {
    const layer = this.layer;
    if (item && layer.select) {
      layer.select([['$id', 'eq', item.id]]);
    } else if (layer.unselect) {
      // unselect all
      layer.unselect();
    }
  }

  @Watch('centerId')
  zoomTo(id: number): void {
    if (id && this.layer.getLayers) {
      const layers = this.layer && this.layer.getLayers();
      if (layers && layers.length) {
        const layer = layers.find(
          (x) =>
            x.feature && x.feature.properties && x.feature.properties.id === id
        );
        const feature = layer && (layer.feature as Feature<Point>);
        const lngLat =
          feature && (feature.geometry.coordinates as [number, number]);
        if (lngLat) {
          this.ngwMap.setView(lngLat, 14);
          // reset zoomTo storage value
          appModule.zoomTo(null);
        }
      }
    }
  }

  async mounted(): Promise<void> {
    this.ngwMap.onLoad().then(() => {
      this._onLoad();
    });
  }

  drawMarkers(features: OralFeature[]): void {
    if (!this.layer) {
      const data = this._prepareLayerData(features);
      this.ngwMap
        .addGeoJsonLayer({
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
          selectable: true,
          unselectOnSecondClick: true,
          visibility: true,
        })
        .then((layerId) => {
          const l = this.ngwMap.getLayer(layerId) as VectorLayerAdapter;
          this.layer = l;
          this.ngwMap.emitter.on(
            'layer:click',
            ({ layer, feature, selected }) => {
              if (layer.id === l.id) {
                oralModule.setDetail(
                  selected
                    ? feature && feature.properties
                      ? Number(feature.properties.id)
                      : null
                    : null
                );
              }
            }
          );
        });
    } else if (this.layer.propertiesFilter) {
      this.layer.propertiesFilter([['$id', 'in', features.map((x) => x.id)]]);
    }
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
    features.forEach((x) => {
      forMap.push({
        type: x.type,
        id: x.id,
        geometry: x.geometry,
        properties: { id: x.id, type: x.properties.type },
      });
    });
    return { type: 'FeatureCollection', features: forMap };
  }

  private async _onLoad() {
    await this.ngwMap.addNgwLayer({ resource: config.districtsLayer });
    const items = this.filtered;
    if (items && items.length) {
      const _items = JSON.parse(JSON.stringify(items));
      this.drawMarkers(_items);
    }
    this.loaded = true;
  }
}
