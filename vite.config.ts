import { fileURLToPath, URL } from 'node:url';

import vue from '@vitejs/plugin-vue';
import Fonts from 'unplugin-fonts/vite';
import { defineConfig } from 'vite';
// import eslint from 'vite-plugin-eslint';
import vuetify from 'vite-plugin-vuetify';
// import checker from 'vite-plugin-checker';

import getAliases from './@nextgis/packages/build-tools/lib/aliases';

const baseAliases = getAliases();
const vueAliases = getAliases(
  fileURLToPath(new URL('@nextgis_vue/packages', import.meta.url)),
);
const aliases = { ...baseAliases, ...vueAliases } as Record<string, string>;

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const isProd = mode === 'production';

  return {
    plugins: [
      vue(),
      vuetify({
        styles: {
          configFile: fileURLToPath(
            new URL('./src/styles/settings.scss', import.meta.url),
          ),
        },
      }),
      // checker({
      //   typescript: {
      //     // tsconfigPath: 'tsconfig.check.json',
      //   },
      // }),
      // eslint({
      //   fix: true,
      //   include: ['src/**/*.ts', 'src/**/*.vue'],
      //   cache: false,
      // }),
      Fonts({
        google: {
          families: [
            { name: 'Roboto', styles: 'wght@400;500;700' },
            { name: 'Material Symbols Outlined' },
          ],
        },
      }),
    ],

    resolve: {
      alias: {
        ...aliases,
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
      extensions: ['.js', '.json', '.jsx', '.mjs', '.ts', '.tsx', '.vue'],
    },

    css: { preprocessorOptions: { scss: { api: 'modern-compiler' } } },

    build: {
      sourcemap: true,

      rollupOptions: {
        output: { manualChunks: { vendor: ['vue', 'vuetify'] } },
      },
      chunkSizeWarningLimit: 250,
      ...(isProd && {
        minify: 'terser',
        terserOptions: {
          compress: { drop_console: true, drop_debugger: true },
        },
      }),
    },

    server: {
      historyApiFallback: true,
      port: 8080,

      hmr: { overlay: true },
    },

    define: {
      __BROWSER__: true,
      __DEV__: !isProd,
      'process.env.NODE_ENV': JSON.stringify(mode),
    },
  };
});
