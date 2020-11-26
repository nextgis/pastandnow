import { PropertiesFilter } from '@nextgis/properties-filter';
import { CirclePaint } from '@nextgis/paint';
import { BdMainItemProperties } from './api/interfaces';
import { Point, Feature, FeatureCollection } from 'geojson';

export type OralFeature = Feature<Point, BdMainItemProperties>;

export type OralFeatureCollection = FeatureCollection<
  Point,
  BdMainItemProperties
>;

export type OralFilter = Record<string, PropertiesFilter | undefined>;

export interface LegendItem {
  name: string;
  item: CirclePaint;
}
