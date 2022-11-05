const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

const SRC_DIR = path.join(__dirname, '..', 'src');
const DIST_DIR_JS = path.join(__dirname, '..', 'dist/js');

const commonConfig = {
  entry: {
    popup: path.join(SRC_DIR, 'components/Popup/Popup.tsx'),
    content: path.join(SRC_DIR, 'content/index.ts'),
  },

  output: {
    path: DIST_DIR_JS,
    filename: '[name].js',
  },

  optimization: {
    splitChunks: {
      name: 'vendor',
      chunks(chunk) {
        return chunk.name !== 'background';
      }
    },
  },

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },

  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
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
