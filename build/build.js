'use strict'

const ora = require('ora')
const webpack = require('webpack')
const args = process.argv.slice(2)
const isAnalysis = args.some(item => item.match('analysis'))

function runWebpack() {
  const webpackConf = require('./webpack.config')
  const spinner = ora('building for production...').start()

  if (isAnalysis) {
    const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
    webpackConf.plugins.push(new BundleAnalyzerPlugin({
      generateStatsFile: true,
    }))
  }

  webpack(webpackConf, (err, stats) => {
    spinner.stop()
    if (err) throw err
    console.log(stats.toString({
      colors: true,
      modules: false,
      children: false,
      chunks: false,
      chunkModules: false,
    }))
  })
}

runWebpack()
