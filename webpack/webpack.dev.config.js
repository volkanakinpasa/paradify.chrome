const { merge } = require('webpack-merge');
const common = require('./webpack.common.config');
const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const publicPath = '/';
const PORT = 8080;

var options = {
  // entry: {
  //   'content-test': path.join(
  //     __dirname,
  //     '..',
  //     'src',
  //     'js',
  //     'content-test',
  //     'index.tsx',
  //   ),
  // },
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
  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: 'src/manifest.json',
          to: 'manifest.json',
          transform(content, absoluteFrom) {
            const jsonObject = JSON.parse(content.toString());

            jsonObject.externally_connectable = {
              matches: ['http://localhost:8080/*'],
            };
            jsonObject.permissions.push('http://localhost:8080/*');
            // jsonObject.content_scripts[0].matches.push(
            //   'chrome-extension://khpifnkcammomhfjcpomgmgamgpkepdo/content-test.html',
            // );
            // jsonObject.content_scripts[0].js.push('content-test.bundle.js');
            // jsonObject.content_scripts[0].css.push('content-test.bundle.css');

            return Buffer.from(JSON.stringify(jsonObject));
          },
        },
      ],
    }),
    // new HtmlWebpackPlugin({
    //   template: path.join(
    //     __dirname,
    //     '..',
    //     'src',
    //     'js',
    //     // 'content-test',
    //     // 'content-test.html',
    //   ),
    //   filename: 'content-test.html',
    //   chunks: ['content-test'],
    // }),
  ],
};

const serverConfig = merge(common, options);
module.exports = serverConfig;
