import Vue from 'vue';
import Component from 'vue-class-component';

import { oralModule } from '../../store/modules/oral';

import SymbolComponent from '../Symbol/Symbol.vue';

@Component({ components: { SymbolComponent } })
export default class Legend extends Vue {
  get legendItems() {
    return [...oralModule.legendItems]
      .sort((a, b) => (a.name > b.name ? 1 : -1))
      .map(x => {
        return {
          text: x.name,
          icon: x.item
        };
      });
  }
}
