import { Vue, Component, Prop } from 'vue-property-decorator';
import VueSocialSharing from 'vue-social-sharing';
import {
  mdiClipboard,
  mdiEmail,
  mdiFacebook,
  mdiTelegram,
  mdiTwitter,
  mdiVk,
} from '@mdi/js';

import { Clipboard } from '@nextgis/utils';

import type { OralFeature } from '../../interfaces';

Vue.use(VueSocialSharing);

@Component
export class Comments extends Vue {
  @Prop() readonly item!: OralFeature;

  icons = {
    copy: mdiClipboard,
  };
  get url(): string {
    return 'https://pastandnow.ru/?id=' + this.item.id;
  }
  title = '';
  description = '';
  snackbar = false;
  get quote(): string {
    return this.item.properties.name || '';
  }
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

  copyUrl(): void {
    const isCopy = Clipboard.copy(this.url);
    if (isCopy) {
      this.snackbar = true;
    }
  }
}
