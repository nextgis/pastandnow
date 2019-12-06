import 'mapbox-gl/dist/mapbox-gl.css';

import { Component, Mixins, Watch } from 'vue-property-decorator';

import { Feature, Point, FeatureCollection } from 'geojson';
// @ts-ignore
import geojsonExtent from '@mapbox/geojson-extent';

import { VectorLayerAdapter } from '@nextgis/webmap';
import { NgwMapOptions } from '@nextgis/ngw-map';
import { getIcon, IconOptions } from '@nextgis/icons';

import { VueNgwMapbox } from '../../../nextgisweb_frontend/packages/vue-ngw-map/src/components/VueNgwMapbox';
// @ts-ignore
import config from '../../../config.json';
import { BdMainItem } from '../../api/ngw';
import { oralModule, OralFeature } from '../../store/modules/oral';
import { appModule } from '../../store/modules/app';

export interface NgwMapComponentOptions {
  mapOptions: NgwMapOptions;
}

@Component
export class OralMap extends Mixins(VueNgwMapbox) {
  layer!: VectorLayerAdapter;

  markers: { [name: string]: boolean } = {};
  selected!: VectorLayerAdapter;

  private loaded = false;

  get filtered() {
    return oralModule.filtered;
  }

  get detailItem() {
    return oralModule.detailItem;
  }

  get centerId() {
    return appModule.centerId;
  }

  mounted() {
    this.ngwMap.onLoad().then(() => {
      this._onLoad();
    });
  }

  @Watch('filtered')
  onFilteredChange(filtered: OralFeature[]) {
    if (this.loaded) {
      filtered = JSON.parse(JSON.stringify(filtered));
      this.addMarkers(filtered);
      this.zoomToFiltered();
    }
  }

  @Watch('detailItem')
  setSelected(item: BdMainItem) {
    const layer = this.layer;
    if (item && layer.select) {
      layer.select(({ feature }) => {
        if (feature && feature.properties) {
          return feature.properties.id === (item && item.id);
        }
        return false;
      });
    } else if (layer.unselect) {
      // unselect all
      layer.unselect();
    }
  }

  @Watch('centerId')
  zoomTo(id: number) {
    if (id && this.layer.getLayers) {
      const layers = this.layer && this.layer.getLayers();
      if (layers && layers.length) {
        const layer = layers.find(
          x =>
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

  addMarkers(features: OralFeature[]) {
    if (!this.layer) {
      const data: FeatureCollection = { type: 'FeatureCollection', features };
      return this.ngwMap
        .addGeoJsonLayer({
          data,
          type: 'icon',
          paint: feature => {
            return this.getHistoryIcon(feature, { size: 20 }, true);
          },
          selectedPaint: feature => {
            return this.getHistoryIcon(feature, { size: 40 });
          },
          selectable: true,
          unselectOnSecondClick: true
        })
        .then(layerId => {
          const l = this.ngwMap.getLayer(layerId) as VectorLayerAdapter;
          this.layer = l;
          this.ngwMap.showLayer(l);
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
    } else if (this.layer.filter) {
      this.layer.filter(({ feature }) => {
        const id = feature && feature.properties && feature.properties.id;
        return features.some(x => x.properties.id === id);
      });
    }

    return this.layer;
  }

  zoomToFiltered() {
    const layer = this.layer;
    if (layer && layer.getLayers) {
      const layers = layer.getLayers();
      const features = layers
        .filter(x => {
          return x.visible;
        })
        .map(x => x.feature);
      if (features.length) {
        const extent = geojsonExtent({
          type: 'FeatureCollection',
          features
        });
        this.ngwMap.fitBounds(extent, { maxZoom: 16 });
      }
    }
  }

  private async _onLoad() {
    await this.ngwMap.addNgwLayer({ resourceId: config.districtsLayer });
    const items = this.filtered;
    if (items && items.length) {
      const _items = JSON.parse(JSON.stringify(items));
      this.addMarkers(_items);
    }
    this.loaded = true;
  }

  private getHistoryIcon(
    feature: Feature,
    options?: IconOptions,
    forLegend = false
  ) {
    const featureStyles: Record<string, IconOptions> = {
      водоем: { color: '#0000ff', shape: 'marker' },
      ландшафт: { color: '#008000', shape: 'marker' },
      памятник: { color: '#ff0000', shape: 'marker' },
      строение: { color: '#ffa500', shape: 'marker' },
      улица: { color: '#ffff00', shape: 'marker' },
      зона: { color: '#bbbbbb', shape: 'marker' },
      'населенный пункт': { color: '#49423d', shape: 'marker' },
      район: { color: '#808080', shape: 'marker' },
      другой: { color: '#000000', shape: 'marker' },
      метро: { color: '#ffa500', shape: 'brill' },
      'метро-2': { color: '#ff0000', shape: 'brill' },
      'другие подземные объекты': { color: '#808080', shape: 'brill' }
    };

    const defaultStyle: IconOptions = { color: '#fff', shape: 'marker' };
    let style: IconOptions | undefined;
    let styleId: string | undefined;
    if (feature.properties && feature.properties.type) {
      const featureType: string = feature.properties.type;
      styleId = Object.keys(featureStyles).find(
        x => featureType.search(x) !== -1
      );
      if (styleId && featureStyles[styleId]) {
        style = featureStyles[styleId];
      }
    }
    const iconOpt: IconOptions = {
      ...defaultStyle,
      ...style,
      ...options
    };
    const icon = getIcon(iconOpt);
    if (style && styleId && forLegend) {
      oralModule.setLegend({ name: styleId, item: icon });
    }
    return icon;
  }
}
