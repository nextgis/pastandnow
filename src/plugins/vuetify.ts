import 'vuetify/styles';

import { createVuetify } from 'vuetify';
import { aliases, mdi } from 'vuetify/iconsets/mdi-svg';

import type { ThemeDefinition } from 'vuetify';

const light: ThemeDefinition = {
  dark: false,
  colors: {
    primary: '#005e7c',
    // background: '#FFFFFF',
    // surface: '#FFFFFF',
    // 'surface-bright': '#FFFFFF',
    // 'surface-light': '#EEEEEE',
    // 'surface-variant': '#424242',
    // 'on-surface-variant': '#EEEEEE',
    // 'primary-darken-1': '#1F5592',
    // secondary: '#48A9A6',
    // 'secondary-darken-1': '#018786',
    // error: '#B00020',
    // info: '#2196F3',
    // success: '#4CAF50',
    // warning: '#FB8C00',
  },
  // Available variables https://github.com/vuetifyjs/vuetify/blob/master/packages/vuetify/src/styles/settings/_variables.scss
  variables: {
    'border-radius-root': '2px',
  },
};
export default createVuetify({
  theme: {
    defaultTheme: 'light',
    themes: {
      light,
    },
  },
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi,
    },
  },
  defaults: {
    VBtn: {
      variant: 'text',
      density: 'compact',
      size: 'small',
    },
    VTextField: {
      variant: 'outlined',
      density: 'compact',
      size: 'small',
    },
    VSelect: {
      variant: 'outlined',
      density: 'compact',
      size: 'small',
    },
    VList: {
      density: 'compact',
      size: 'small',
    },
    VChip: {
      size: 'small',
    },
  },
});
