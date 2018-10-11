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

  constructor(public options: NgwMapOptions) {
    // ignore
  }

  createWebMap() {
    const webMap = this.webMap;
    webMap.create(this.options.mapOptions).then(() => {

      webMap.addBaseLayer('sputnik', 'QMS', {
        qmsid: 487
      }).then((layer) => {
        webMap.map.showLayer(layer.name);
      });

      // webMap.map.addControl('ZOOM', 'top-left');

    });
  }

}
