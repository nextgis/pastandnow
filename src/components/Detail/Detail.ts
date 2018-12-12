import { Vue, Component } from 'vue-property-decorator';
import { BdMainItemProperties, BdPhotoProperties } from '../../api/ngw';
import ShowMoreField from '../ShowMoreField/ShowMoreField.vue';

interface Alias {
  text: string;
  value: string;
  type: 'NarratorLink';
  noHide?: boolean;
}

@Component
export class Detail extends Vue {

  url: string = '';
  more = false;
  bigImgSrc: string = '';
  dialog = false;

  components = {
    Story: ShowMoreField
  };

  get photos(): BdPhotoProperties[] {
    return this.$store.state.bdMain.photos.filter((x: BdPhotoProperties) => x.id_obj === this.detail.id1);
  }

  get detail(): BdMainItemProperties {
    return this.$store.state.bdMain.detailItem && this.$store.state.bdMain.detailItem.properties;
  }

  get meta(): Alias[] {
    return this.$store.state.bdMain.meta;
  }

  get needMore(): boolean {
    return this.meta.some((x) => {
      return !x.noHide ? this.detail[x.value] : true;
    });
  }

  getText(alias: Alias) {
    if (alias.type) {
      const value = this.detail[alias.value];
      if (alias.type === 'NarratorLink') {
        const names = value && this.detail[alias.value].split(',').map((x) => x.trim());
        const links = this.detail.nar_codes && this.detail.nar_codes.split(',').map((x) => x.trim());
        return names.map((x, i) => {
          const link = links ? links[i] || links[0] : '';
          const href = (this.url + '/' + link).replace(/([^:]\/)\/+/g, '$1');
          return `<a href="${href}">${x}</a>`;
        }).join(', ');
      } else if (alias.type === 'Mos') {
        return value === 1 ? `<i
          aria-hidden="true"
          class="v-icon material-icons theme--light lighten-1--text"
          style="color: green;"
        >check
        </i>` : `<i
          aria-hidden="true"
          class="v-icon material-icons theme--light lighten-1--text"
          style="color: red;"
        >close
        </i>`;
      }
    }

    return this.detail[alias.value];

  }
}
