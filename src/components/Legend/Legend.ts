import { Vue, Component, Watch } from 'vue-property-decorator';
import { arrayCompare } from '@nextgis/utils';

import { oralModule } from '../../store/modules/oral';

import SymbolComponent from '../Symbol/Symbol.vue';

interface LegendItem {
  text: string;
  icon: any;
}

@Component({ components: { SymbolComponent } })
export default class Legend extends Vue {
  legendFilterMem: Record<string, boolean> = {};

  get legendItems(): LegendItem[] {
    return [...oralModule.legendItems]
      .sort((a, b) => (a.name > b.name ? 1 : -1))
      .map(x => {
        this.setTypeFilterItem(x.name, true);
        return {
          text: x.name,
          icon: x.item
        };
      });
  }

  @Watch('legendItems')
  @Watch('legendFilterMem', { deep: true })
  onLegendEnabledChange(item: Record<string, boolean>) {
    const items = Object.entries(item)
      .filter(([key, value]) => value)
      .map(x => x[0]);

    const arrayCompare = this.legendItems
      .map(x => x.text)
      .sort()
      .every(function(value, index) {
        return value === items.sort()[index];
      });
    if (arrayCompare) {
      oralModule.setTypesFilter(undefined);
    } else {
      oralModule.setTypesFilter(items);
    }
  }

  setTypeFilterItem(name: string, value?: boolean) {
    Vue.set(this.legendFilterMem, name, value ?? !this.legendFilterMem[name]);
  }
}
