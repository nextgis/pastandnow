import { CirclePaint } from '@nextgis/paint';
import { shadeColor } from './shadeColor';

export const featureStyles: Record<string, CirclePaint> = {
  водоем: { color: '#4163aa', strokeColor: '' },
  ландшафт: { color: '#93bf20' },
  памятник: { color: '#e42a1b' },
  строение: { color: '#289de4' },
  территория: { color: '#e75dbd' },
  улица: { color: '#fbd507' },
  зона: { color: '#bbbbbb' },
  'населенный пункт': { color: '#aaaaaa' },
  район: { color: '#b1ae44' },
  другой: { color: '#363636' },
  метро: { color: '#8807ff' },
  'метро-2': { color: '#8807ff' },
  'другие подземные объекты': { color: '#8807ff' },
};
export const featureStyleKeys = Object.keys(featureStyles);

// Shade stroke color
featureStyleKeys.forEach((x) => {
  const style = featureStyles[x];
  if (style && typeof style.color === 'string' && !style.strokeColor) {
    style.strokeColor = shadeColor(style.color, -30);
  }
});
