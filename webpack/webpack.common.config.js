const path = require('path');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

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

// // load the secrets
// var alias = {};

// var secretsPath = path.join(
//   __dirname,
//   'secrets.' + process.env.NODE_ENV + '.js',
// );

// if (fileSystem.existsSync(secretsPath)) {
//   alias['secrets'] = secretsPath;
// }

const output = {
  filename: '[name].js',
  path: path.join(__dirname, '..', 'dist'),
};

const config = {
  entry: {
    options: path.join(__dirname, '..', 'src', 'js', 'option', 'index.tsx'),
    background: path.join(__dirname, '..', 'src', 'js', 'background.ts'),
    content: path.join(__dirname, '..', 'src', 'js', 'content', 'content.tsx'),
  },
  target: 'web',
  output,
  module: {
    rules: [
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader'],
      },
      {
        test: /\.(jpg|jpeg|png|gif|)$/,
        use: 'file-loader?name=[name].[ext]',
      },
      {
        test: /\.html$/,
        loader: 'html-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.(ts|tsx)$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.svg$/,
        use: ['@svgr/webpack', 'url-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['*', '.tsx', '.ts', '.js', '.css'],
  },
  plugins: [
    // expose and write the allowed env vars on the compiled bundle
    new ProgressBarPlugin(),
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: '[name].bundle.css',
      chunkFilename: '[id].bundle.css',
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
