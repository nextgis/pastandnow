import { WebMap, MapOptions } from '../../../nextgisweb_frontend/packages/webmap/src/webmap';
import { LeafletMapAdapter } from '../../../nextgisweb_frontend/packages/leaflet-map-adapter/src/leaflet-map-adapter';
import { QmsKit } from '../../../nextgisweb_frontend/packages/qms-kit/src/qms-kit';

import 'leaflet/dist/leaflet.css';

export interface NgwMapOptions {
  mapOptions: MapOptions;
}

export class NgwMap {

  webMap = new WebMap({
    mapAdapter: new LeafletMapAdapter(),
    starterKits: [new QmsKit()],
  });

  options: NgwMapOptions = { mapOptions: { target: 'map' } };

  createWebMap(options?: MapOptions) {
    const webMap = this.webMap;
    this.options.mapOptions = { ...this.options.mapOptions, ...options };
    webMap.create(options).then(() => {

      webMap.addBaseLayer('sputnik', 'QMS', {
        qmsid: 487
      }).then((layer) => {
        webMap.map.showLayer(layer.name);
      });

      // webMap.map.addControl('ZOOM', 'top-left');

    });
  }

}
