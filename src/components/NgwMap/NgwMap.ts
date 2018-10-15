import { WebMap, MapOptions } from '../../../nextgisweb_frontend/packages/webmap/src/webmap';
import { LeafletMapAdapter } from '../../../nextgisweb_frontend/packages/leaflet-map-adapter/src/leaflet-map-adapter';
import { QmsKit } from '../../../nextgisweb_frontend/packages/qms-kit/src/qms-kit';
import Vue from 'vue';
import Component from 'vue-class-component';
import { Projection, Point } from 'leaflet';

import 'leaflet/dist/leaflet.css';
import { BdMainItem } from '../../api/ngw';

export interface NgwMapOptions {
  mapOptions: MapOptions;
}

@Component({
  props: ['center', 'zoom']
})
export class NgwMap extends Vue {

  center: [number, number];
  zoom: number;

  webMap = new WebMap({
    mapAdapter: new LeafletMapAdapter(),
    starterKits: [new QmsKit()],
  });

  options: NgwMapOptions = { mapOptions: { target: 'map' } };

  markers: { [name: string]: boolean } = {};

  mounted() {
    const target = this.$el as HTMLElement;
    this.createWebMap({ target, center: this.center, zoom: this.zoom }).then(() => {
      const items = this.$store.state.bdMain.filtered;
      if (items && items.length) {
        this.addMarkers(items);
      }

      this.$store.watch((state) => state.bdMain.filtered, (_items) => {
        _items = JSON.parse(JSON.stringify(_items));
        this.addMarkers(_items);
      });
    });
  }

  addMarkers(items: BdMainItem[]) {
    const promises: Array<Promise<any>> = items.map((item) => {
      const id = String(item.properties.id);
      if (this.markers[id] === undefined) {
        this.markers[id] = false;
        const [x, y] = item.geometry.coordinates;
        const { lat, lng } = Projection.SphericalMercator.unproject(new Point(x, y));
        item.geometry.coordinates = [lng, lat];
        return this.webMap.map.addLayer('GEOJSON', { data: item, id });
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
              this.webMap.map.showLayer(m);
            }
          } else {
            if (this.markers[m]) {
              this.markers[m] = false;
              this.webMap.map.hideLayer(m);
            }
          }
        }
      }
    });
  }

  createWebMap(options?: MapOptions) {
    const webMap = this.webMap;
    this.options.mapOptions = { ...this.options.mapOptions, ...options };
    return webMap.create(options).then(() => {

      webMap.addBaseLayer('sputnik', 'QMS', {
        qmsid: 487
      }).then((layer) => {
        webMap.map.showLayer(layer.name);
      });

      // webMap.map.addControl('ZOOM', 'top-left');

    });
  }

}
