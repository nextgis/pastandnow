/* eslint-disable @typescript-eslint/member-ordering */
import { Component, Vue, Watch } from 'vue-property-decorator';

import { oralModule } from '../../store/modules/oral';
import {
  decodePlaceValue,
  encodePlaceValue,
  getPlaceLevel,
  getPlaceText,
  joinPlaceParts,
  placesFromProperties,
} from '../../utils/place';

import type { OralFeature, PlaceProperties } from '../../interfaces';

interface CountItem {
  text: string;
  value: string;
  count: number;
  level: number;
  place: Partial<PlaceProperties>;
}

@Component
export class SelectPlace extends Vue {
  form = false;
  places: CountItem[] = [];
  search: string | null = '';

  items: CountItem[] = [];

  get features(): OralFeature[] {
    return oralModule.items;
  }

  activePlace: CountItem | null = null;

  @Watch('search')
  onSearch(val: string) {
    const items: CountItem[] = [];

    const parts: string[] = this.searchParts(val);
    const places = this.places;
    const maxItems = 100;
    for (const item of places) {
      if (item.level > 2) {
        const re = new RegExp(parts.map((x) => `(${x})`).join('|'), 'gi');
        const m = item.value.match(re);

        if (m && m.length >= parts.length) {
          items.push(item);
          if (items.length > maxItems) {
            break;
          }
        }
      }
    }
    items.sort((a, b) => b.count - a.count);

    this.items = items;
  }

  @Watch('activePlace')
  updateFilter(): void {
    if (this.activePlace) {
      oralModule.setActivePlace(this.activePlace.place);
    }
  }

  @Watch('features')
  onItemsChange(features: OralFeature[]) {
    this.setPlaces();
    this.updateFilterValues();
  }

  @Watch('places')
  onPlacesChange() {
    const a = this.getActivePlace();
    if (a) {
      this.items = [a];
    }
    this.activePlace = a;
  }

  mounted(): void {
    this.onItemsChange(oralModule.items);
  }

  updateFilterValues(): void {
    setTimeout(() => this.updateFilter());
  }

  setPlaces() {
    const places: Record<string, CountItem> = {};

    const plusOne = (val: string) => {
      const allParts = val.split('__');
      const collector: string[] = [];
      for (const p of allParts) {
        collector.push(p);
        const placeVal = joinPlaceParts(collector);
        const place = places[placeVal];
        if (place) {
          place.count += 1;
        } else {
          const placeItem = decodePlaceValue(placeVal);
          const newPlace: CountItem = {
            count: 1,
            place: placeItem,
            value: placeVal,
            level: getPlaceLevel(placeVal),
            text: getPlaceText(placeItem),
          };
          places[placeVal] = newPlace;
        }
      }
    };

    for (const i of this.features) {
      const places_ = placesFromProperties(i.properties);
      for (const place of places_) {
        const value = encodePlaceValue(place);
        const exist = places[value];
        if (!exist) {
          const newPlace: CountItem = {
            count: 0,
            place,
            text: getPlaceText(place),
            level: getPlaceLevel(value),
            value,
          };
          places[value] = newPlace;
        }
        plusOne(value);
      }
    }
    this.places = Object.values(places);
  }

  getItemStyle(item: CountItem): Record<string, any> {
    let weight = 400;
    if (item.count >= 1000) {
      weight = 700;
    } else if (item.count >= 100) {
      weight = 600;
    }
    return { 'font-weight': weight };
  }

  getItemHtml(text: string): string {
    if (this.search) {
      const searchPart = this.searchParts(this.search);
      for (const p of searchPart) {
        const re = new RegExp(p, 'gi');
        text = text.replace(re, (a) => `<b>${a}</b>`);
      }
    }
    return `<span>${text}</span>`;
  }

  private searchParts(val: string | null): string[] {
    const str = val ? val.replace(/,/g, ' ') : '';
    return str
      .split(' ')
      .map((x) => x.trim())
      .filter(Boolean);
  }

  private getActivePlace(): CountItem | null {
    const encode = encodePlaceValue(oralModule.activePlace);
    const parts = encode.split('__');
    for (let fry = 0; fry < parts.length; fry++) {
      const v = parts.slice(0, parts.length - fry);
      const place = this.places.find((p) => {
        return p.value === joinPlaceParts(v);
      });
      if (place) {
        return place;
      }
    }
    return null;
  }
}
