import { PropertiesFilter } from '@nextgis/properties-filter';
import { CirclePaint } from '@nextgis/paint';
import type {
  Point,
  Feature,
  FeatureCollection,
  LineString,
  MultiPolygon,
} from 'geojson';

export type OralPointFeature = Feature<Point, OralProperties>;
export type OralLineFeature = Feature<LineString, OralProperties>;
export type OralPolygonFeature = Feature<MultiPolygon, OralProperties>;

export type OralFeature =
  | OralPointFeature
  | OralLineFeature
  | OralPolygonFeature;

export type OralFeatureCollection = FeatureCollection<Point, OralProperties>;

export type OralFilter = Record<string, PropertiesFilter | undefined>;

export interface LegendItem {
  name: string;
  item: CirclePaint;
}

export interface NarrativeTypeItem {
  name: string;
}

export type OralGeomType = 'point' | 'line' | 'poly';

export interface OralProperties {
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
  geo?: OralGeomType | null;
  name?: string;
  narrativ_b?: string;
  addr?: string;
  narrativ_l: string;
  narrativ_t: string;
  lon: number;
  narrativ_p?: string;
  type: string;
}

export interface OralPhotoProperties {
  id: number;
  link_big: string;
  link_small: string;
  id_obj: number;
  descript: string;
  link: string;
  details: string;
}

export interface LayerMetaItem {
  text: string;
  value: keyof OralProperties;
  list?: boolean;
  type?: 'NarratorLink' | 'Special' | 'Story';
  detail?: boolean;
  search?: boolean;
}
