import type { PlaceProperties } from './interfaces';

export const ALL_RAYON_STR = 'Все районы';

export const PLACE_KEYS: (keyof PlaceProperties)[] = [
  'cntry',
  'region',
  'city',
  'rayon',
];

export const DEFAULT_PLACE: PlaceProperties = {
  cntry: 'Россия',
  city: 'Москва',
  region: '',
  rayon: '',
};
