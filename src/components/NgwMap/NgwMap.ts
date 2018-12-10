import WebMap, { MapOptions, LayerMem } from '@nextgis/webmap';
import LeafletMapAdapter from '@nextgis/leaflet-map-adapter';
import { Vue, Component, Prop } from 'vue-property-decorator';
// @ts-ignore
import config from '../../../config.json';
import { Projection, Point } from 'leaflet';
import Ngw from '@nextgis/ngw-map';

import 'leaflet/dist/leaflet.css';

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

  webMap: WebMap;
  ngw: Ngw;

  ready: boolean = false;

  mapObject;
  layer;

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

    this.options.mapOptions = { ...this.options.mapOptions, ...options };

    this.ngw = new Ngw(new LeafletMapAdapter(), {
      baseUrl: config.baseUrl,
      qmsId: 487,
      ...this.options.mapOptions
    });
    this.webMap = this.ngw.webMap;
    this.mapObject = this.webMap.mapAdapter.map;
    this.ngw.addNgwLayer({ id: 9 });
    return this.webMap.onMapLoad();

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
          return this.getHistoryIcon(feature, { size: 15 });
        },
        selectedPaint: (feature) => {
          return this.getHistoryIcon(feature, { size: 30 });
        },
        selectable: true
      }).then((l) => {
        this.layer = l;
        this.webMap.showLayer(l.name);
        this.webMap.emitter.on('layer:click', ({ adapter, feature }) => {
          if (adapter.name === l.name) {
            console.log(feature.properties.id);
            this.$store.dispatch('bdMain/setDetail', Number(feature.properties.id));
          }
        });
      });
    } else {
      this.layer.filter(({ feature }) => {
        const id = feature.properties.id;
        return items.find((x) => x.properties.id === id);
      });
    }

    return this.layer;
  }

  zoomTo(id: number) {
    const layerMem = this.webMap.getLayer(String(id));
    const layer = layerMem && layerMem.layer;
    if (layer) {
      const { lat, lng } = layer.getBounds().getCenter();
      this.webMap.setCenter([lng, lat]);
    }
  }

  setSelected(item: BdMainItem) {

    // if (item) {

    //   const layerMem = this.webMap.getLayer(String(item.id));
    //   const layerToSelect = layerMem;
    //   if (layerToSelect && layerToSelect !== this.selected) {
    //     if (this.selected) {
    //       this._unselectMarker(this.selected);
    //     }
    //     this.selected = layerToSelect;
    //     this._selectMarker(layerMem);
    //   }
    // } else if (this.selected) {
    //   this._unselectMarker(this.selected);
    // }
  }

  private _selectMarker(layer: LayerMem) {
    this.webMap.selectLayer(layer.id);
  }

  private _unselectMarker(layer: LayerMem) {
    this.webMap.unSelectLayer(layer.id);
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
    const style = featureStyles[styleId] || { color: '#fff', size: 10 };

    return getIcon({
      ...options, ...style
    });
  }
}
