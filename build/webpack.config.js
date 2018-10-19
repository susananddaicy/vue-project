'use strict'
const webpack = require('webpack')
const path = require('path')
const ROOT_PATH = path.join(__dirname, '../')
const HtmlWebpackTplPlugin = require('html-webpack-template-plugin')
const htmlWebpackPlugin = require('html-webpack-plugin')
const IS_DEV = process.env.npm_lifecycle_event === 'dev'

const getVueLoaderOptions = (prod) => {
  const baseOptions = {
    autoprefixer: false,
    minimize: true,
    cssModules: {
      localIdentName: `${IS_DEV ? '[name]-[local]_' : '[name]-'}[hash:base64:5]`,
      camelCase: true,
    },
    loaders: {
      js: 'babel-loader',
      stylus: 'vue-style-loader!css-loader!stylus-loader',
    },
    preserveWhitespace: false,
  }
  return baseOptions
}
const ENTRY_PAGE = [{
  chunkName: 'page1',
  src: './src/page1',
  chunks: []
}, {
  chunkName: 'page2',
  src: './src/page2',
  chunks: []
}]
const MINIFY_OPTION = {
  removeComments: true,
  collapseWhitespace: true,
  minifyJS: true,
  minifyCSS: true,
  collapseBooleanAttributes: true
}
let entryHtmlPlugins = ENTRY_PAGE.map(item => new htmlWebpackPlugin({
  filename: `${item.chunkName}/index.html`,
  template: `${item.src}/config.yml`,
  minify: MINIFY_OPTION,
  chunks: ['common', item.chunkName].concat(item.chunks),
  scriptAttribute: {
    crossorigin: 'anonymous',
    defer: true
  },
}))
let baseConfig = {
  entry: {
    vendor: ['./src/common/common.js'],
    page1: './src/page1/index.js',
    page2: './src/page2/index.js'
  },

  output: {
    path: path.join(ROOT_PATH, 'dist'),
    publicPath: '/',
    filename: '[name].[chunkhash:7].js'
  },

  module: {
    rules: [
      /* loaders */
      {
        test: /\.js/,
        exclude: /node_modules\//,
        loader: 'babel-loader',
      }, {
        test: /\.jsx?$/,
        include: ROOT_PATH,
        exclude: /node_modules\//,
        loader: 'babel-loader',
      }, {
        test: /\.json$/,
        loader: 'json-loader',
      }, {
        test: /\.html$/,
        loader: 'vue-html-loader?minimize=false',
      }, {
        test: /\.svg$/,
        exclude: [/not-sprite-svg/, /\.inline\.svg/],
        loader: 'svg-sprite-loader',
      }, {
        test: /\.(gif|png|jpe?g)(\?\S*)?$/,
        loader: 'url-loader',
      }, {
        test: /\.(eot|ttf|woff|woff2)$/,
        loader: 'file-loader',
      }, {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: getVueLoaderOptions(false),
      },
    ],
  },

  plugins: entryHtmlPlugins.concat([
    new HtmlWebpackTplPlugin({
      root: __dirname,
      template: '../src/common/index.tpl',
      variable: {
        'preInjected': 'This variable was injected from plugin definition',
        'testArray': [
          'test1',
          'test2'
        ]
      },
      helper: {
        script: value => {
          if (!value || !Array.isArray(value)) {
            return ''
          }
          let result = ''
          value.forEach(item => {
            if (typeof item === 'string') {
              item = {
                src: item,
              }
            }
            if (item !== null && typeof item === 'object') {
              item.crossorigin = 'anonymous'
              result += '<script'
              Object.keys(item).forEach(key => {
                result += ' ' + (item[key] ? (key + '="' + item[key] + '"') : key)
              })
              result += '></script>'
            }
          })
          return result
        }
      },
      filter: (moduleConfig, htmlPluginOption) => {
        let viewConfig = {}
        if (Array.isArray(moduleConfig)) {
          let entryName = htmlPluginOption.filename.replace('/index.html', '')
          moduleConfig.some(item => {
            if (item.entry === entryName) {
              viewConfig = item.template
              return true
            }
          })
        } else {
          viewConfig = moduleConfig.template
        }
        return viewConfig
      },
    })
  ]),
  externals: {
    'vue': 'Vue',
  },
}

module.exports = baseConfig
