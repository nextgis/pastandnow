import { Vue, Component } from 'vue-property-decorator';

import { oralModule } from '../../store/modules/oral';

import SymbolComponent from '../Symbol/Symbol.vue';

interface LegendItem {
  text: string;
  icon: any;
}

@Component({ components: { SymbolComponent } })
export default class Legend extends Vue {
  get legendItems(): LegendItem[] {
    return [...oralModule.legendItems]
      .sort((a, b) => (a.name > b.name ? 1 : -1))
      .map(x => {
        return {
          text: x.name,
          icon: x.item
        };
      });
  }

  get activeTypes() {
    return oralModule.activeTypes;
  }

  set activeTypes(items: string[]) {
    oralModule.setActiveTypes(items);
    items = [...items];
    const arrayCompare = [...this.legendItems]
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

  mounted() {
    oralModule.setActiveTypes(oralModule.legendItems.map(x => x.name));
  }
}
