const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const TSLintPlugin = require('tslint-webpack-plugin');
const { VueLoaderPlugin } = require('vue-loader');
const utils = require('./build/utils');

function resolve(dir) {
  return path.join(__dirname, '.', dir)
}


module.exports = (env, argv) => {

  const isProd = argv.mode === 'production';

  const rules = [
    {
      test: /\.vue$/,
      loader: 'vue-loader',
      options: {
        loaders: utils.cssLoaders({
          sourceMap: isProd ? false : true,
          extract: false
        })
      }
    },
    {
      test: /\.tsx?$/,
      loader: 'ts-loader',
      exclude: /node_modules/,
      options: {
        appendTsSuffixTo: [/\.vue$/],
      }
    },
    {
      test: /\.(png|jpg|gif|svg)$/,
      loader: 'file-loader',
      options: {
        name: '[name].[ext]?[hash]'
      }
    }
  ].concat(utils.styleLoaders({
    sourceMap: true,
    extract: false
  }));

  const config = {

    mode: 'development',

    devtool: isProd ? '#source-map' : 'eval-source-map',

    entry: './src/main.ts',

    output: {
      filename: '[name][hash:7].js',
    },

    resolve: {
      extensions: ['.ts', '.js', '.vue', '.json'],
      alias: {
        'vue$': 'vue/dist/vue.esm.js'
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
    plugins: [
      new VueLoaderPlugin(),
      new HtmlWebpackPlugin({
        template: 'index.html',
        filename: 'index.html'
      }),
      new TSLintPlugin({
        files: ['./src/**/*.ts']
      })
    ],
    performance: {
      hints: false
    },
    optimization: {
      splitChunks: {
        minSize: 1,
        chunks: "initial",
        name: "vendor"
      }
    }
  }
  return config;
}
