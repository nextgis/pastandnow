import WebMap, { MapOptions, LayerMem } from '@nextgis/webmap';
import LeafletMapAdapter from '@nextgis/leaflet-map-adapter';


import { Vue, Component, Prop } from 'vue-property-decorator';
// @ts-ignore
import config from '../../../config.json';
import { Projection, Point, Marker, Icon, GeoJSON } from 'leaflet';
import Ngw from '@nextgis/ngw-map';

import 'leaflet/dist/leaflet.css';

import { BdMainItem } from '../../api/ngw';
import { getNgwIcon, NgwIconOptions } from './icons';
import { Feature } from 'geojson';

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
    const promises: Array<Promise<any>> = items.map((item) => {
      const id = String(item.properties.id);
      if (this.markers[id] === undefined) {
        this.markers[id] = false;
        const [x, y] = item.geometry.coordinates;
        const { lat, lng } = Projection.SphericalMercator.unproject(new Point(x, y));
        item.geometry.coordinates = [lng, lat];
        return this.webMap.addLayer('GEOJSON', {
          data: item,
          id,
          paint: (feature) => {
            return this.getHistoryIcon(feature);
          },
          selectedPaint: (feature) => {
            return this.getHistoryIcon(feature, { size: 20, strokeColor: 'orange' });
          }
        }).then((l) => {
          const layerMem = this.webMap.getLayer(l.name);
          const layer: GeoJSON = layerMem.layer;
          layer.on('click', () => {
            this.$store.dispatch('bdMain/setDetail', Number(id));
          });
          this._unselectMarker(layerMem);
        });
      } else {
        return Promise.resolve();
      }

    });

    const ids: string[] = items.map((x) => String(x.properties.id));

    Promise.all(promises).then(() => {
      for (const m in this.markers) {
        if (this.markers.hasOwnProperty(m)) {

          if (ids.indexOf(m) !== -1) {
            if (!this.markers[m]) {
              this.markers[m] = true;
              this.webMap.showLayer(m);
            }
          } else {
            if (this.markers[m]) {
              this.markers[m] = false;
              this.webMap.hideLayer(m);
            }
          }
        }
      }
    });
  }

  zoomTo(id: number) {
    const layerMem = this.webMap.getLayer(String(id));
    const layer = layerMem && layerMem.layer;
    if (layer) {
      const [lat, lng] = layer.getBounds().getCenter();
      this.webMap.setCenter([lng, lat]);
    }
  }

  setSelected(item: BdMainItem) {

    if (item) {

      const layerMem = this.webMap.getLayer(String(item.id));
      const layerToSelect = layerMem;
      if (layerToSelect && layerToSelect !== this.selected) {
        if (this.selected) {
          this._unselectMarker(this.selected);
        }
        this.selected = layerToSelect;
        this._selectMarker(layerMem);
      }
    } else if (this.selected) {
      this._unselectMarker(this.selected);
    }
  }

  private _selectMarker(layer: LayerMem) {
    this.webMap.selectLayer(layer.id);
  }

  private _unselectMarker(layer: LayerMem) {
    this.webMap.unSelectLayer(layer.id);
  }

  private getHistoryIcon(feature: Feature, options?: NgwIconOptions) {

    const colors = {
      водоем: 'blue',
      памятник: 'red',
      строение: 'orange',
      улица: 'yellow',
      район: 'gray',
      другое: 'black'
    };

    const shapes: any = ['circle', 'brill', 'rect'];

    return getNgwIcon({
      ...options,
      color: colors[feature.properties.type] || 'black',
      shape: shapes[Math.floor(Math.random() * shapes.length)]
    });
  }
}
