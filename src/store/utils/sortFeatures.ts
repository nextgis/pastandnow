import type { OralFeature } from '../../interfaces';

export function sortFeatures(features: OralFeature[]): OralFeature[] {
  const filtered = [...features] as OralFeature[];
  return filtered.sort((a, b) => {
    const aName = a.properties.name || '';
    const bName = b.properties.name || '';
    return aName.toUpperCase() > bName.toUpperCase() ? 1 : -1;
  });
}
