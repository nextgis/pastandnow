import { Vue, Component } from 'vue-property-decorator';
import { mdiClose } from '@mdi/js';
// @ts-ignore add types
import Urlify from 'urlify';
import {
  BdMainItemProperties,
  BdPhotoProperties,
  LayerMetaItem,
} from '../../api/interfaces';
import { oralModule } from '../../store/modules/oral';

const urlify = Urlify.create({ toLower: true });

@Component
export class Detail extends Vue {
  url = 'https://pastandnow.ru';
  dialog = false;
  selectedPhoto = 0;

  svg = { close: mdiClose };

  get photos(): BdPhotoProperties[] {
    const photo = oralModule.photos.find((x: BdPhotoProperties) => {
      return this.detail && x.link_small && x.id_obj === this.detail.id1;
    });
    return photo ? [photo] : [];
  }

  get detail(): BdMainItemProperties | false {
    return oralModule.detailItem && oralModule.detailItem.properties;
  }

  get meta(): LayerMetaItem[] {
    return oralModule.meta;
  }

  get properties(): LayerMetaItem[] {
    return this.meta.filter((x) => {
      const detail = this.getDetail(x.value);
      return detail && (x.detail ?? true);
    });
  }

  getDetail(value: string): undefined | string | number {
    const v = value as keyof BdMainItemProperties;
    return this.detail ? this.detail[v] : undefined;
  }

  getText(alias: LayerMetaItem): string | number | undefined {
    if (alias.type) {
      const value = this.getDetail(alias.value);
      if (alias.type === 'NarratorLink') {
        const detail = this.getDetail(alias.value);
        if (value && typeof detail === 'string') {
          const names = detail.split(',').map((x) => x.trim());
          // const links: string[] = this._getNarLinks();
          const links: string[] = this._getAuthorLinks(names);
          return (
            names &&
            names
              .map((x, i) => {
                const link = links ? links[i] || links[0] : '';
                const href = (this.url + '/' + link).replace(
                  /([^:]\/)\/+/g,
                  '$1'
                );
                return `<a href="${href}" target="_blank">${x}</a>`;
              })
              .join(', ')
          );
        }
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

  private _getAuthorLinks(names: string[]): string[] {
    return names.map((x) => urlify(x.replace(/\*/g, '0')));
  }

  private _getNarLinks(): string[] {
    return this.detail && this.detail.nar_codes
      ? this.detail.nar_codes.split(',').map((x) => x.trim())
      : [];
  }
}
