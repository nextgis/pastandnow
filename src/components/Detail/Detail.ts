import { Vue, Component } from 'vue-property-decorator';
import {
  BdMainItemProperties,
  BdPhotoProperties,
  LayerMetaItem,
} from '../../api/ngw';
import { oralModule } from '../../store/modules/oral';

@Component
export class Detail extends Vue {
  url = '';
  bigImgSrc = '';
  dialog = false;

  get photos(): BdPhotoProperties[] {
    const photo = oralModule.photos.find((x: BdPhotoProperties) => {
      return x.link_small && x.id_obj === this.detail.id1;
    });
    return photo ? [photo] : [];
  }

  get detail(): BdMainItemProperties {
    return oralModule.detailItem && oralModule.detailItem.properties;
  }

  get meta(): LayerMetaItem[] {
    return oralModule.meta;
  }

  get properties() {
    return this.meta.filter((x) => {
      const detail = this.getDetail(x.value);
      return detail && (x.detail ?? true);
    });
  }

  getDetail(value: string) {
    const v = value as keyof BdMainItemProperties;
    return this.detail[v];
  }

  getText(alias: LayerMetaItem) {
    if (alias.type) {
      const value = this.getDetail(alias.value);
      if (alias.type === 'NarratorLink') {
        const detail = this.getDetail(alias.value) as string;
        const names = value && detail && detail.split(',').map((x) => x.trim());
        const links =
          this.detail.nar_codes &&
          this.detail.nar_codes.split(',').map((x) => x.trim());
        return (
          names &&
          names
            .map((x, i) => {
              const link = links ? links[i] || links[0] : '';
              const href = (this.url + '/' + link).replace(
                /([^:]\/)\/+/g,
                '$1'
              );
              return `<a href="${href}">${x}</a>`;
            })
            .join(', ')
        );
      } else if (alias.type === 'Special') {
        return value === 1
          ? `<i
          aria-hidden="true"
          class="v-icon material-icons theme--light lighten-1--text"
          style="color: green;"
        >check
        </i>`
          : `<i
          aria-hidden="true"
          class="v-icon material-icons theme--light lighten-1--text"
          style="color: red;"
        >close
        </i>`;
      }
    }

    return this.getDetail(alias.value);
  }
}
