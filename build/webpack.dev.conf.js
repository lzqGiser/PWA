'use strict'
const utils = require('./utils')
const webpack = require('webpack')
const config = require('../config')
const merge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.conf')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')

async function getDevWebpackConfig () {
  let baseConfig = await baseWebpackConfig();
  let htmlTel = [];
  Object.keys(baseConfig.entry).forEach(function (name) {
    htmlTel.push(baseConfig.entry[name].replace(/.js/,'.html'));
    baseConfig.entry[name] = ['./build/dev-client'].concat(baseConfig.entry[name]);
  });

  let devConfig = merge(baseConfig, {
      module: {
        rules: utils.styleLoaders({ sourceMap: config.dev.cssSourceMap })
      },
      devtool: '#cheap-module-eval-source-map',
      plugins: [
        new webpack.DefinePlugin({
          'process.env': config.dev.env
        }),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
        new FriendlyErrorsPlugin()
      ]
    });

  htmlTel.forEach(function(item){
    let name = item.split('/')[3];
    devConfig.plugins.push(new HtmlWebpackPlugin({
      filename: name + '.html',
      template: item,
      inject:true,
      minify: {
        removeComments: true,
        collapseWhitespace: true
      },
      chunks: [name,'vendor','manifest']

    }))
  });
    return devConfig;
}

module.exports = async () => {
  return await getDevWebpackConfig();
};
