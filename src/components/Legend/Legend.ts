import Vue from 'vue';
import Component from 'vue-class-component';

import { oralModule } from '../../store/modules/oral';

@Component
export default class About extends Vue {
  get legendItems() {
    return [...oralModule.legendItems]
      .sort((a, b) => (a.name > b.name ? 1 : -1))
      .map(x => {
        return {
          text: x.name,
          icon: x.item.svg
        };
      });
  }
}
