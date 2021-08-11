import { Point, Feature } from 'geojson';
import NgwConnector, {
  FeatureItem,
  FeatureProperties,
} from '@nextgis/ngw-connector';
import { PropertiesFilter } from '@nextgis/properties-filter';
import CancelablePromise from '@nextgis/cancelable-promise';
import { fetchNgwLayerFeatures, fetchNgwLayerItems } from '@nextgis/ngw-kit';

import config from '../config';
import type { OralPointFeature } from '../interfaces';
import type {
  OralProperties,
  OralPhotoProperties,
  LayerMetaItem,
} from '../interfaces';

// export const url = config.baseUrl.replace(
//   /^(https?|ftp):\/\//,
//   (location.protocol === 'https:' ? 'https' : 'http') + '://',
// );
export const url = config.baseUrl;

export const connector = new NgwConnector({ baseUrl: url });

export class Ngw {
  static getLayerFeatures(): CancelablePromise<
    Feature<Point, OralProperties>[]
  > {
    return this.getLayerMeta().then((meta) => {
      const fields = meta
        .filter(
          (x) =>
            x.type !== 'Story' && (x.search || x.list || x.type === 'Special'),
        )
        .map((x) => x.value) as (keyof OralProperties)[];

      return fetchNgwLayerFeatures<Point, OralProperties>({
        connector,
        resourceId: config.ngwMarkerLayerId,
        limit: 7,
        filters: [
          ['id1', 'in', [4418, 6687, 100001, 100002, 100003, 100004, 100005]],
        ],
        fields,
        extensions: [],
      });
    });
  }

  static getLayerStoryItems(): CancelablePromise<FeatureItem[]> {
    return this.getLayerMeta().then((meta) => {
      const fields = meta.filter((x) => x.type === 'Story').map((x) => x.value);
      return fetchNgwLayerItems<Point>({
        connector,
        resourceId: config.ngwMarkerLayerId,
        limit: 7,
        geom: false,
        fields,
        extensions: [],
      });
    });
  }

  static fetchNgwLayerFeatures<P extends FeatureProperties = OralProperties>(
    filters: PropertiesFilter<P>,
  ): CancelablePromise<Feature<Point, P>[]> {
    return fetchNgwLayerFeatures<Point, P>({
      resourceId: config.ngwMarkerLayerId,
      connector,
      filters,
    });
  }

  static fetchNgwLayerFeature(
    id1: number,
  ): CancelablePromise<OralPointFeature> {
    return fetchNgwLayerFeatures<Point, OralProperties>({
      resourceId: config.ngwMarkerLayerId,
      connector,
      filters: [['id1', 'eq', id1]],
    }).then((x) => {
      return x[0];
    });
  }

  static getPhotos(): CancelablePromise<OralPhotoProperties[]> {
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
        text: 'Тип геометрии',
        value: 'geo',
        detail: true,
        list: true,
        search: false,
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
