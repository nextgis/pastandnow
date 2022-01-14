import { PLACE_KEYS } from '../constants';
import type { OralProperties, PlaceProperties } from '../interfaces';

export function decodePlaceValue(val: string): Partial<PlaceProperties> {
  const [cntry, region, city, rayon] = val.split('__');
  return { cntry, region, city, rayon };
}

export function encodePlaceValue(
  place: Partial<PlaceProperties>,
  level?: keyof PlaceProperties,
): string {
  const placeKeys = PLACE_KEYS;
  const parts: string[] = [];

  for (const k of placeKeys) {
    parts.push(place[k] || '');
    if (level && level === k) {
      break;
    }
  }
  return joinPlaceParts(parts);
}

export function joinPlaceParts(parts: string[]): string {
  return parts.join('__').replace(/_+$/, '');
}

export function placeFromProperties(props: OralProperties): PlaceProperties {
  const { cntry, region, city, rayon } = props;
  return { cntry, region, city, rayon };
}

export function getPlaceText(place: Partial<PlaceProperties>): string {
  const { cntry, region, city, rayon } = place;
  return [cntry, region, city, rayon].filter(Boolean).join(', ');
}

export function getPlaceLevel(str: string): number {
  return str.split('__').length;
}

/**
 * The place is set by attributes$
 * 'cntry' | 'region' | 'city' | 'rayon'
 *
 * Each attribute can be represented by a single value S or an list S,...,Sn
 *
 * Scn Sr Sc Srn -> Place Scn Sr Sc Srn
 *
 *                     /  Place Scn Sr Sc1    del Srn
 * Scn Sr Sc1,Sc2 Srn |
 *                     \  Place Scn Sr Sc2    del Srn
 */
export function placesFromProperties(
  props: OralProperties,
): Partial<PlaceProperties>[] {
  const places: Partial<PlaceProperties>[] = [];
  const placeKeys = PLACE_KEYS;

  const place: Partial<PlaceProperties> = {};
  const forked = false;
  for (const k of placeKeys) {
    const val = props[k] && props[k].split(';').map((y) => y.trim());
    if (val.length > 1) {
      for (const v of val) {
        places.push({ ...place, [k]: v });
      }
      // ignore all next place keys
      break;
    } else {
      place[k] = val[0];
    }
  }
  if (!forked) {
    places.push(place);
  }

  return places;
}
