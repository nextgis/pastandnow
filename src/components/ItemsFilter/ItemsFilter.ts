import Vue from 'vue';
import Component from 'vue-class-component';
import { BdMainItemProperties } from '../../api/ngw';

@Component({
  data() {
    return {
      form: false,
      years: [1900, 2018],
      minYear: 1900,
      maxYear: 2018,

      moscow: [
        {name: 'дворовая', param: 'mos1'},
        {name: 'легендарная', param: 'mos2'},
        {name: 'бездомная', param: 'mos3'},
        {name: 'подземная', param: 'mos4'},
        {name: 'церковная', param: 'mos5'},
        {name: 'субкультурная', param: 'mos6', value: false},
      ],
      rayon: 'Все',
      areas: ['Все']
    };
  }
})
export class ItemsFilter extends Vue {

  years: [number, number];
  minYear: number;
  maxYear: number;

  areas: string[];
  moscow: Array<{name: string, param: string, value?: boolean}>;
  rayon: string;

  mounted() {

    this.moscow.forEach((x) => {
      x.value = x.value !== undefined ? x.value : true;
    });

    this.$store.watch((state) => state.bdMain.items, (items) => {
      const areas = {};
      const properties: BdMainItemProperties[] = items.map((x) => {
        const prop = x.properties;
        areas[prop.rayon] = true;
        return prop;
      });
      this.areas = this.areas.concat(Object.keys(areas));
    });

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
