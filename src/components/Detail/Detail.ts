import Vue from 'vue';
import Component from 'vue-class-component';
import { mapState } from 'vuex';
import { BdMainItem } from '../../api/ngw';

@Component({
  computed: mapState({
    detail: (state: any) => state.bdMain.detailItem && state.bdMain.detailItem.properties
  })
})
export class Detail extends Vue {

  detail: BdMainItem;

}
