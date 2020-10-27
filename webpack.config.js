const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { VueLoaderPlugin } = require('vue-loader');
const VuetifyLoaderPlugin = require('vuetify-loader/lib/plugin');
const CompressionPlugin = require('compression-webpack-plugin');

let alias = {};
try {
  const { getAliases } = require('./@nextgis/scripts/aliases');
  alias = getAliases();
} catch (er) {
  // ignore
}

// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const sassLoaderOptions = {
  implementation: require('sass'),
  sassOptions: {
    fiber: require('fibers'),
    // indentedSyntax: true, // optional
  },
};

const cssLoader = {
  loader: 'css-loader',
  options: {
    esModule: false,
  },
};

module.exports = (env, argv) => {
  const isProd = argv.mode === 'production';

  const rules = [
    {
      test: /\.vue$/,
      loader: 'vue-loader',
    },
    {
      enforce: 'pre',
      test: /\.(t|j)sx?$/,
      loader: 'eslint-loader',
      exclude: /node_modules|@nextgis/,
      include: [path.join(__dirname, 'src')],
      options: {
        fix: true,
      },
    },
    {
      test: /\.tsx?$/,
      loader: 'ts-loader',
      exclude: /node_modules/,
      options: {
        appendTsSuffixTo: [/\.vue$/],
      },
    },
    {
      test: /\.(png|jpg|gif|svg)$/,
      loader: 'file-loader',
      options: {
        name: '[name].[ext]?[hash]',
      },
    },
    {
      test: /\.(png|woff|woff2|eot|ttf)$/,
      use: {
        loader: 'url-loader',
        options: {
          limit: 50000,
          name: './fonts/[name].[ext]', // Output below ./fonts
        },
      },
    },
    {
      test: /\.css$/i,
      use: ['style-loader', cssLoader],
    },
    {
      test: /\.sass$/,
      use: [
        'vue-style-loader',
        cssLoader,
        {
          loader: 'sass-loader',
          // Requires sass-loader@^8.0.0
          options: {
            ...sassLoaderOptions,
            // This is the path to your variables
            // prependData: "@import '@/style/variables.scss'",
            additionalData: "@import '@/style/variables.scss'",
          },
        },
      ],
    },
    // SCSS has different line endings than SASS
    // and needs a semicolon after the import.
    {
      test: /\.scss$/,
      use: [
        'vue-style-loader',
        cssLoader,
        {
          loader: 'sass-loader',
          // Requires sass-loader@^8.0.0
          options: {
            ...sassLoaderOptions,
            // This is the path to your variables
            // prependData: "@import '@/style/variables.scss';",
            additionalData: "@import '@/style/variables.scss';",
          },
        },
      ],
    },
  ];

  let plugins = [
    new VueLoaderPlugin(),
    new HtmlWebpackPlugin({
      template: 'index.html',
      filename: 'index.html',
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(argv.mode || 'development'),
      __BROWSER__: true,
      __DEV__: !isProd,
    }),
    new VuetifyLoaderPlugin(),
    // new BundleAnalyzerPlugin()
  ];

  if (isProd) {
    const zopfli = require('@gfx/zopfli');
    plugins = plugins.concat([
      new CompressionPlugin({
        cache: true,
        compressionOptions: {
          numiterations: 15,
        },
        algorithm(input, compressionOptions, callback) {
          return zopfli.gzip(input, compressionOptions, callback);
        },
      }),
    ]);
  }

  const config = {
    mode: argv.mode || 'development',

    devtool: isProd ? '#source-map' : 'eval-source-map',

    entry: './src/index.ts',

    output: {
      filename: '[name]-[hash:7].js',
    },

    resolve: {
      extensions: ['.ts', '.js', '.vue', '.json'],
      alias: {
        ...alias,
        '@': path.resolve(__dirname, 'src/'),
        ...{
          vue$: 'vue/dist/vue.esm.js',
        },
      },
    },
    module: {
      rules,
    },
    devServer: {
      contentBase: './dist',
      historyApiFallback: true,
      noInfo: true,
    },
    plugins,
    performance: {
      hints: false,
    },
    optimization: {
      runtimeChunk: 'single',
      splitChunks: {
        chunks: 'all',
        minSize: 10000,
        maxSize: 250000,
      },
    },
  };
  return config;
};
