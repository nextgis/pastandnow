import {
  mdiArrowLeft,
  mdiChevronRight,
  mdiClose,
  mdiCrosshairsGps,
  mdiFilter,
  mdiFormatListBulleted,
  mdiMagnify,
  mdiMapMarker,
  mdiMessageAlert,
  mdiShareVariant,
} from '@mdi/js';

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
  city: '',
  region: '',
  rayon: '',
};

export const svg = {
  close: mdiClose,
  filter: mdiFilter,
  search: mdiMagnify,
  place: mdiMapMarker,
  share: mdiShareVariant,
  target: mdiCrosshairsGps,
  arrow_back: mdiArrowLeft,
  feedback: mdiMessageAlert,
  list: mdiFormatListBulleted,
  chevron_right: mdiChevronRight,
};
