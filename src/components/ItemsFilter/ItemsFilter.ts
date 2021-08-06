import { Vue, Component, Watch } from 'vue-property-decorator';

import {
  oralModule,
  FilterProperties,
  ALL_RAYON_STR,
} from '../../store/modules/oral';
import { OralFeature } from '../../interfaces';

interface CountItem {
  text: string;
  value: string;
  count: number;
}

@Component
export class ItemsFilter extends Vue {
  form = false;

  get rayon(): string {
    return oralModule.activeRayon;
  }

  set rayon(val: string) {
    oralModule.setActiveRayon(val);
  }

  areas: CountItem[] = [];
  areasByCities: Record<string, string> = {};

  get city(): string {
    return oralModule.activeCity;
  }

  set city(val: string) {
    oralModule.setActiveCity(val);
  }

  get cities(): CountItem[] {
    const cities = oralModule.filterData.cities;
    return Object.keys(cities)
      .sort()
      .map((x) => {
        const count = cities[x];
        return {
          text: `${x} (${count})`,
          value: x,
          count,
        };
      });
  }

  get items(): OralFeature[] {
    return oralModule.items;
  }

  @Watch('city')
  updateCity(): void {
    this.rayon = ALL_RAYON_STR;
    this.updateFilter();
  }

  @Watch('rayon')
  updateFilter(): void {
    const filters: FilterProperties = {
      city: [['city', 'eq', this.city]],
    };

    if (this.rayon && this.rayon !== ALL_RAYON_STR) {
      filters.rayon = [['%rayon%', 'ilike', this.rayon]];
    } else {
      filters.rayon = undefined;
    }

    oralModule.updateFilter(filters);
  }

  @Watch('items')
  updateFilterValues(items: OralFeature[]): void {
    this.updateAreasItems(undefined, undefined, items);
    setTimeout(() => this.updateFilter());
  }

  @Watch('city')
  updateAreasItems(
    city?: string,
    oldCity?: string,
    items?: OralFeature[],
  ): void {
    items = items ?? this.items;
    const areas: Record<string, number> = {};

    items.forEach((x) => {
      const prop = x.properties;
      const rayons = prop.rayon;
      if (prop.city === this.city && rayons) {
        const rayonList = rayons.split(';').map((y) => y.trim());
        rayonList.forEach((y) => {
          areas[y] = (areas[y] ?? 0) + 1;
        });
      }
    });
    const sortCities = Object.keys(areas)
      .sort()
      .map((x) => {
        const count = areas[x];
        return {
          text: `${x} (${count})`,
          value: x,
          count,
        };
      });
    sortCities.unshift({
      value: ALL_RAYON_STR,
      text: ALL_RAYON_STR,
      count: items.length,
    });
    this.areas = sortCities;
  }

  mounted(): void {
    this.updateFilterValues(oralModule.items);
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
}
