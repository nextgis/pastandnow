import { Vue, Component } from 'vue-property-decorator';
import { BdMainItemProperties } from '../../api/ngw';

interface Alias {
  text: string;
  value: string;
  type: 'NarratorLink';
}

@Component
export class Detail extends Vue {

  url: string = '';

  get detail(): BdMainItemProperties {
    return this.$store.state.bdMain.detailItem && this.$store.state.bdMain.detailItem.properties;
  }

  get meta(): Alias[] {
    return this.$store.state.bdMain.meta;
  }

  getText(alias: Alias) {
    if (alias.type && alias.type === 'NarratorLink') {
      const value = this.detail[alias.value];
      const names = value && this.detail[alias.value].split(',').map((x) => x.trim());
      const links = this.detail.nar_codes && this.detail.nar_codes.split(',').map((x) => x.trim());
      return names.map((x, i) => {
        const link = links ? links[i] || links[0] : '';
        const href = (this.url + '/' + link).replace(/([^:]\/)\/+/g, '$1');
        return `<a href="${href}">${x}</a>`;
      }).join(', ');
    }
    return this.detail[alias.value];
  }
}
