const { merge } = require('webpack-merge');
const common = require('./common.js');

const prodConfig = merge(common, {
  mode: 'production'
});

module.exports = prodConfig;
