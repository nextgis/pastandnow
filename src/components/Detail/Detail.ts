import { Vue, Component } from 'vue-property-decorator';
import { BdMainItemProperties } from '../../api/ngw';

@Component
export class Detail extends Vue {

  get detail(): BdMainItemProperties {
    return this.$store.state.bdMain.detailItem && this.$store.state.bdMain.detailItem.properties;
  }

}
