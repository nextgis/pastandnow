import { BdMainItem, BdMainItemProperties } from '../../api/ngw';
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component
export class List extends Vue {

  portionCount = 30;

  portion = [];

  get items(): BdMainItemProperties[] {
    return this.$store.getters['bdMain/sortFeatures'].map((x) => x.properties);
  }

  get detail(): BdMainItem {
    return this.$store.state.bdMain.detailItem;
  }

  mounted() {
    this.addPortion();
    this.$store.watch((state) => state.bdMain.filtered, (_items) => {
      this.portion = [];
      this.addPortion();
    });
  }

  setDetail(id: string) {
    this.$store.dispatch('bdMain/setDetail', id);
  }

  addPortion() {
    const items = this.items;
    const portionsLength = this.portion.length;
    const itemsLength = items.length;
    if (portionsLength < itemsLength) {
      const addLength = portionsLength + this.portionCount;
      const len = addLength > itemsLength ? itemsLength : addLength;
      for (let fry = portionsLength; fry < len; fry++) {
        this.portion.push(items[fry]);
      }
    }
  }

}
