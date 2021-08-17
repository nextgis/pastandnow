import { Vue, Component } from 'vue-property-decorator';
import { mdiClose } from '@mdi/js';
// @ts-ignore add types
import Urlify from 'urlify';
import { oralModule } from '../../store/modules/oral';

import { isValidUrl } from '../../utils/isValidUrl';
import { appModule } from '../../store/modules/app';
import Comments from '../Comments/Comments.vue';

import type {
  OralProperties,
  OralPhotoProperties,
  LayerMetaItem,
} from '../../interfaces';

const urlify = Urlify.create({ toLower: true });

@Component({ components: { Comments } })
export class Detail extends Vue {
  url = 'https://pastandnow.ru';
  dialog = false;
  selectedPhoto = 0;

  svg = { close: mdiClose };

  get photos(): OralPhotoProperties[] {
    const photo = oralModule.photos.find((x: OralPhotoProperties) => {
      return this.detail && x.link_small && x.id_obj === this.detail.id1;
    });
    return photo ? [photo] : [];
  }

  get id(): string | number | false | undefined {
    return oralModule.detailItem && oralModule.detailItem.properties.id1;
  }

  get detail(): OralProperties | false {
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

  getDetail(key: string): undefined | string | number | null {
    const v = key as keyof OralProperties;
    let value = this.detail ? this.detail[v] : undefined;
    if (typeof value === 'string') {
      value = value.replace(/\[([^[\]]*)\]\((.*?)\)/gm, (m, text, url) => {
        let url_: string | null = null;
        if (/^#\d+$/.test(url)) {
          const id1 = url.replace('#', '');
          url_ = window.location.origin + '/?id=' + id1;
          (window as any).openDetail = async (e: string) => {
            const feature = await oralModule.setDetailById(Number(e));
            feature && appModule.zoomTo(Number(feature.properties.id1));
          };
          return `<a target="_blank" onclick="return openDetail(${id1})">${
            text || url
          }</a>`;
        }
        if (isValidUrl(url)) {
          url_ = url;
        }
        if (url_) {
          return `<a href="${url_}" target="_blank">${text || url}</a>`;
        }
        return m;
      });
    }
    return value;
  }

  getText(alias: LayerMetaItem): string | number | undefined | null {
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
                  '$1',
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
