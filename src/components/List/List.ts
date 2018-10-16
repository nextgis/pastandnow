import { BdMainItem, BdMainItemProperties } from '../../api/ngw';
import { Vue, Component } from 'vue-property-decorator';

@Component
export class List extends Vue {

  get items(): BdMainItemProperties[] {
    return this.$store.state.bdMain.filtered.map((x) => x.properties);
  }

  get detail(): BdMainItem {
    return this.$store.state.bdMain.detailItem;
  }

  setDetail(id: string) {
    this.$store.dispatch('bdMain/setDetail', id);
  }

}
