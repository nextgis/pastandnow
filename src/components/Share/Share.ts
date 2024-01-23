import {
  mdiClipboard,
  mdiEmail,
  mdiFacebook,
  mdiTelegram,
  mdiTwitter,
  mdiVk,
} from '@mdi/js';
import { Clipboard } from '@nextgis/utils';
import { Component, Prop, Vue } from 'vue-property-decorator';
import VueSocialSharing from 'vue-social-sharing';

import type { OralFeature } from '../../interfaces';

Vue.use(VueSocialSharing);

@Component
export class Comments extends Vue {
  @Prop() readonly item!: OralFeature;
  description = '';
  snackbar = false;
  icons = {
    copy: mdiClipboard,
  };

  hashtags = 'pastandnow';

  networks = [
    {
      network: 'email',
      name: 'Email',
      icon: mdiEmail,
      color: '#333333',
    },
    {
      network: 'facebook',
      name: 'Facebook',
      icon: mdiFacebook,
      color: '#1877f2',
    },
    {
      network: 'telegram',
      name: 'Telegram',
      icon: mdiTelegram,
      color: '#0088cc',
    },
    {
      network: 'twitter',
      name: 'Twitter',
      icon: mdiTwitter,
      color: '#1da1f2',
    },
    {
      network: 'vk',
      name: 'Vk',
      icon: mdiVk,
      color: '#4a76a8',
    },
  ];
  get url(): string {
    return 'https://pastandnow.ru/?id=' + this.item.properties.id1;
  }
  get title(): string {
    return this.item.properties.name || '';
  }

  get quote(): string {
    return this.item.properties.name || '';
  }

  copyUrl(): void {
    const isCopy = Clipboard.copy(this.url);
    if (isCopy) {
      this.snackbar = true;
    }
  }
}
