'use strict';

var webpack = require('webpack'),
  HtmlWebpackPlugin = require('html-webpack-plugin'),
  path = require('path'),
  srcPath = path.join(__dirname, 'src');

module.exports = {

  target: 'web',
  cache: true,
  entry: {
    module: path.join(srcPath, 'module.js'),
    common: ['react', 'react-router']
  },

  resolve: {
    root: srcPath,
    extensions: ['', '.js'],
    modulesDirectories: ['node_modules', 'src']
  },

  output: {
    path: path.join(__dirname, 'server/static'),
    publicPath: '',
    filename: '[name].js',
    library: ['Example', '[name]'],
    pathInfo: true
  },

  module: {
    loaders: [
      {test: /\.js?$/, exclude: /node_modules/, loader: 'babel?cacheDirectory'},
      {test: /\.css$/, loader: "style-loader!css-loader"},
      {test: /\.png$/, loader: "url-loader?limit=100000"},
      {test: /\.(ttf|otf|eot|svg|woff(2)?)(\?[a-z0-9=&.]+)?$/, loader: 'file-loader?name=fonts/[name].[ext]' },
      {test: /\.(jpe?g|png|gif|svg)$/i, loader: "file-loader?name=/[name].[ext]"},
      {test: /\.less$/, loaders: ['style-loader', "css-loader?sourceMap", "less-loader?sourceMap"]}
    ]
  },

  plugins: [
    new webpack.optimize.CommonsChunkPlugin('common', 'common.js'),
    new HtmlWebpackPlugin({
      inject: true,
      template: 'src/index.html'
    }),
    new webpack.NoErrorsPlugin()
  ],

  debug: true,
  devtool: 'eval-cheap-module-source-map',
  devServer: {
    contentBase: './dist',
    historyApiFallback: true
  }
};
