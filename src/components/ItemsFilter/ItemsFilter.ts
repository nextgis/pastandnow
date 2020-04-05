import { Vue, Component, Watch } from 'vue-property-decorator';

import {
  oralModule,
  OralFeature,
  FilterProperties,
  ALL_RAYON_STR,
} from '../../store/modules/oral';

interface CityItem {
  text: string;
  value: string;
  count: number;
}

@Component
export class ItemsFilter extends Vue {
  form = false;

  get rayon() {
    return oralModule.activeRayon;
  }

  set rayon(val: string) {
    oralModule.setActiveRayon(val);
  }

  areas: string[] = [];
  areasByCities: Record<string, string> = {};

  get city() {
    return oralModule.activeCity;
  }

  set city(val: string) {
    oralModule.setActiveCity(val);
  }

  cities: CityItem[] = [];

  get items() {
    return oralModule.items;
  }

  mounted() {
    this.updateFilterValues(oralModule.items);
  }

  @Watch('city')
  updateCity() {
    this.updateFilterAreas();
    this.rayon = ALL_RAYON_STR;
    this.updateFilter();
  }

  @Watch('rayon')
  updateFilter() {
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
  updateFilterValues(items: OralFeature[]) {
    const cities: Record<string, number> = {};
    this.updateAreasItems(items);
    items.forEach((x) => {
      const prop = x.properties;
      if (prop.city) {
        cities[prop.city] = (cities[prop.city] ?? 0) + 1;
      }
    });
    const sortCities = Object.keys(cities)
      .sort()
      .map((x) => {
        const count = cities[x];
        return {
          text: `${x} (${count})`,
          value: x,
          count,
        };
      });
    this.cities = sortCities;
    this.updateFilterAreas();
    setTimeout(() => this.updateFilter());
  }

  @Watch('city')
  updateAreasItems(items?: OralFeature[]) {
    items = items ?? this.items;
    const areas: Record<string, string> = {};

    items.forEach((x) => {
      const prop = x.properties;
      const rayons = prop.rayon;
      if (rayons) {
        const rayonList = rayons.split(';').map((y) => y.trim());
        rayonList.forEach((y) => {
          areas[y] = prop.city;
        });
      }
    });

    this.areasByCities = areas;
  }

  getItemStyle(item: CityItem) {
    let weight = 400;
    if (item.count >= 1000) {
      weight = 700;
    } else if (item.count >= 100) {
      weight = 600;
    }
    return { 'font-weight': weight };
  }

  updateFilterAreas() {
    const areas = this.areasByCities;
    const areasByActiveCity = [];

    for (const a in areas) {
      const val = areas[a];
      if (val === this.city) {
        areasByActiveCity.push(a);
      }
    }
    this.areas = [ALL_RAYON_STR, ...areasByActiveCity.sort()];
  }
}
