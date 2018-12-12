import { BdMainItem, BdMainItemProperties } from '../../api/ngw';
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component
export class List extends Vue {

  portionCount = 30;

  portion = [];

  get listSearchText(): string {
    return this.$store.state.app.listSearchText;
  }

  get items(): BdMainItemProperties[] {
    return this.$store.getters['bdMain/sortFeatures'].map((x) => x.properties);
  }

  get detail(): BdMainItem {
    return this.$store.state.bdMain.detailItem;
  }

  mounted() {
    this.addPortion();
    this.$store.watch((state) => state.bdMain.filtered, (_items) => {
      this.resetPortions();
    });
    this.$store.watch((state) => state.app.listSearchText, (value) => {
      if (value && value.length > 2) {
        this.resetPortions();
      }
    });
  }

  getDisplayItems(): BdMainItemProperties[] {
    if (this.listSearchText && this.listSearchText.length > 2) {
      const filteredItems = this.items.filter((item) => {
        for (const p in item) {
          if (item.hasOwnProperty(p)) {
            const ok = String(item[p]).toLowerCase().indexOf(this.listSearchText.toLowerCase()) !== -1;
            if (ok) {
              return true;
            }
          }
        }
        return false;
      });
      return filteredItems;
    } else {
      return this.items;
    }
  }

  setDetail(id: string) {
    this.$store.dispatch('bdMain/setDetail', id);
    this.$store.dispatch('app/zoomTo', id);
  }

  resetPortions() {
    this.portion = [];
    this.addPortion();
  }

  addPortion() {
    const items = this.getDisplayItems();
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
