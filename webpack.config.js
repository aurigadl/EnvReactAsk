var fs = require('fs');

var webpack = require('webpack');
var precss = require('precss');
var autoprefixer = require('autoprefixer');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var StaticSiteGeneratorPlugin = require('static-site-generator-webpack-plugin');
var ejs = require('ejs');
var template = ejs.compile(fs.readFileSync(__dirname + '/src/template.html', 'utf-8'));

var routes = [
  '/',
  '/item'
];

var config = {
  entry: './src/index.js',

  output: {
    filename: 'bundle.js',
    path: 'dist',
    libraryTarget: 'umd'
  },

  module: {
    loaders: [
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract('style', 'css?modules&sourceMap!postcss')
      },
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel'
      }
    ]
  },

  postcss: function() {
    return [
      autoprefixer({ browsers: ['> 1%', 'last 2 versions', 'IE 9']} ),
      precss
    ];
  },

  plugins: [
    new ExtractTextPlugin('bundle.css', { allChunks: true }),
    new StaticSiteGeneratorPlugin('main', routes, { template: template })
  ],

  devtool: 'cheap-module-source-map'
};

module.exports = config;
