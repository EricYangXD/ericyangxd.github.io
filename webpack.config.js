const path = require('path');
const webpack = require('webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');
// const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

function srcPath(subdir) {
  return path.join(__dirname, '../src', subdir);
}

const PATHS = {
  src: srcPath(''),
  build: path.join(__dirname, '../dist/app'),
};

module.exports = {
  entry: PATHS.src + '/main.ts',
  target: 'node',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: {
          loader: 'awesome-typescript-loader',
          // loader: 'ts-loader',
          options: {
            transpileOnly: true,
          },
        },
        exclude: ['../frontend', './build-multimarket'],
      },
    ],
  },
  resolve: {
    extensions: ['.json', '.js', '.ts', '.tsx'],
    alias: {
      backend: srcPath(''),
      commons: srcPath('../mbbb-commons-carapp-mib3/src'),
      frontend: srcPath('../frontend/src'),
      'frontend-modules': srcPath('../frontend/node_modules'),
      'backendece-weather': srcPath('../mbbb-weather-carapp-mib3/src'),
      'frontendece-weather': srcPath('../mbbb-weather-carapp-mib3/frontend/src/app'),
      '@mib3-audi/gui-sdk': srcPath('../frontend/node_modules/@mib3-audi/gui-sdk'),
    },
  },
  output: {
    filename: 'app.js',
    path: PATHS.build,
  },
  plugins: [
    new UglifyJsPlugin({
      extractComments: true,
      parallel: true,
      cache: true,
    }),
    new CopyWebpackPlugin([{ from: '../src/config', to: 'config' }], {}),
    new webpack.optimize.OccurrenceOrderPlugin(),
    // new ForkTsCheckerWebpackPlugin(),
    new HardSourceWebpackPlugin(),
  ],
};
