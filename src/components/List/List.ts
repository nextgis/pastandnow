import { Vue, Component, Watch } from 'vue-property-decorator';
import { CirclePaint } from '@nextgis/paint';

import { appModule } from '../../store/modules/app';
import { oralModule } from '../../store/modules/oral';
import SymbolComponent from '../Symbol/Symbol.vue';
import { OralFeature } from '../../interfaces';
import { getHistoryPaint } from '../../utils/getHistoryPaint';
import { OralProperties } from '../../interfaces';

@Component({ components: { SymbolComponent } })
export class List extends Vue {
  portionCount = 30;

  portion: OralProperties[] = [];

  active: number | null = null;

  get listSearchText(): string {
    return oralModule.listSearchText;
  }

  get items(): OralProperties[] {
    return oralModule.sortFeatures.map((x) => {
      return x.properties;
    });
  }

  get filtered(): OralFeature[] {
    return oralModule.filtered;
  }

  get detail(): OralFeature | false {
    return oralModule.detailItem;
  }

  get displayItems(): OralProperties[] {
    return this.getDisplayItems();
  }

  @Watch('detail')
  @Watch('items')
  @Watch('filtered')
  onDetailChange(): void {
    const detail = this.detail;
    const index = detail
      ? this.portion.findIndex((x) => x.id1 === detail.properties.id1)
      : null;
    this.active = index;
  }

  @Watch('listSearchText')
  @Watch('filtered')
  resetPortions(): void {
    this.portion = [];
    this.addPortion();
  }

  mounted(): void {
    if (this.detail) {
      this.onDetailChange();
    }
    this.addPortion();
  }

  getItemPaint(item: OralProperties): CirclePaint {
    return getHistoryPaint(item);
  }

  getDisplayItems(): OralProperties[] {
    return this.items;
  }

  setDetail(id: number): void {
    oralModule.setDetail(id);
    appModule.zoomTo(id);
  }

  addPortion(): void {
    const items = this.getDisplayItems();
    const portionsLength = this.portion.length;
    const itemsLength = items.length;
    if (portionsLength < itemsLength) {
      const portions = [...this.portion];
      const addLength = portionsLength + this.portionCount;
      const len = addLength > itemsLength ? itemsLength : addLength;
      for (let fry = portionsLength; fry < len; fry++) {
        const portion = items[fry];
        portions.push(portion);
      }
      this.portion = portions;
    }
  }
}
