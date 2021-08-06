import { Feature } from 'geojson';
import { CirclePaint } from '@nextgis/paint';
import { getHistoryPaint } from './getHistoryPaint';

export function getHistoryIcon(
  feature: Feature,
  options?: CirclePaint,
  forLegend = false,
): CirclePaint {
  const paint = getHistoryPaint(feature.properties, options, forLegend);
  return paint;
}
