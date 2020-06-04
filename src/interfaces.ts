import { PropertiesFilter } from '@nextgis/webmap';
import { CirclePaint } from '@nextgis/paint';
import { BdMainItemProperties } from './api/ngw';
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
