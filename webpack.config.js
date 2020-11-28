const path = require('path');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
//const TerserPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const fileSystem = require('fs');
//(env = require('./utils/env')),
//const  CleanWebpackPlugin = require('clean-webpack-plugin').CleanWebpackPlugin,
const CopyPlugin = require('copy-webpack-plugin');
const WriteFilePlugin = require('write-file-webpack-plugin');

// load the secrets
var alias = {};

var secretsPath = path.join(
  __dirname,
  'secrets.' + process.env.NODE_ENV + '.js'
);

var fileExtensions = [
  'jpg',
  'jpeg',
  'png',
  'gif',
  'eot',
  'otf',
  'svg',
  'ttf',
  'woff',
  'woff2',
];

if (fileSystem.existsSync(secretsPath)) {
  alias['secrets'] = secretsPath;
}
const buildPath = 'build';
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
  entry: {
    popup: path.join(__dirname, 'src', 'js', 'popup.js'),
    options: path.join(__dirname, 'src', 'js', 'options.js'),
    background: path.join(__dirname, 'src', 'js', 'background.js'),
    content: path.join(__dirname, 'src', 'js', 'content.js'),
  },
  devtool: 'inline-source-map',
  output: {
    path: path.join(__dirname, 'build'),
    filename: '[name].bundle.js',
  },
  module: {
    rules: [
      // {
      //   test: /\.css$/,
      //   loader: 'style-loader!css-loader',
      //   exclude: /node_modules/,
      // },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
          // 'sass-loader',
        ],
      },
      {
        test: new RegExp('.(' + fileExtensions.join('|') + ')$'),
        loader: 'file-loader?name=[name].[ext]',
        exclude: /node_modules/,
      },
      {
        test: /\.html$/,
        loader: 'html-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.(js|jsx)$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    alias: alias,
    extensions: fileExtensions
      .map((extension) => '.' + extension)
      .concat(['.jsx', '.js', '.css']),
  },
  plugins: [
    // clean the build folder
    // new CleanWebpackPlugin(),
    // expose and write the allowed env vars on the compiled bundle
    //new webpack.EnvironmentPlugin(['NODE_ENV']),
    new ProgressBarPlugin(),
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: '[name].bundle.css',
      chunkFilename: '[id].bundle.css',
    }),
    new CopyPlugin({
      patterns: [
        {
          from: 'src/manifest.json',
          to: 'manifest.json',
          // transform(content, absoluteFrom) {
          //   const jsonObject = JSON.parse(content.toString());
          //   jsonObject.externally_connectable = {
          //     matches: ['https://localhost:5001/callback/*'],
          //   };
          //   jsonObject.permissions.push('https://localhost:5001/api/*');
          //   return Buffer.from(JSON.stringify(jsonObject));
          // },
        },
      ],
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src', 'popup.html'),
      filename: 'popup.html',
      chunks: ['popup'],
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src', 'options.html'),
      filename: 'options.html',
      chunks: ['options'],
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src', 'background.html'),
      filename: 'background.html',
      chunks: ['background'],
    }),
    new WriteFilePlugin(),
    // new MiniCssExtractPlugin({
    //   filename: '[name].[hash].css',
    //   chunkFilename: '[id].[hash].css',
    // }),
  ],
  // optimization: {
  //   minimizer: [
  //     // new TerserPlugin({
  //     //   sourceMap: true,
  //     //   parallel: true,
  //     //   cache: true,
  //     // }),
  //     new OptimizeCSSAssetsPlugin({}),
  //   ],
  //   // splitChunks: {
  //   //   chunks: 'all',
  //   // },
  // },
};

// if (env.NODE_ENV === 'development') {
//   options.devtool = 'cheap-module-eval-source-map';
// }

module.exports = options;
