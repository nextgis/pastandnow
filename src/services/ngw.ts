import { Point, Feature } from 'geojson';
import NgwConnector, { FeatureItem } from '@nextgis/ngw-connector';
import CancelablePromise from '@nextgis/cancelable-promise';
import { fetchNgwLayerFeatures, fetchNgwLayerItems } from '@nextgis/ngw-kit';
import config from '../config';

import type { FeatureProperties } from '@nextgis/utils';
import type { PropertiesFilter } from '@nextgis/properties-filter';
import type { OralPointFeature } from '../interfaces';
import type {
  OralProperties,
  OralPhotoProperties,
  LayerMetaItem,
} from '../interfaces';

let limit = 8000;

if (process.env.NODE_ENV === 'development') {
  limit = 100;
}

// export const url = config.baseUrl.replace(
//   /^(https?|ftp):\/\//,
//   (location.protocol === 'https:' ? 'https' : 'http') + '://',
// );
export const url = config.baseUrl;

export const connector = new NgwConnector({ baseUrl: url });

export function getLayerFeatures(): CancelablePromise<
  Feature<Point, OralProperties>[]
> {
  return getLayerMeta().then((meta) => {
    const fields = meta
      .filter(
        (x) =>
          x.type !== 'Story' && (x.search || x.list || x.type === 'Special'),
      )
      .map((x) => x.value) as (keyof OralProperties)[];

    return fetchNgwLayerFeatures<Point, OralProperties>({
      connector,
      resourceId: config.ngwMarkerLayerId,
      limit,
      // filters: [
      //   ['id1', 'in', [4418, 6687, 100001, 100002, 100003, 100004, 100005]],
      // ],
      fields,
      extensions: [],
    });
  });
}

export function getLayerStoryItems(): CancelablePromise<FeatureItem[]> {
  return getLayerMeta().then((meta) => {
    const fields = meta.filter((x) => x.type === 'Story').map((x) => x.value);
    return fetchNgwLayerItems<Point>({
      connector,
      resourceId: config.ngwMarkerLayerId,
      limit,
      geom: false,
      fields,
      extensions: [],
    });
  });
}

export function fetchOralFeatures<P extends FeatureProperties = OralProperties>(
  filters: PropertiesFilter<P>,
): CancelablePromise<Feature<Point, P>[]> {
  return fetchNgwLayerFeatures<Point, P>({
    resourceId: config.ngwMarkerLayerId,
    connector,
    filters,
  });
}

export function fetchOralFeature(
  id1: number,
): CancelablePromise<OralPointFeature> {
  return fetchNgwLayerFeatures<Point, OralProperties>({
    resourceId: config.ngwMarkerLayerId,
    connector,
    filters: [['id1', 'eq', id1]],
    cache: true,
  }).then((x) => {
    return x[0];
  });
}

export function getPhotos(): CancelablePromise<OralPhotoProperties[]> {
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

export function fetchSpecialFields(): CancelablePromise<LayerMetaItem[]> {
  return connector
    .getResourceOrFail(config.specialFieldsLookupId, { cache: true })
    .then((resp) => {
      if (resp.lookup_table) {
        return Object.entries(resp.lookup_table.items).map(([value, text]) => ({
          text,
          value: value as keyof OralProperties,
          detail: false,
          type: 'Special',
        }));
      }
      throw new Error(
        `Resource ${config.specialFieldsLookupId} is not a lookup table`,
      );
    });
}

const defaultLayerMetaItems: LayerMetaItem[] = [
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
];

// try to fetch Special type of fields with getSpecialFields method
// if error use this data
const emergencySpecialFields: LayerMetaItem[] = [
  { text: 'Дворы', value: 'mos1', detail: false, type: 'Special' },
  { text: 'Религия', value: 'mos2', detail: false, type: 'Special' },
  { text: 'Бездомные', value: 'mos3', detail: false, type: 'Special' },
  { text: 'Подземелья', value: 'mos4', detail: false, type: 'Special' },
  { text: 'Субкультуры', value: 'mos5', detail: false, type: 'Special' },
  { text: 'Легенды', value: 'mos6', detail: false, type: 'Special' },
  // { text: 'Памятники', value: 'mos7', type: 'Special' },
  // { text: 'Последний адрес', value: 'mos8', type: 'Special' },
];

export function getLayerMeta(): CancelablePromise<LayerMetaItem[]> {
  return fetchSpecialFields()
    .then((specialFields) => {
      return [...defaultLayerMetaItems, ...specialFields];
    })
    .catch(() => {
      return [...defaultLayerMetaItems, ...emergencySpecialFields];
    });
}
