import { Vue, Component, Watch } from 'vue-property-decorator';

import {
  oralModule,
  OralFeature,
  FilterProperties,
  ALL_RAYON_STR,
} from '../../store/modules/oral';

@Component
export class ItemsFilter extends Vue {
  form = false;

  moscow: Array<{ name: string; param: string; value?: boolean }> = [
    { name: 'дворовая', param: 'mos1' },
    { name: 'легендарная', param: 'mos2' },
    { name: 'бездомная', param: 'mos3' },
    { name: 'подземная', param: 'mos4' },
    { name: 'церковная', param: 'mos5' },
    { name: 'субкультурная', param: 'mos6', value: false },
  ];

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

  cities: string[] = [];

  get items() {
    return oralModule.items;
  }

  mounted() {
    this.moscow.forEach((x) => {
      x.value = x.value !== undefined ? x.value : true;
    });

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
    const areas: Record<string, string> = {};
    const cities: Record<string, boolean> = {};
    items.forEach((x) => {
      const prop = x.properties;
      const rayons = prop.rayon;
      if (rayons) {
        const rayonList = rayons.split(';').map((y) => y.trim());
        rayonList.forEach((y) => {
          areas[y] = prop.city;
        });
      }
      cities[prop.city] = true;
    });

    this.areasByCities = areas;

    const sortCities = Object.keys(cities).sort();
    this.cities = sortCities;
    this.updateFilterAreas();
    setTimeout(() => this.updateFilter());
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
