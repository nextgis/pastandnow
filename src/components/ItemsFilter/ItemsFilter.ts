import { Vue, Component } from 'vue-property-decorator';
import { BdMainItemProperties } from '../../api/ngw';

@Component
export class ItemsFilter extends Vue {

  form = false;
  years: [number, number] = [1900, 2018];
  minYear: number = 1900;
  maxYear: number = 2018;
  moscow: Array<{ name: string, param: string, value?: boolean }> = [
    { name: 'дворовая', param: 'mos1' },
    { name: 'легендарная', param: 'mos2' },
    { name: 'бездомная', param: 'mos3' },
    { name: 'подземная', param: 'mos4' },
    { name: 'церковная', param: 'mos5' },
    { name: 'субкультурная', param: 'mos6', value: false },
  ];
  rayon = 'Все';
  areas: string[] = ['Все'];

  mounted() {

    this.moscow.forEach((x) => {
      x.value = x.value !== undefined ? x.value : true;
    });

    if (this.$store.state.bdMain.items) {
      this.updateFilterAreas(this.$store.state.bdMain.items);
    }
    this.$store.watch((state) => state.bdMain.items, (items) => {
      this.updateFilterAreas(items);
    });

  }

  updateFilterAreas(items) {
    const areas = {};
    const properties: BdMainItemProperties[] = items.map((x) => {
      const prop = x.properties;
      areas[prop.rayon] = true;
      return prop;
    });
    this.areas = this.areas.concat(Object.keys(areas));
  }

  updateFilter() {
    const items = this.$store.state.bdMain.items.slice();

    const filtered = items.filter((x) => {
      const prop: BdMainItemProperties = x.properties;

      if (this.rayon && this.rayon !== 'Все' && prop.rayon !== this.rayon) {
        return false;
      }
      return true;
    });

    this.$store.dispatch('bdMain/setFilter', filtered);

  }

}
