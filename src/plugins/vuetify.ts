import { createVuetify } from 'vuetify';
import { aliases, mdi } from 'vuetify/iconsets/mdi-svg';

import type { ThemeDefinition } from 'vuetify';

export const lightTheme: ThemeDefinition = {
  dark: false,
  colors: {
    primary: '#005e7c',
    secondary: '#a0a8ab',
    surface: '#FFFFFF',
    'surface-variant': '#f1f4f5',
    'on-surface-variant': 'rgba(0,0,0,.5)',
    error: '#B00020',
    info: '#2196F3',
    success: '#4CAF50',
    warning: '#FB8C00',
  },
};

export const darkTheme: ThemeDefinition = {
  dark: true,
  colors: {
    primary: '#005e7c',
    secondary: '#a0a8ab',
    surface: '#121212',
    'surface-variant': '#1E1E1E',
    'on-surface-variant': 'rgba(255,255,255,.7)',
    error: '#CF6679',
    info: '#2196F3',
    success: '#4CAF50',
    warning: '#FB8C00',
  },
};

export default createVuetify({
  theme: {
    defaultTheme: 'light',
    themes: {
      light: lightTheme,
      dark: darkTheme,
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
      density: 'comfortable',
    },
    VTextField: {
      variant: 'outlined',
      density: 'comfortable',
    },
    VSelect: {
      variant: 'outlined',
      density: 'comfortable',
    },
    VList: {
      density: 'comfortable',
    },
    VChip: {
      size: 'small',
    },
  },
});
