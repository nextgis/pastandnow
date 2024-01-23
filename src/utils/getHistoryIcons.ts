import { getHistoryPaint } from './getHistoryPaint';

import type { OralFeature } from '../interfaces';
import type { CirclePaint } from '@nextgis/paint';

export function getOralPaint(
  feature: OralFeature,
  options?: CirclePaint,
  forLegend = false,
): CirclePaint {
  const paint = getHistoryPaint(feature.properties, options, forLegend);
  return paint;
}
