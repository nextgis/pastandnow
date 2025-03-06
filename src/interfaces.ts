import type { PathPaint } from '@nextgis/paint';
import type { PropertiesFilter } from '@nextgis/properties-filter';
import type {
  Feature,
  FeatureCollection,
  LineString,
  MultiPolygon,
  Point,
} from 'geojson';

interface PlaceFilter {
  cntry?: PropertiesFilter;
  region?: PropertiesFilter;
  city?: PropertiesFilter;
  rayon?: PropertiesFilter;
}
interface NonPlaceFilter {
  type?: PropertiesFilter;
  fullText?: PropertiesFilter;
  specialFilter?: PropertiesFilter;
  narrativeType?: PropertiesFilter;
}

export type FilterProperties = PlaceFilter & NonPlaceFilter;

export type OralPointFeature = Feature<Point, OralProperties>;
export type OralLineFeature = Feature<LineString, OralProperties>;
export type OralPolygonFeature = Feature<MultiPolygon, OralProperties>;

export type OralFeature =
  | OralPointFeature
  | OralLineFeature
  | OralPolygonFeature;

export type OralFeatureCollection = FeatureCollection<Point, OralProperties>;

export type OralFilter = FilterProperties;

export interface LegendItem {
  name: string;
  item: PathPaint;
  geo?: OralGeomType;
}

export interface NarrativeTypeItem {
  name: string;
}

export type OralGeomType = 'point' | 'line' | 'poly';

export interface OralProperties {
  id: number;

  id1: string;
  city: string;
  cntry: string;
  region: string;
  rayon: string;
  status: string;
  narrator: string;
  nar_codes: string;
  description?: string;
  mos2?: string;
  mos5?: string;
  mos7?: string;
  mos8?: string;
  mos4?: string;
  visual?: string;
  mos6?: string;
  mos1?: string;
  unoff: string;
  mos3?: string;
  descript2?: string;
  lat: number;
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

export type PlaceProperties = Pick<
  OralProperties,
  'cntry' | 'region' | 'city' | 'rayon'
>;

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

export interface OralFeatures {
  point: OralPointFeature[];
  line: OralLineFeature[];
  poly: OralPolygonFeature[];
}
export interface OralLayers {
  point: string;
  line: string;
  poly: string;
}
