const { merge } = require('webpack-merge');
const common = require('./webpack.common.config');
const path = require('path');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

var options = {
  mode: 'production',

  output: {
    filename: '[name].bundle.js',
  },
  plugins: [new CleanWebpackPlugin()],
  optimization: {
    minimizer: [new OptimizeCSSAssetsPlugin({})],
  },
};

const serverConfig = merge(common, options);
module.exports = serverConfig;
