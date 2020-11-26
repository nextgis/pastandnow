import { PropertiesFilter } from '@nextgis/properties-filter';
import { CirclePaint } from '@nextgis/paint';
import { OralProperties } from './api/interfaces';
import { Point, Feature, FeatureCollection } from 'geojson';

export type OralFeature = Feature<Point, OralProperties>;

export type OralFeatureCollection = FeatureCollection<Point, OralProperties>;

export type OralFilter = Record<string, PropertiesFilter | undefined>;

export interface LegendItem {
  name: string;
  item: CirclePaint;
}
