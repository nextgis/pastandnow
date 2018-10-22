import { Vue, Component } from 'vue-property-decorator';
import { BdMainItemProperties } from '../../api/ngw';

@Component
export class Detail extends Vue {

  get detail(): BdMainItemProperties {
    return this.$store.state.bdMain.detailItem && this.$store.state.bdMain.detailItem.properties;
  }

  get meta(): Array<{text: string, value: string}> {
    return this.$store.state.bdMain.meta;
  }

  getKeyAlias(key) {
    if (this.meta) {
      const alias = this.meta.find((x) => x.value === key);
      if (alias) {
        return alias.text;
      }
    }

    return key;
  }
}
