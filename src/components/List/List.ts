import Vue from 'vue';
import Component from 'vue-class-component';
import { mapState } from 'vuex';
import { BdMainItem } from '../../api/ngw';

@Component({
  computed: mapState({
    items: (state: any) => state.bdMain.filtered.map((x) => x.properties),
    detail: (state: any) => state.bdMain.detailItem
  })
})
export class List extends Vue {

  detail: BdMainItem;

  setDetail(id: string) {

    if (this.detail && this.detail.id === id) {
      id = '';
    }
    this.$store.dispatch('bdMain/setDetail', id);
  }

}
