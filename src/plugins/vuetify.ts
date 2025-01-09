import { createVuetify } from 'vuetify';
import { aliases, mdi } from 'vuetify/iconsets/mdi-svg';

import type { ThemeDefinition } from 'vuetify';

import 'vuetify/styles';

const light: ThemeDefinition = {
  dark: false,
  colors: {
    primary: '#005e7c',
    grey: '#808080',
    typographyGrey: 'a0a8ab',
  },
};
export default createVuetify({
  theme: {
    defaultTheme: 'light',
    themes: {
      light,
      dark: {
        dark: true,
        colors: { 'surface-variant': '#fff' },
      },
    },
  },
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi,
    },
  },
});
