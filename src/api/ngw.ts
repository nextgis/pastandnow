import { Point } from 'geojson';
import NgwConnector from '@nextgis/ngw-connector';
import CancelablePromise from '@nextgis/cancelable-promise';
import { getNgwLayerFeature, getNgwLayerFeatures } from '@nextgis/ngw-kit';
import config from '../../config.json';
import { OralFeatureCollection, OralFeature } from '../interfaces';

export interface LayerMetaItem {
  text: string;
  value: string;
  list?: boolean;
  type?: 'NarratorLink' | 'Special' | 'Story';
  detail?: boolean;
  search?: boolean;
}

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
  narrativ_t: string;
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

export default {
  async getLayerGeoJson(): CancelablePromise<OralFeatureCollection> {
    const meta = await this.getLayerMeta();
    const fields = meta
      .filter((x) => x.search || x.list || x.type === 'Special')
      .map((x) => x.value);
    return getNgwLayerFeatures<Point, BdMainItemProperties>({
      connector,
      resourceId: config.ngwMarkerLayerId,
      // limit: 100,
      fields,
    }).then((data) => {
      data.features.forEach((x, i) => {
        if (x.id) {
          x.properties.id = Number(x.id);
        }
      });
      return data;
    });
  },

  async getNgwLayerFeature(featureId: number): CancelablePromise<OralFeature> {
    return getNgwLayerFeature({
      resourceId: config.ngwMarkerLayerId,
      featureId,
      connector,
    });
  },

  async getPhotos(): CancelablePromise<BdPhotoProperties[]> {
    return getNgwLayerFeatures<Point, BdPhotoProperties>({
      connector,
      resourceId: config.layerWithPhotos,
    }).then((data) => {
      return data.features.map((x) => {
        if (x.id) {
          x.properties.id = Number(x.id);
        }
        return x.properties;
      });
    });
  },

  getLayerMeta(): Promise<LayerMetaItem[]> {
    return CancelablePromise.resolve([
      { text: 'Идентификатор', value: 'id1', detail: false, list: true },
      // { text: 'долгота', value: 'lat', noHide: true },
      // { text: 'широта', value: 'lon', noHide: true },
      { text: 'Адрес', value: 'addr', detail: true, search: true },
      { text: 'Город', value: 'city', detail: false, list: true },
      {
        text: 'Название объекта',
        value: 'name',
        detail: false,
        list: true,
        search: true,
      },
      {
        text: 'Статус объекта',
        value: 'status',
        detail: false,
        list: true,
        search: true,
      },
      { text: 'Район', value: 'rayon', list: true },
      {
        text: 'Неофициальное название',
        value: 'unoff',
        search: true,
      },
      { text: 'Тип', value: 'type', detail: false, list: true, search: true },
      { text: 'Описание', value: 'description', search: true },
      {
        text: 'Истории о прошлом',
        value: 'narrativ_l',
        type: 'Story',
        list: true,
        search: true,
      },
      {
        text: 'Семейные истории',
        value: 'narrativ_b',
        type: 'Story',
        list: true,
        search: true,
      },
      {
        text: 'Практики горожан',
        value: 'narrativ_p',
        type: 'Story',
        list: true,
        search: true,
      },
      {
        text: 'Типы сюжетов',
        value: 'narrativ_t',
        type: 'Story',
        detail: false,
        search: true,
      },
      {
        text: 'Характеристика места',
        value: 'descript2',
        type: 'Story',
        list: true,
        search: true,
      },
      { text: 'Рассказчик', value: 'narrator', type: 'NarratorLink' },
      { text: 'Визуальные материалы', value: 'visual' },
      { text: 'Дворы', value: 'mos1', detail: false, type: 'Special' },
      { text: 'Религия', value: 'mos2', detail: false, type: 'Special' },
      { text: 'Бездомные', value: 'mos3', detail: false, type: 'Special' },
      { text: 'Подземелья', value: 'mos4', detail: false, type: 'Special' },
      { text: 'Субкультуры', value: 'mos5', detail: false, type: 'Special' },
      { text: 'Легенды', value: 'mos6', detail: false, type: 'Special' },
      // { text: 'Памятники', value: 'mos7', type: 'Special' },
      // { text: 'Последний адрес', value: 'mos8', type: 'Special' },
    ]);
  },
};
