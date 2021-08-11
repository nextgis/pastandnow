import { CirclePaint, PathPaint } from '@nextgis/paint';
import { OralFeature } from '../interfaces';
import { oralModule } from '../store/modules/oral';
import { featureStyleKeys, featureStyles } from './featureStyleKeys';

export function getPathPaint(
  feature: OralFeature,
  options?: PathPaint,
  forLegend = false,
): PathPaint {
  const circle = getHistoryPaint(feature.properties, {}, forLegend);
  const { color } = circle;
  return { color, ...options };
}

export function getHistoryPaint(
  properties?: Record<string, any> | null,
  options?: CirclePaint,
  forLegend = false,
): CirclePaint {
  const defaultStyle: CirclePaint = {
    color: '#363636',
    fillOpacity: 0.9,
    // weight: 2,
    // radius: 3,
    stroke: true,
  };
  let style: CirclePaint | undefined;
  let styleId: string | undefined;
  if (properties && properties.type) {
    const featureType: string = properties.type;
    styleId = featureStyleKeys.find((x) => featureType.search(x) !== -1);
    if (styleId && featureStyles[styleId]) {
      style = featureStyles[styleId];
    }
  }
  const paint: CirclePaint = {
    ...defaultStyle,
    ...style,
    ...options,
  };
  if (style && styleId && forLegend) {
    oralModule.setLegend({ name: styleId, item: paint });
  }
  return paint;
}
