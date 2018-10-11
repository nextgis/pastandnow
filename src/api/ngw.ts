import { NgwConnector } from '../../nextgisweb_frontend/packages/ngw-connector/src/ngw-connector';
import { FeatureCollection, Point } from 'geojson';

const connector = new NgwConnector({ baseUrl: 'http://pastandnow.nextgis.com' });

/**
 * Mocking client-server processing
 */
export interface BdMainItemProperties {

  id: number;

  status: string;
  narrator: string;
  description?: string;
  mos2?: string;
  mos5?: string;
  mos4?: string;
  visual?: string;
  mos6?: string;
  mos1?: string;
  unoff: string;
  mos3?: string;
  descript2?: string;
  lat: number;
  rayon: string;
  geo?: string;
  name?: string;
  narrativ_b?: string;
  addr?: string;
  narrativ_l: string;
  lon: number;
  narrativ_p?: string;
  type: string;
}

export default {
  getLayerGeoJson(cb) {
    connector.request('feature_layer.geojson', {
      id: 4
    }).then((data: FeatureCollection<Point, BdMainItemProperties>) => {
      data.features.forEach((x, i) => {
        x.properties.id = i;
      });
      cb(data.features);
    });
  }
};
