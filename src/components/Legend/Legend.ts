import { capitalize } from '@nextgis/utils';
import { Component, Vue } from 'vue-property-decorator';

import { oralModule } from '../../store/modules/oral';
import SymbolComponent from '../Symbol/Symbol.vue';

import type { OralGeomType } from '../../interfaces';
import type { PathPaint } from '@nextgis/paint';

interface LegendItem {
  text: string;
  icon: PathPaint;
  geo?: OralGeomType;
}

@Component({ components: { SymbolComponent } })
export default class Legend extends Vue {
  get legendItems(): LegendItem[] {
    return [...oralModule.legendItems]
      .sort((a, b) => (a.name > b.name ? 1 : -1))
      .map((x) => {
        return {
          text: x.name,
          // geo: x.geo,
          icon: x.item,
        };
      });
  }

  get activeTypes(): string[] {
    return oralModule.activeTypes || [];
  }

  set activeTypes(items: string[]) {
    oralModule.setActiveTypes(items);
    items = [...items];
    const arrayCompare = [...this.legendItems]
      .map((x) => x.text)
      .sort()
      .every(function (value, index) {
        return value === items.sort()[index];
      });
    if (arrayCompare) {
      oralModule.setTypesFilter(undefined);
    } else {
      oralModule.setTypesFilter(items);
    }
  }

  mounted(): void {
    if (!oralModule.activeTypes) {
      oralModule.setActiveTypes(oralModule.legendItems.map((x) => x.name));
    }
  }

  capitalize(str: string): string {
    return capitalize(str);
  }
}
