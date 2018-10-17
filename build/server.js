'use strict'

const fs = require('fs')
const path = require('path')
const childProcess = require('child_process')
const express = require('express')
const app = require('express')()
const webpack = require('webpack')
const webpackDevMiddleware = require('webpack-dev-middleware')
const webpackHotMiddleware = require('webpack-hot-middleware')
const webpackConfig = require('./webpack.config')

const DEV_SSL = process.env['DEV_SSL']
const SERVER_PORT = process.env.port || (DEV_SSL ? 443 : 80)
const compiler = webpack(webpackConfig)
const devMiddleware = webpackDevMiddleware(compiler, {
  stats: {
    colors: true,
    chunks: false,
    children: false,
  },
  lazy: false,
  publicPath: '/',
})

app.use(devMiddleware)
app.use(webpackHotMiddleware(compiler))
app.use(express.static(path.join(__dirname, '../site-icon/')))

let server
if (DEV_SSL) {
  const https = require('https')
  const options = {
    key: fs.readFileSync(path.join(__dirname, './ssl/privatekey.pem')),
    cert: fs.readFileSync(path.join(__dirname, './ssl/certificate.pem')),
  }
  server = https.createServer(options, app)
} else {
  const http = require('http')
  server = http.createServer(app)
}

server.listen(8080, () => {
  console.log(`Dev server listen on port 8080`)
})


