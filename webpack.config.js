const path = require('path');
// const HtmlWebpackPlugin = require('html-webpack-plugin');
// const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: './index.js',
  output: {
    filename: 'index_compiled.js',
    path: path.resolve(__dirname, ''),
  },
  mode: 'development',
  experiments: {
    topLevelAwait: true,
  }
};