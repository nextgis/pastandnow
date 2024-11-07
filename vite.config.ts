// import path from 'node:path';
import { URL, fileURLToPath } from 'node:url';

import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';
// import eslint from 'vite-plugin-eslint';
import vuetify from 'vite-plugin-vuetify';

// import getAliases from './@nextgis/packages/build-tools/lib/aliases';

// const baseAliases = getAliases();
// const vueAliases = getAliases(path.resolve(__dirname, '@nextgis_vue/packages'));
// const aliases = { ...baseAliases, ...vueAliases };

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const isProd = mode === 'production';

  return {
    plugins: [
      vue(),
      vuetify({
        // styles: { configFile: 'src/style/variables.scss' },
      }),
      // eslint({
      //   fix: true,
      //   include: ['src/**/*.ts', 'src/**/*.vue'],
      //   cache: false,
      // }),
    ],

    resolve: {
      alias: {
        // ...aliases,
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
      extensions: ['.js', '.json', '.jsx', '.mjs', '.ts', '.tsx', '.vue'],
    },

    // css: {
    //   preprocessorOptions: {
    //     scss: {
    //       additionalData: '@import "@/style/variables.scss";',
    //     },
    //     sass: {
    //       additionalData: '@import "@/style/variables.scss"',
    //     },
    //   },
    // },

    build: {
      sourcemap: true,

      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['vue', 'vuetify'],
          },
        },
      },
      chunkSizeWarningLimit: 250,
      ...(isProd && {
        minify: 'terser',
        terserOptions: {
          compress: {
            drop_console: true,
            drop_debugger: true,
          },
        },
      }),
    },

    server: {
      historyApiFallback: true,
      port: 8080,

      hmr: {
        overlay: true,
      },
    },

    define: {
      __BROWSER__: true,
      __DEV__: !isProd,
      'process.env.NODE_ENV': JSON.stringify(mode),
    },
  };
});
