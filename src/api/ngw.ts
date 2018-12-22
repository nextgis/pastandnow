import NgwConnector from '@nextgis/ngw-connector';
import { FeatureCollection, Point, Feature } from 'geojson';
// @ts-ignore
import config from '../../config.json';

const protomatch = /^(https?|ftp):\/\//; // NB: not '.*'

export const url = (location.protocol === 'https:' ? 'https' : 'http') + '://' +
  config.baseUrl.replace(protomatch, '');

const connector = new NgwConnector({ baseUrl: url });

export interface BdMainItemProperties {

  id: number;

  id1: number;

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

export interface BdPhotoProperties {
  id: number;

  link_big: string;
  link_small: string;
  id_obj: number;
  descript: string;
  link: string;
  details: string;
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

  getPhotos(cb) {
    connector.request('feature_layer.geojson', {
      id: 12
    }).then((data: FeatureCollection<Point, BdPhotoProperties>) => {
      cb(data.features.map((x) => {
        x.properties.id = Number(x.id);
        return x.properties;
      }));
    });
  },

  getLayerMeta(cb) {
    cb([
      // { text: 'Идентификатор', value: 'id1', noHide: true },
      // { text: 'долгота', value: 'lat', noHide: true },
      // { text: 'широта', value: 'lon', noHide: true },
      { text: 'Адрес', value: 'addr', noHide: true },
      { text: 'Название объекта', value: 'name', noHide: true },
      // { text: 'Тип объекта', value: 'type', noHide: true },
      { text: 'Статус объекта', value: 'status', noHide: true },
      { text: 'Район', value: 'rayon', noHide: true },
      { text: 'Неофициальное название', value: 'unoff', noHide: true },
      { text: 'ОПИСАНИЕ', value: 'description', noHide: true },
      { text: 'Истории о прошлом', value: 'narrativ_l', type: 'Story' },
      { text: 'Семейные истории', value: 'narrativ_b', type: 'Story' },
      { text: 'Практики горожан', value: 'narrativ_p', type: 'Story' },
      { text: 'Характеристика места', value: 'descript2', type: 'Story' },
      { text: 'Рассказчик', value: 'narrator', type: 'NarratorLink' },
      { text: 'Визуальные материалы', value: 'visual' },
      { text: 'Москва дворовая', value: 'mos1', type: 'Mos' },
      { text: 'Москва церковная', value: 'mos2', type: 'Mos' },
      { text: 'Москва бездомная', value: 'mos3', type: 'Mos' },
      { text: 'Москва подземная', value: 'mos4', type: 'Mos' },
      { text: 'Москва субкультурная', value: 'mos5', type: 'Mos' },
      { text: 'Москва легендарная', value: 'mos6', type: 'Mos' }
    ]);
  }
};
