const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { VueLoaderPlugin } = require('vue-loader');
const VuetifyLoaderPlugin = require('vuetify-loader/lib/plugin');

let alias = {};
try {
  const { getAliases } = require('./nextgisweb_frontend/build/aliases');
  alias = getAliases();
} catch (er) {
  // ignore
}

// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const sassLoaderOptions = {
  implementation: require('sass')
  // indentedSyntax: true // optional
};

module.exports = (env, argv) => {
  const isProd = argv.mode === 'production';

  const rules = [
    {
      test: /\.vue$/,
      loader: 'vue-loader'
    },
    {
      enforce: 'pre',
      test: /\.(t|j)sx?$/,
      loader: 'eslint-loader',
      exclude: /node_modules/,
      include: [path.join(__dirname, 'src')],
      options: {
        fix: true
      }
    },
    {
      test: /\.tsx?$/,
      loader: 'ts-loader',
      exclude: /node_modules/,
      options: {
        appendTsSuffixTo: [/\.vue$/]
      }
    },
    {
      test: /\.(png|jpg|gif|svg)$/,
      loader: 'file-loader',
      options: {
        name: '[name].[ext]?[hash]'
      }
    },
    {
      test: /\.(png|woff|woff2|eot|ttf)$/,
      use: {
        loader: 'url-loader',
        options: {
          limit: 50000,
          name: './fonts/[name].[ext]' // Output below ./fonts
        }
      }
    },
    {
      test: /\.css$/i,
      use: ['style-loader', 'css-loader']
    },
    {
      test: /\.s(c|a)ss$/,
      use: [
        'vue-style-loader',
        'css-loader',
        {
          loader: 'sass-loader',
          options: sassLoaderOptions
        }
      ]
    }
  ];

  let plugins = [
    new VueLoaderPlugin(),
    new HtmlWebpackPlugin({
      template: 'index.html',
      filename: 'index.html'
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(argv.mode || 'development')
    }),
    new VuetifyLoaderPlugin()
    // new BundleAnalyzerPlugin()
  ];

  if (isProd) {
    plugins = plugins.concat([]);
  }

  const config = {
    mode: argv.mode || 'development',

    devtool: isProd ? '#source-map' : 'eval-source-map',

    entry: './src/index.ts',

    output: {
      filename: '[name]-[hash:7].js'
    },

    resolve: {
      extensions: ['.ts', '.js', '.vue', '.json'],
      alias: {
        ...alias,
        ...{
          vue$: 'vue/dist/vue.esm.js'
        }
      }
    },
    module: {
      rules
    },
    devServer: {
      contentBase: './dist',
      historyApiFallback: true,
      noInfo: true
    },
    plugins,
    performance: {
      hints: false
    },
    optimization: {
      runtimeChunk: 'single',
      splitChunks: {
        chunks: 'all',
        minSize: 10000,
        maxSize: 250000
      }
    }
  };
  return config;
};
