import NgwConnector from '@nextgis/ngw-connector';
import { FeatureCollection, Point, Feature } from 'geojson';
// @ts-ignore
import config from '../../config.json';

const connector = new NgwConnector({ baseUrl: config.baseUrl });

export interface BdMainItemProperties {

  id: number;

  status: string;
  narrator: string;
  nar_codes: string;
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

export type BdMainItem = Feature<Point, BdMainItemProperties>;

export default {
  getLayerGeoJson(cb) {
    connector.request('feature_layer.geojson', {
      id: 10
    }).then((data: FeatureCollection<Point, BdMainItemProperties>) => {
      data.features.forEach((x, i) => {
        x.properties.id = Number(x.id || i);
      });
      cb(data.features);
    });
  },

  getLayerMeta(cb) {
    cb([
      { text: 'Адрес', value: 'addr' },
      { text: 'долгота', value: 'lat' },
      { text: 'широта', value: 'lon' },
      { text: 'Название объекта', value: 'name' },
      { text: 'Тип объекта', value: 'type' },
      { text: 'Статус объекта', value: 'status' },
      { text: 'Район', value: 'rayon' },
      { text: 'Неофициальное название', value: 'unoff' },
      { text: 'ОПИСАНИЕ', value: 'description' },
      { text: 'Истории о прошлом', value: 'narrativ_l' },
      { text: 'Семейные истории', value: 'narrativ_b' },
      { text: 'Практики горожан', value: 'narrativ_p' },
      { text: 'Характеристика места', value: 'descript2' },
      { text: 'Рассказчик', value: 'narrator', type: 'NarratorLink' },
      { text: 'Визуальные материалы', value: 'visual' },
      { text: 'Москва дворовая', value: 'mos1' },
      { text: 'Москва церковная', value: 'mos2' },
      { text: 'Москва бездомная', value: 'mos3' },
      { text: 'Москва подземная', value: 'mos4' },
      { text: 'Москва субкультурная', value: 'mos5' },
      { text: 'Москва легендарная', value: 'mos6' }
    ]);
  }
};
