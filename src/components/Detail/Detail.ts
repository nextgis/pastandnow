import { Vue, Component } from 'vue-property-decorator';
import { BdMainItemProperties, BdPhotoProperties } from '../../api/ngw';
import { oralModule } from '../../store/modules/oral';
import ShowMoreField from '../ShowMoreField/ShowMoreField.vue';

export interface Alias {
  text: string;
  value: string;
  type: 'NarratorLink';
  noHide?: boolean;
}

@Component
export class Detail extends Vue {
  url = '';
  more = true;
  bigImgSrc = '';
  dialog = false;

  components = {
    Story: ShowMoreField
  };

  get photos(): BdPhotoProperties[] {
    const photo = oralModule.photos.find((x: BdPhotoProperties) => {
      return x.link_small && x.id_obj === this.detail.id1;
    });
    return photo ? [photo] : [];
    // return oralModule.photos.filter((x: BdPhotoProperties) => x.id_obj === this.detail.id1);
  }

  get detail(): BdMainItemProperties {
    return oralModule.detailItem && oralModule.detailItem.properties;
  }

  get meta(): Alias[] {
    return oralModule.meta;
  }

  get noHideMeta() {
    return this.meta.filter(item => {
      const detail = this.getDetail(item.value);
      return detail && (!item.noHide ? this.more : true);
    });
  }

  get needMore(): boolean {
    return this.meta.some(x => {
      return !x.noHide ? this.getDetail(x.value) : true;
    });
  }

  getDetail(value: string) {
    const v = value as keyof BdMainItemProperties;
    return this.detail[v];
  }

  getText(alias: Alias) {
    if (alias.type) {
      const value = this.getDetail(alias.value);
      if (alias.type === 'NarratorLink') {
        const detail = this.getDetail(alias.value) as string;
        const names = value && detail && detail.split(',').map(x => x.trim());
        const links =
          this.detail.nar_codes &&
          this.detail.nar_codes.split(',').map(x => x.trim());
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
      } else if (alias.type === 'Mos') {
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
