import WebMap, { MapOptions, LayerMem, LayerAdapter } from '@nextgis/webmap';
// import MapAdapter from '@nextgis/leaflet-map-adapter';
import MapAdapter from '@nextgis/mapboxgl-map-adapter';
import { Vue, Component, Prop } from 'vue-property-decorator';
// @ts-ignore
import config from '../../../config.json';
import { Projection, Point, FeatureGroup, Map } from 'leaflet';
import Ngw from '@nextgis/ngw-map';

import 'mapbox-gl/dist/mapbox-gl.css';
// import 'leaflet/dist/leaflet.css';

import { BdMainItem } from '../../api/ngw';
import { getIcon, IconOptions } from '@nextgis/icons';
import { Feature, FeatureCollection } from 'geojson';

export interface NgwMapOptions {
  mapOptions: MapOptions;
}

@Component
export class NgwMap extends Vue {

  @Prop() center: [number, number];
  @Prop() zoom: number;

  webMap: WebMap<Map>;
  ngw: Ngw;

  ready: boolean = false;

  mapObject;
  layer: LayerAdapter;

  options: NgwMapOptions = {
    mapOptions: {
      target: 'map',
      controlsOptions: {
        ZOOM: { position: 'top-right' },
        ATTRIBUTION: { position: 'bottom-right' },
      }
    }
  };

  markers: { [name: string]: boolean } = {};
  selected: LayerMem;

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
        // this.webMap.mapAdapter.map.invalidateSize();
        this.setSelected(detail);
      });

      this.$store.watch((state) => state.app.center, (id: number) => {
        this.zoomTo(id);
      });
    });
  }

  createWebMap(options?: MapOptions) {

    this.options.mapOptions = { ...this.options.mapOptions, ...options };

    this.ngw = new Ngw(new MapAdapter(), {
      baseUrl: config.baseUrl,
      qmsId: 487,
      ...this.options.mapOptions
    });
    return new Promise((resolve) => {
      this.ngw.emitter.once('map:created', () => {
        this.webMap = this.ngw.webMap;
        this.mapObject = this.webMap.mapAdapter.map;
        this.ngw.addNgwLayer({ id: 9 });
        this.webMap.onMapLoad(resolve);
      });
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

  addMarkers(items: BdMainItem[]) {

    const features = items.map((item) => {
      const [x, y] = item.geometry.coordinates;
      const { lat, lng } = Projection.SphericalMercator.unproject(new Point(x, y));
      item.geometry.coordinates = [lng, lat];
      return item;
    });
    const collection: FeatureCollection = {
      type: 'FeatureCollection',
      features
    };
    if (!this.layer) {
      return this.webMap.addLayer('GEOJSON', {
        data: collection,
        paint: (feature) => {
          return this.getHistoryIcon(feature, { size: 20 });
        },
        selectedPaint: (feature) => {
          return this.getHistoryIcon(feature, { size: 40 });
        },
        selectable: true,
        unselectOnSecondClick: true
      }).then((l) => {
        this.layer = l;
        this.webMap.showLayer(l.name);
        this.webMap.emitter.on('layer:click', ({ adapter, feature, selected }) => {
          if (adapter.name === l.name) {
            this.$store.dispatch('bdMain/setDetail', selected ? Number(feature.properties.id) : null);
          }
        });
      });
    } else {
      this.layer.filter(({ feature }) => {
        const id = feature.properties.id;
        return items.some((x) => x.properties.id === id);
      });
    }

    return this.layer;
  }

  zoomTo(id: number) {
    if (id) {
      const layers = this.layer && this.layer.getLayers();
      if (layers && layers.length) {
        const layer = layers.find((x) => x.feature.properties.id === id);
        const l = layer && layer.layer;
        if (l) {
          // const { lat, lng } = l.getBounds ? l.getBounds().getCenter() : l.getLatLng();
          // this.webMap.setCenter([lng, lat]);

          const latLng = l.getBounds ? l.getBounds().getCenter() : l.getLatLng();
          this.webMap.mapAdapter.map.setView(latLng, 14);

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
    // if (this.layer) {
    //   const layers = this.layer.getLayers().filter((x) => {
    //     return x.layer._map;
    //   }).map((x) => x.layer);
    //   if (layers.length) {
    //     const featureGroup = new FeatureGroup(layers);
    //     this.webMap.mapAdapter.map.fitBounds(featureGroup.getBounds());
    //   }
    // }
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

    // const shapes: any = ['circle', 'brill', 'rect', 'marker', 'cross', 'star',
    //   'asterisk', 'triangle', 'plus', 'minus'];
    const featureType: string = feature.properties.type;
    const styleId = Object.keys(featureStyles).find((x) => featureType.search(x) !== -1);
    const style = featureStyles[styleId] || { color: '#fff', shape: 'cross' };

    return getIcon({
      ...style, ...options
    });
  }
}
