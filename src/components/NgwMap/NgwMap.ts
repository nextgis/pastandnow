import { WebMap, MapOptions } from '../../../nextgisweb_frontend/packages/webmap/src/webmap';
import { LeafletMapAdapter } from '../../../nextgisweb_frontend/packages/leaflet-map-adapter/src/leaflet-map-adapter';
import { QmsKit } from '../../../nextgisweb_frontend/packages/qms-kit/src/qms-kit';
import Vue from 'vue';
import Component from 'vue-class-component';
import { GeoJSON, Projection, Point, geoJSON, circleMarker } from 'leaflet';

import 'leaflet/dist/leaflet.css';

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

  mounted() {
    const target = this.$el as HTMLElement;
    this.createWebMap({ target, center: this.center, zoom: this.zoom }).then(() => {
      const map = this.webMap.map.map;
      this.$store.watch((state) => state.bdMain.items, (items) => {
        items = JSON.parse(JSON.stringify(items));
        items.forEach((item) => {
          const [x, y] = item.geometry.coordinates;
          const { lat, lng } = Projection.SphericalMercator.unproject(new Point(x, y));
          item.geometry.coordinates = [lng, lat];
          const layer = geoJSON(item);
          layer.addTo(map);
        });
      });
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
