import { Component, Mixins, Watch } from 'vue-property-decorator';

import { Feature, Point, FeatureCollection } from 'geojson';
// @ts-ignore
import geojsonExtent from '@mapbox/geojson-extent';

import { VectorLayerAdapter } from '@nextgis/webmap';
import { CirclePaint } from '@nextgis/paint';
import { VueNgwMapbox } from '@nextgis/vue-ngw-mapbox';

import config from '../../../config.json';
import { BdMainItem } from '../../api/ngw';
import { oralModule, OralFeature } from '../../store/modules/oral';
import { appModule } from '../../store/modules/app';

export const featureStyles: Record<string, CirclePaint> = {
  водоем: { color: '#4163aa' },
  ландшафт: { color: '#93bf20' },
  памятник: { color: '#e42a1b' },
  строение: { color: '#289de4' },
  территория: { color: '#e75dbd' },
  улица: { color: '#fbd507' },
  зона: { color: '#bbbbbb' },
  'населенный пункт': { color: '#aaaaaa' },
  район: { color: '#b1ae44' },
  другой: { color: '#363636' },
  метро: { color: '#8807ff' },
  'метро-2': { color: '#8807ff' },
  'другие подземные объекты': { color: '#8807ff' }
};
export const featureStyleKeys = Object.keys(featureStyles);

export function getHistoryPaint(
  properties?: Record<string, any> | null,
  options?: CirclePaint,
  forLegend = false
) {
  const defaultStyle: CirclePaint = {
    color: '#363636',
    fillOpacity: 0.8,
    // weight: 2,
    stroke: true
  };
  let style: CirclePaint | undefined;
  let styleId: string | undefined;
  if (properties && properties.type) {
    const featureType: string = properties.type;
    styleId = featureStyleKeys.find(x => featureType.search(x) !== -1);
    if (styleId && featureStyles[styleId]) {
      style = featureStyles[styleId];
    }
  }
  const paint: CirclePaint = {
    ...defaultStyle,
    ...style,
    ...options
  };
  if (style && styleId && forLegend) {
    oralModule.setLegend({ name: styleId, item: paint });
  }
  return paint;
}

function getHistoryIcon(
  feature: Feature,
  options?: CirclePaint,
  forLegend = false
) {
  const paint = getHistoryPaint(feature.properties, options, forLegend);
  return paint;
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
      layer.select([['$id', 'eq', item.id]]);
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
          type: 'circle',
          paint: feature => {
            return getHistoryIcon(feature, { radius: 6 }, true);
          },
          selectedPaint: feature => {
            return getHistoryIcon(feature, { radius: 9 });
          },
          selectable: true,
          unselectOnSecondClick: true,
          visibility: true
        })
        .then(layerId => {
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
      this.layer.propertiesFilter([['$id', 'in', features.map(x => x.id)]]);
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
}
