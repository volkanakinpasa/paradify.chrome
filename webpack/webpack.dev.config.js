const { merge } = require('webpack-merge');
const common = require('./webpack.common.config');
const path = require('path');
const publicPath = '/';
const PORT = 8080;

var options = {
  devServer: {
    hot: true,
    disableHostCheck: true,
    historyApiFallback: true,
    index: 'popup.html',
    port: PORT,
    publicPath,
  },
  mode: process.env.NODE_ENV || 'development',
  devtool: 'inline-source-map',
  output: {
    filename: '[name].bundle.js',
  },
  plugins: [],
};

const serverConfig = merge(common, options);
module.exports = serverConfig;
