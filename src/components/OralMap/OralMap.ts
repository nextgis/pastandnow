import { Component, Mixins, Watch } from 'vue-property-decorator';
import { Map } from 'mapbox-gl';
import { Feature, Point, FeatureCollection } from 'geojson';
import bbox from '@turf/bbox';

import { VectorLayerAdapter } from '@nextgis/webmap';
import { CirclePaint } from '@nextgis/paint';
import { NgwMap } from '@nextgis/ngw-map';
// @ts-ignore
import VueNgwMapbox from '@nextgis/vue-ngw-mapbox';

import config from '../../../config.json';
import { oralModule } from '../../store/modules/oral';
import { appModule } from '../../store/modules/app';
import { shadeColor } from '../../utils/shadeColor';
import { OralFeature } from '../../interfaces';

export const featureStyles: Record<string, CirclePaint> = {
  водоем: { color: '#4163aa', strokeColor: '' },
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
  'другие подземные объекты': { color: '#8807ff' },
};
export const featureStyleKeys = Object.keys(featureStyles);

// Shade stroke color
featureStyleKeys.forEach((x) => {
  const style = featureStyles[x];
  if (style && typeof style.color === 'string' && !style.strokeColor) {
    style.strokeColor = shadeColor(style.color, -30);
  }
});

export function getHistoryPaint(
  properties?: Record<string, any> | null,
  options?: CirclePaint,
  forLegend = false
): CirclePaint {
  const defaultStyle: CirclePaint = {
    color: '#363636',
    fillOpacity: 0.9,
    // weight: 2,
    radius: 3,
    stroke: true,
  };
  let style: CirclePaint | undefined;
  let styleId: string | undefined;
  if (properties && properties.type) {
    const featureType: string = properties.type;
    styleId = featureStyleKeys.find((x) => featureType.search(x) !== -1);
    if (styleId && featureStyles[styleId]) {
      style = featureStyles[styleId];
    }
  }
  const paint: CirclePaint = {
    ...defaultStyle,
    ...style,
    ...options,
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

  ngwMap!: NgwMap<Map>;

  markers: { [name: string]: boolean } = {};
  selected!: VectorLayerAdapter;

  private loaded = false;

  get filtered(): OralFeature[] {
    return oralModule.filtered;
  }

  get detailItem(): false | OralFeature {
    return oralModule.detailItem;
  }

  get centerId(): number | null {
    return appModule.centerId;
  }

  @Watch('filtered')
  onFilteredChange(filtered: OralFeature[]): void {
    if (this.loaded) {
      const forMap: Feature[] = [];
      filtered.forEach((x) => {
        forMap.push({
          type: x.type,
          id: x.id,
          geometry: x.geometry,
          properties: { id: x.id, type: x.type },
        });
      });
      this.addMarkers(forMap);
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

  addMarkers(features: Feature[]): void {
    if (!this.layer) {
      const data: FeatureCollection = { type: 'FeatureCollection', features };
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

    // return this.layer;
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
