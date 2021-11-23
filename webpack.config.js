const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { VueLoaderPlugin } = require('vue-loader');
const VuetifyLoaderPlugin = require('vuetify-loader/lib/plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
// const CompressionPlugin = require('compression-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

let alias = {};
try {
  const { getAliases } = require('./@nextgis/scripts/aliases');
  alias = getAliases();
} catch (er) {
  // ignore
}

const sassLoaderOptions = {
  implementation: require('sass'),
  sassOptions: {
    // fiber: require('fibers'),
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
      // test: /\.jsx?$/,
      test: /\.(js|ts)x?$/,
      exclude: /node_modules/,
      use: {
        loader: 'babel-loader',
      },
    },
    // {
    //   test: /\.tsx?$/,
    //   loader: 'ts-loader',
    //   exclude: /node_modules/,
    //   options: {
    //     appendTsSuffixTo: [/\.vue$/],
    //   },
    // },
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
      use: [isProd ? MiniCssExtractPlugin.loader : 'style-loader', cssLoader],
    },
    {
      test: /\.sass$/,
      use: [
        isProd ? MiniCssExtractPlugin.loader : 'vue-style-loader',
        cssLoader,
        {
          loader: 'sass-loader',
          // Requires sass-loader@^8.0.0
          options: {
            ...sassLoaderOptions,
            // This is the path to your variables
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
        isProd ? MiniCssExtractPlugin.loader : 'vue-style-loader',
        cssLoader,
        {
          loader: 'sass-loader',
          // Requires sass-loader@^8.0.0
          options: {
            ...sassLoaderOptions,
            // This is the path to your variables
            additionalData: "@import '@/style/variables.scss';",
          },
        },
      ],
    },
  ];

  let plugins = [
    new ForkTsCheckerWebpackPlugin(),
    new ESLintPlugin({ fix: true, files: ['src/'], extensions: ['ts'] }),
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
  ];

  // const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  //   .BundleAnalyzerPlugin;
  // plugins.push(new BundleAnalyzerPlugin());

  if (isProd) {
    // const zopfli = require('@gfx/zopfli');
    plugins = plugins.concat([
      // new CompressionPlugin({
      //   cache: true,
      //   compressionOptions: {
      //     numiterations: 15,
      //   },
      //   algorithm(input, compressionOptions, callback) {
      //     return zopfli.gzip(input, compressionOptions, callback);
      //   },
      // }),
      new MiniCssExtractPlugin(),
    ]);
  }

  const config = {
    mode: argv.mode || 'development',
    context: path.join(__dirname, './'),
    devtool: isProd ? 'source-map' : 'inline-source-map',

    entry: './src/index.ts',

    output: {
      filename: '[name]-[hash:7].js',
    },

    resolve: {
      extensions: ['.ts', '.js', '.vue', '.json'],
      alias: {
        ...alias,
        vue$: 'vue/dist/vue.esm.js',
        '@': path.resolve(__dirname, 'src/'),
      },
    },
    module: {
      rules,
    },
    devServer: {
      historyApiFallback: true,
    },
    plugins,
    performance: {
      hints: false,
    },

    target: isProd ? 'browserslist' : 'web',
    optimization: {
      runtimeChunk: 'single',
      usedExports: true,
      splitChunks: {
        chunks: 'all',
        minSize: 10000,
        maxSize: 250000,
      },
    },
  };
  return config;
};
