import { CirclePaint } from '@nextgis/paint';
import { getHistoryPaint } from './getHistoryPaint';
import { OralFeature } from '../interfaces';

export function getOralPaint(
  feature: OralFeature,
  options?: CirclePaint,
  forLegend = false,
): CirclePaint {
  const paint = getHistoryPaint(feature.properties, options, forLegend);
  return paint;
}
