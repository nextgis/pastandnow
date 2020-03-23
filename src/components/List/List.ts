import { Vue, Component, Watch } from 'vue-property-decorator';
import { BdMainItem, BdMainItemProperties } from '../../api/ngw';
import { appModule } from '../../store/modules/app';
import { oralModule } from '../../store/modules/oral';
import SymbolComponent from '../Symbol/Symbol.vue';
import { getHistoryPaint } from '../OralMap/OralMap';

@Component({ components: { SymbolComponent } })
export class List extends Vue {
  portionCount = 30;

  portion: BdMainItemProperties[] = [];

  active: number | null = null;

  get listSearchText(): string {
    return oralModule.listSearchText;
  }

  get items(): BdMainItemProperties[] {
    return oralModule.sortFeatures.map(x => x.properties);
  }

  get filtered() {
    return oralModule.filtered;
  }

  get detail(): BdMainItem {
    return oralModule.detailItem;
  }

  mounted() {
    this.addPortion();
  }

  get displayItems() {
    return this.getDisplayItems();
  }

  getItemPaint(item: BdMainItemProperties) {
    return getHistoryPaint(item);
  }

  getDisplayItems(): BdMainItemProperties[] {
    return this.items;
  }

  @Watch('detail')
  onDetailChange(detail?: BdMainItem) {
    const index = detail ? this.items.findIndex(x => x.id === detail.id) : null;
    this.active = index;
  }

  @Watch('listSearchText')
  @Watch('filtered')
  resetPortions() {
    this.portion = [];
    this.addPortion();
  }

  setDetail(id: number) {
    oralModule.setDetail(id);
    appModule.zoomTo(id);
  }

  addPortion() {
    const items = this.getDisplayItems();
    const portionsLength = this.portion.length;
    const itemsLength = items.length;
    if (portionsLength < itemsLength) {
      const addLength = portionsLength + this.portionCount;
      const len = addLength > itemsLength ? itemsLength : addLength;
      for (let fry = portionsLength; fry < len; fry++) {
        const portion = items[fry];
        this.portion.push(portion);
      }
    }
  }
}
