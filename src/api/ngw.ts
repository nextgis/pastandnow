import { Point, Feature } from 'geojson';
import NgwConnector from '@nextgis/ngw-connector';
import NgwKit from '@nextgis/ngw-kit';
// @ts-ignore
import config from '../../config.json';

export const url = config.baseUrl.replace(
  /^(https?|ftp):\/\//,
  (location.protocol === 'https:' ? 'https' : 'http') + '://'
);

export const connector = new NgwConnector({ baseUrl: url });

export interface BdMainItemProperties {
  id: number;

  id1: number;
  city: string;
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

export const fieldsAvailable: Record<string, boolean> = {
  addr: true,
  city: true,
  descript2: true,
  description: true,
  geo: true,
  id1: true,
  lat: true,
  lon: true,
  mos1: true,
  mos2: true,
  mos3: true,
  mos4: true,
  mos5: true,
  mos6: true,
  name: true,
  nar_codes: true,
  narrativ_b: true,
  narrativ_l: true,
  narrativ_p: true,
  narrativ_t: true,
  narrator: true,
  rayon: true,
  status: true,
  type: true,
  unoff: true,
  visual: true
};

// const fields: string[] = [];
// for (const f in fieldsAvailable) {
//   if (fieldsAvailable[f]) {
//     fields.push(f);
//   }
// }

export default {
  async getLayerGeoJson() {
    const meta = await this.getLayerMeta();
    const fields = meta.map(x => x.value);
    return NgwKit.utils
      .getNgwLayerFeatures<Point, BdMainItemProperties>({
        connector,
        resourceId: config.ngwMarkerLayerId,
        // limit: 100,
        // limit: 3000,
        fields
      })
      .then(data => {
        data.features.forEach((x, i) => {
          if (x.id) {
            x.properties.id = Number(x.id);
          }
        });
        return data;
      });
  },

  async getPhotos() {
    return NgwKit.utils
      .getNgwLayerFeatures<Point, BdPhotoProperties>({
        connector,
        resourceId: config.layerWithPhotos
      })
      .then(data => {
        return data.features.map(x => {
          if (x.id) {
            x.properties.id = Number(x.id);
          }
          return x.properties;
        });
      });
  },

  getLayerMeta() {
    return Promise.resolve([
      { text: 'Идентификатор', value: 'id1', noHide: false },
      // { text: 'долгота', value: 'lat', noHide: true },
      // { text: 'широта', value: 'lon', noHide: true },
      { text: 'Адрес', value: 'addr', noHide: true },
      { text: 'Город', value: 'city', noHide: false },
      { text: 'Название объекта', value: 'name', noHide: true },
      // { text: 'Тип объекта', value: 'type', noHide: true },
      { text: 'Статус объекта', value: 'status', noHide: true },
      { text: 'Район', value: 'rayon', noHide: true },
      { text: 'Неофициальное название', value: 'unoff', noHide: true },
      { text: 'Тип', value: 'type' },
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
