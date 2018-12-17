'use strict'
const path = require('path')
const utils = require('./utils')
const webpack = require('webpack')
const config = require('../config')
const merge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.conf')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')

const env = config.build.env;

async function getPubWebpackConfig () {
  let baseConfig = await baseWebpackConfig();

  let htmlTel = [];
  Object.keys(baseConfig.entry).forEach(function (name) {

    let fileSrc = baseConfig.entry[name].replace(/.js/,'.html')
    htmlTel.push(fileSrc.substring(2));

  });

  const webpackConfig = merge(baseConfig, {
    module: {
      rules: utils.styleLoaders({
        sourceMap: config.build.productionSourceMap,
        extract: true
      })
    },
    devtool: config.build.productionSourceMap ? '#source-map' : false,
    output: {
      path: config.build.assetsRoot,  // dist
      filename: utils.assetsPath('js/[name].[chunkhash].js'),
      chunkFilename: utils.assetsPath('js/[id].[chunkhash].js')
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env': env
      }),
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: false
        },
        sourceMap: true
      }),
      new ExtractTextPlugin({
        filename: utils.assetsPath('css/[name].[contenthash].css')
      }),
      new OptimizeCSSPlugin({
        cssProcessorOptions: {
          safe: true
        }
      }),
      new webpack.HashedModuleIdsPlugin(),
      new webpack.optimize.CommonsChunkPlugin({
        name: 'vendor',
        minChunks: function (module) {
          // any required modules inside node_modules are extracted to vendor
          return (
            module.resource &&
            /\.js$/.test(module.resource) &&
            module.resource.indexOf(
              path.join(__dirname, '../node_modules')
            ) === 0
          )
        }
      }),

      // extract webpack runtime and module manifest to its own file in order to
      // prevent vendor hash from being updated whenever app bundle is updated
      new webpack.optimize.CommonsChunkPlugin({
        name: 'manifest',
        chunks: ['vendor']
      }),
    ]
  });

  htmlTel.forEach(function(item){
    let name = item.split('/')[2];
    webpackConfig.plugins.push(new HtmlWebpackPlugin({
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

  if (config.build.productionGzip) {
    const CompressionWebpackPlugin = require('compression-webpack-plugin')

    webpackConfig.plugins.push(
      new CompressionWebpackPlugin({
        asset: '[path].gz[query]',
        algorithm: 'gzip',
        test: new RegExp(
          '\\.(' +
          config.build.productionGzipExtensions.join('|') +
          ')$'
        ),
        threshold: 10240,
        minRatio: 0.8
      })
    )
  }

  if (config.build.bundleAnalyzerReport) {
    const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
    webpackConfig.plugins.push(new BundleAnalyzerPlugin())
  }
  return webpackConfig;
}

module.exports = async ()=>{
   return await getPubWebpackConfig();
};
