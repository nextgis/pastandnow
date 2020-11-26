import { Point, Feature } from 'geojson';
import NgwConnector, { FeatureItem } from '@nextgis/ngw-connector';
import CancelablePromise from '@nextgis/cancelable-promise';
import {
  fetchNgwLayerFeature,
  fetchNgwLayerFeatures,
  fetchNgwLayerItems,
} from '@nextgis/ngw-kit';
import config from '../../config.json';
import { OralFeature } from '../interfaces';
import {
  OralProperties,
  OralPhotoProperties,
  LayerMetaItem,
} from './interfaces';

export const url = config.baseUrl.replace(
  /^(https?|ftp):\/\//,
  (location.protocol === 'https:' ? 'https' : 'http') + '://'
);

export const connector = new NgwConnector({ baseUrl: url });

export class Ngw {
  static getLayerFeatures(): CancelablePromise<
    Feature<Point, OralProperties>[]
  > {
    return this.getLayerMeta().then((meta) => {
      const fields = meta
        .filter(
          (x) =>
            x.type !== 'Story' && (x.search || x.list || x.type === 'Special')
        )
        .map((x) => x.value) as (keyof OralProperties)[];

      return fetchNgwLayerFeatures<Point, OralProperties>({
        connector,
        resourceId: config.ngwMarkerLayerId,
        // limit: 100,
        fields,
        extensions: [],
      }).then((features) => {
        features.forEach((x, i) => {
          if (x.id) {
            x.properties.id = Number(x.id);
          }
        });
        return features;
      });
    });
  }

  static async getLayerStoryItems(): CancelablePromise<FeatureItem[]> {
    const meta = await this.getLayerMeta();
    const fields = meta.filter((x) => x.type === 'Story').map((x) => x.value);
    return fetchNgwLayerItems<Point>({
      connector,
      resourceId: config.ngwMarkerLayerId,
      // limit: 100,
      geom: false,
      fields,
      extensions: [],
    });
  }

  static async fetchNgwLayerFeature(
    featureId: number
  ): CancelablePromise<OralFeature> {
    return fetchNgwLayerFeature({
      resourceId: config.ngwMarkerLayerId,
      featureId,
      connector,
    });
  }

  static async getPhotos(): CancelablePromise<OralPhotoProperties[]> {
    return fetchNgwLayerItems<Point, OralPhotoProperties>({
      connector,
      resourceId: config.layerWithPhotos,
      geom: false,
      extensions: false,
      fields: ['link_small', 'link_big', 'id_obj'],
    }).then((features) => {
      return features.map((x) => {
        if (x.id) {
          x.fields.id = Number(x.id);
        }
        return x.fields;
      });
    });
  }

  static getLayerMeta(): CancelablePromise<LayerMetaItem[]> {
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
  }
}
