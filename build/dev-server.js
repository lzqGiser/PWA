'use strict'
require('./check-versions')()

const config = require('../config')
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = JSON.parse(config.dev.env.NODE_ENV)
}

const opn = require('opn')
const path = require('path')
const express = require('express')
const webpack = require('webpack')
const proxyMiddleware = require('http-proxy-middleware')
const webpackConfig = require('./webpack.dev.conf')
const tool = require('./fileHandler')

const port = process.env.PORT || config.dev.port
const autoOpenBrowser = !!config.dev.autoOpenBrowser
const proxyTable = config.dev.proxyTable

const app = express();

webpackConfig().then(function(devConfig){

  const compiler = webpack(devConfig);

  const devMiddleware = require('webpack-dev-middleware')(compiler, {
    publicPath: devConfig.output.publicPath,
    quiet: true

  });

  const hotMiddleware = require('webpack-hot-middleware')(compiler, {
    log: false,
    heartbeat: 2000
  })

  app.use(hotMiddleware)

  // proxy api requests
  Object.keys(proxyTable).forEach(function (context) {
    let options = proxyTable[context];
    if (typeof options === 'string') {
      options = { target: options }
    }
    app.use(proxyMiddleware(options.filter || context, options))
  })

  app.use(require('connect-history-api-fallback')())

// serve webpack bundle output
  app.use(devMiddleware)

  // serve pure static assets
  const staticPath = path.posix.join(config.dev.assetsPublicPath, config.dev.assetsSubDirectory)
  app.use(staticPath, express.static('./static'))

  const uri = 'http://localhost:' + port

  var _resolve
  var _reject
  var readyPromise = new Promise((resolve, reject) => {
    _resolve = resolve
    _reject = reject
  })

  var server
  var portfinder = require('portfinder')
  var defaultPage = config.dev.defaultPage;
  portfinder.basePort = port

  // 设定开启的页面, 检测设定的页面要与实际有的相比配
  let openPageName = tool.getNpmCmdParams();

  Object.keys(devConfig.entry).forEach(function(page){
    openPageName.length && page == openPageName[0] ? defaultPage = '/' + openPageName[0] + '.html' : defaultPage;
  })

  console.log('> Starting dev server...')
  devMiddleware.waitUntilValid(() => {
    portfinder.getPort((err, port) => {
      if (err) {
        _reject(err)
      }
      process.env.PORT = port;

      var uri = 'http://localhost:' + port + defaultPage;  // 默认打开home.html
      console.log('> Listening at ' + uri + '\n');
      // when env is testing, don't need open it
      if (autoOpenBrowser && process.env.NODE_ENV !== 'testing') {
        opn(uri)
      }
      server = app.listen(port);
      _resolve()
    })
  })


  module.exports = {
    ready: readyPromise,
    close: () => {
      server.close()
    }
  }

})
