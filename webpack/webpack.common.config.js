const path = require('path');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const WriteFilePlugin = require('write-file-webpack-plugin');
const fileSystem = require('fs');

// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
//   .BundleAnalyzerPlugin;

var fileExtensions = [
  'jpg',
  'jpeg',
  'png',
  'gif',
  'eot',
  'otf',
  'ttf',
  'woff',
  'woff2',
];

// load the secrets
var alias = {};

var secretsPath = path.join(
  __dirname,
  'secrets.' + process.env.NODE_ENV + '.js',
);

if (fileSystem.existsSync(secretsPath)) {
  alias['secrets'] = secretsPath;
}

const output = {
  path: path.join(__dirname, '..', 'build'),
};

const config = {
  entry: {
    popup: path.join(__dirname, '..', 'src', 'js', 'popup', 'popup.js'),
    options: path.join(__dirname, '..', 'src', 'js', 'options.js'),
    background: path.join(__dirname, '..', 'src', 'js', 'background.js'),
    content: path.join(__dirname, '..', 'src', 'js', 'content', 'content.js'),
  },
  output,
  module: {
    rules: [
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader'],
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
      {
        test: /\.svg$/,
        use: ['@svgr/webpack'],
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
    // expose and write the allowed env vars on the compiled bundle
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
        },
      ],
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, '..', 'src', 'popup.html'),
      filename: 'popup.html',
      chunks: ['popup'],
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, '..', 'src', 'options.html'),
      filename: 'options.html',
      chunks: ['options'],
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, '..', 'src', 'background.html'),
      filename: 'background.html',
      chunks: ['background'],
    }),
    new WriteFilePlugin(),
    // new BundleAnalyzerPlugin(),
  ],
};
module.exports = config;
