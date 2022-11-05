const { merge } = require('webpack-merge');
const common = require('./common.js');

const devConfig = merge(common, {
  devtool: 'inline-source-map',
  mode: 'development'
});

module.exports = devConfig;
