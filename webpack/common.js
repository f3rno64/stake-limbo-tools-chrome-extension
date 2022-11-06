const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

const SRC_DIR = path.join(__dirname, '..', 'src');
const DIST_DIR_JS = path.join(__dirname, '..', 'dist/js');

const commonConfig = {
  entry: {
    content: path.join(SRC_DIR, 'content.tsx'),
  },

  output: {
    path: DIST_DIR_JS,
    filename: '[name].js',
  },

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.scss$/,
        use: [
          { loader: 'style-loader' },
          { loader: 'css-modules-typescript-loader' },
          { loader: 'css-loader', options: { modules: true } },
          { loader: 'sass-loader' },
        ]
      }
    ],
  },

  resolve: {
    extensions: ['.scss', '.ts', '.tsx', '.js'],
  },

  plugins: [
    new CopyPlugin({
      patterns: [{
        from: ".",
        to: "../",
        context: "public"
      }],
    })
  ]
};

module.exports = commonConfig;
