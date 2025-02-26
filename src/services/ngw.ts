import NgwConnector from '@nextgis/ngw-connector';
import { fetchNgwLayerFeatures, fetchNgwLayerItems } from '@nextgis/ngw-kit';

import config from '../config';

import type { FeatureItem } from '@nextgis/ngw-connector';
import type { PropertiesFilter } from '@nextgis/properties-filter';
import type { FeatureProperties } from '@nextgis/utils';
import type { Feature, Point } from 'geojson';

import type { OralPointFeature } from '../interfaces';
import type {
  LayerMetaItem,
  OralPhotoProperties,
  OralProperties,
} from '../interfaces';

let limit = Infinity;

if (process.env.NODE_ENV === 'development') {
  limit = 1200;
}

// export const url = config.baseUrl.replace(
//   /^(https?|ftp):\/\//,
//   (location.protocol === 'https:' ? 'https' : 'http') + '://',
// );
export const url = config.baseUrl;

export const connector = new NgwConnector({ baseUrl: url });

export async function getLayerFeatures(): Promise<
  Feature<Point, OralProperties>[]
> {
  const meta = await getLayerMeta();
  const fields = meta
    .filter(
      (x) => x.type !== 'Story' && (x.search || x.list || x.type === 'Special'),
    )
    .map((x) => x.value) as (keyof OralProperties)[];

  const items = await fetchNgwLayerItems<Point, OralProperties>({
    connector,
    resourceId: config.ngwMarkerLayerId,
    geomFormat: 'wkt',
    limit,
    fields,
    extensions: [],
  });
  const features: Feature<Point, OralProperties>[] = [];
  for (const r of items) {
    const [lng, lat] = (r.geom as unknown as string)
      .slice(6, -1)
      .split(' ')
      .map(Number);
    const feature: Feature<Point, OralProperties> = {
      type: 'Feature',
      properties: r.fields,
      geometry: {
        type: 'Point',
        coordinates: [lng, lat],
      },
    };
    features.push(feature);
  }
  return features;
}

export async function getLayerStoryItems(): Promise<FeatureItem[]> {
  const meta = await getLayerMeta();
  const fields = meta.filter((x) => x.type === 'Story').map((x) => x.value);
  return fetchNgwLayerItems<Point>({
    connector,
    resourceId: config.ngwMarkerLayerId,
    limit,
    geom: false,
    fields: ['id1', ...fields],
    extensions: [],
  });
}

export function fetchOralFeatures<P extends FeatureProperties = OralProperties>(
  filters: PropertiesFilter<P>,
): Promise<Feature<Point, P>[]> {
  return fetchNgwLayerFeatures<Point, P>({
    resourceId: config.ngwMarkerLayerId,
    connector,
    limit: Infinity,
    filters,
  });
}

export async function fetchOralFeature(
  id1: number | string,
): Promise<OralPointFeature> {
  const x = await fetchNgwLayerFeatures<Point, OralProperties>({
    resourceId: config.ngwMarkerLayerId,
    connector,
    limit: Infinity,
    filters: [['id1', 'eq', id1]],
    cache: true,
  });
  return x[0];
}

export async function getNgwPhotos(): Promise<OralPhotoProperties[]> {
  const features = await fetchNgwLayerItems<Point, OralPhotoProperties>({
    connector,
    resourceId: config.layerWithPhotos,
    geom: false,
    extensions: false,
    limit: Infinity,
    fields: ['link_small', 'link_big', 'id_obj'],
  });
  return features.map((x) => {
    if (x.id) {
      x.fields.id = Number(x.id);
    }
    return x.fields;
  });
}

export async function fetchSpecialFields(): Promise<LayerMetaItem[]> {
  const resp = await connector.getResourceOrFail(config.specialFieldsLookupId, {
    cache: true,
  });
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
}

const defaultLayerMetaItems: LayerMetaItem[] = [
  { text: 'Идентификатор', value: 'id1', detail: false, list: true },
  // { text: 'долгота', value: 'lat', noHide: true },
  // { text: 'широта', value: 'lon', noHide: true },
  { text: 'Адрес', value: 'addr', detail: true, search: true },
  { text: 'Страна', value: 'cntry', detail: false, list: true },
  { text: 'Город', value: 'city', detail: false, list: true },
  { text: 'Регион', value: 'region', detail: false, list: true },
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

export async function getLayerMeta(): Promise<LayerMetaItem[]> {
  try {
    const specialFields = await fetchSpecialFields();
    return [...defaultLayerMetaItems, ...specialFields];
  } catch {
    return [...defaultLayerMetaItems, ...emergencySpecialFields];
  }
}
