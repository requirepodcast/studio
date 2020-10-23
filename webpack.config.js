const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  entry: {
    renderer: './src/app/js/renderer.js',
    login: './src/app/js/login.js',
    index: './src/app/js/index.js',
    pig: './src/app/js/pig.js',
    shortener: './src/app/js/shortener.js'
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'public/js'),
    publicPath: '/static/js/',
  },
  plugins: [new MiniCssExtractPlugin({ filename: '../css/[name].bundle.css' })],
  module: {
    rules: [
      {
        test: /\.s[ac]ss$/i,
        use: [
          // Creates `style` nodes from JS strings
          { loader: MiniCssExtractPlugin.loader, options: { publicPath: '/static/css/' } },
          // Translates CSS into CommonJS
          'css-loader',
          // Compiles Sass to CSS
          'sass-loader',
        ],
      },
    ],
  },
  resolve: {
    extensions: ['.js'], // Allow TypeScript files to be imported without file extension - import { foo } from './bar'
  },
  devtool: 'source-map',
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
};
