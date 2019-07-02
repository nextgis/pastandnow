import { MapOptions, VectorLayerAdapter } from '@nextgis/webmap';
import MapAdapter from '@nextgis/mapboxgl-map-adapter';
import 'mapbox-gl/dist/mapbox-gl.css';
// import MapAdapter from '@nextgis/leaflet-map-adapter';
// import 'leaflet/dist/leaflet.css';
import { Vue, Component, Prop } from 'vue-property-decorator';
// @ts-ignore
import geojsonExtent from '@mapbox/geojson-extent';
import config from '../../../config.json';
import NgwMap, { NgwMapOptions } from '@nextgis/ngw-map';
import { url } from '../../api/ngw';


import { BdMainItem } from '../../api/ngw';
import { getIcon, IconOptions } from '@nextgis/icons';
import { Feature, FeatureCollection, Point } from 'geojson';

export interface NgwMapComponentOptions {
  mapOptions: NgwMapOptions;
}

@Component
export class NgwMapComponent extends Vue {

  @Prop() center: [number, number];
  @Prop() zoom: number;

  ngwMap: NgwMap;

  ready: boolean = false;

  mapObject: any;
  layer: VectorLayerAdapter;

  options: NgwMapComponentOptions = {
    mapOptions: {
      target: 'map',
      controlsOptions: {
        ZOOM: { position: 'top-right' },
        ATTRIBUTION: { position: 'bottom-right' },
      }
    }
  };

  markers: { [name: string]: boolean } = {};
  selected: VectorLayerAdapter;

  mounted() {
    const target = this.$el as HTMLElement;
    this.createWebMap({ target, center: this.center, zoom: this.zoom }).then(() => {
      this.ready = true;
      const items = this.$store.state.bdMain.filtered;
      if (items && items.length) {
        const _items = JSON.parse(JSON.stringify(items));
        this.addMarkers(_items);
      }

      this.$store.watch((state) => state.bdMain.filtered, (_items) => {
        _items = JSON.parse(JSON.stringify(_items));
        this.addMarkers(_items);
        this.zoomToFiltered();
      });

      this.$store.watch((state) => state.bdMain.detailItem, (detail: BdMainItem) => {
        this.setSelected(detail);
      });

      this.$store.watch((state) => state.app.center, (id: number) => {
        this.zoomTo(id);
      });
    });
  }

  createWebMap(options?: MapOptions) {

    const mapOptions = { ...JSON.parse(JSON.stringify(this.options.mapOptions)), ...options };

    this.ngwMap = new NgwMap(new MapAdapter(), {
      baseUrl: url,
      qmsId: config.qmsId, // 487,
      // to remove observal
      ...mapOptions
    });
    this.options.mapOptions = mapOptions;
    return this.ngwMap.onLoad().then((x) => {
      this.mapObject = this.ngwMap.mapAdapter.map;
      this.ngwMap.addNgwLayer({ resourceId: config.districtsLayer });
    });
  }

  findFirsVueParent(firstVueParent) {
    let found = false;
    while (!found) {
      if (firstVueParent.mapObject === undefined) {
        firstVueParent = firstVueParent.$parent;
      } else {
        found = true;
      }
    }
    return firstVueParent;
  }

  addMarkers(features: BdMainItem[]) {
    const collection: FeatureCollection = {
      type: 'FeatureCollection',
      features
    };
    const data = NgwMap.toWgs84(collection);
    if (!this.layer) {
      return this.ngwMap.addGeoJsonLayer({
        data,
        paint: (feature) => {
          return this.getHistoryIcon(feature, { size: 20 });
        },
        selectedPaint: (feature) => {
          return this.getHistoryIcon(feature, { size: 40 });
        },
        selectable: true,
        unselectOnSecondClick: true
      }).then((layerId) => {
        const l = this.ngwMap.getLayer(layerId) as VectorLayerAdapter;
        this.layer = l;
        this.ngwMap.showLayer(l);
        this.ngwMap.emitter.on('layer:click', ({ layer, feature, selected }) => {
          if (layer.id === l.id) {
            this.$store.dispatch('bdMain/setDetail', selected ? Number(feature.properties.id) : null);
          }
        });
      });
    } else {
      this.layer.filter(({ feature }) => {
        const id = feature.properties.id;
        return features.some((x) => x.properties.id === id);
      });
    }

    return this.layer;
  }

  zoomTo(id: number) {
    if (id) {
      const layers = this.layer && this.layer.getLayers();
      if (layers && layers.length) {
        const layer = layers.find((x) => x.feature.properties.id === id);
        const feature = layer && layer.feature as Feature<Point>;
        const lngLat = feature && feature.geometry.coordinates as [number, number];
        if (lngLat) {
          this.ngwMap.setView(lngLat, 14);
          // reset zoomTo storage value
          this.$store.dispatch('app/zoomTo', null);
        }
      }
    }
  }

  setSelected(item: BdMainItem) {
    if (item) {
      this.layer.select(({ feature }) => feature.properties.id === (item && item.id));
    } else {
      // unselect all
      this.layer.unselect();
    }
  }

  zoomToFiltered() {
    if (this.layer) {
      const features = this.layer.getLayers().filter((x) => {
        return x.visible;
      }).map((x) => x.feature);
      if (features.length) {
        const extent = geojsonExtent({
          type: 'FeatureCollection',
          features
        });
        this.ngwMap.fitBounds(extent, { maxZoom: 16 });
      }
    }
  }

  private getHistoryIcon(feature: Feature, options?: IconOptions) {

    const featureStyles = {
      'водоем': { color: '#0000ff', shape: 'marker' },
      'ландшафт': { color: '#008000', shape: 'marker' },
      'памятник': { color: '#ff0000', shape: 'marker' },
      'строение': { color: '#ffa500', shape: 'marker' },
      'улица': { color: '#ffff00', shape: 'marker' },
      'зона': { color: '#bbbbbb', shape: 'marker' },
      'населенный пункт': { color: '#49423d', shape: 'marker' },
      'район': { color: '#808080', shape: 'marker' },
      'другой': { color: '#000000', shape: 'marker' },
      'метро': { color: '#ffa500', shape: 'brill' },
      'метро-2': { color: '#ff0000', shape: 'brill' },
      'другие подземные объекты': { color: '#808080', shape: 'brill' },
    };

    let style: IconOptions = { color: '#fff', shape: 'marker' };
    if (feature.properties.type) {
      const featureType: string = feature.properties.type;
      const styleId = Object.keys(featureStyles).find((x) => featureType.search(x) !== -1);
      if (featureStyles[styleId]) {
        style = featureStyles[styleId];
      }
    }

    return getIcon({
      ...style, ...options
    });
  }
}
