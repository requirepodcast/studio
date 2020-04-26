const path = require('path');

module.exports = {
  entry: { index: './src/app/js/index.js', login: './src/app/js/login.js' },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'public'),
  },
  module: {
    rules: [
      {
        test: /\.s[ac]ss$/i,
        use: [
          // Creates `style` nodes from JS strings
          'style-loader',
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
};
