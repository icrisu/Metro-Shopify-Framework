const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const MinifyPlugin = require("babel-minify-webpack-plugin");
const webpack = require('webpack');

module.exports = {
  entry: [
    './src/index.js', './styles/style.scss'
  ],
  output: {
    path: path.join(__dirname, '../server/public/storefront-static'),
    filename: 'main.js'
  },
  resolve: {
    alias: {
      'masonry': 'masonry-layout',
      'isotope': 'isotope-layout'
    }
  },  
  module: {
    rules: [
      {
        exclude: /(node_modules|bower_components)/,       
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          query: {
            presets: ['es2015', 'stage-1']
          },           
        }
      },
      { // sass / scss loader for webpack
        test: /\.(sass|scss)$/,
        loader: ExtractTextPlugin.extract(['css-loader', 'sass-loader'])
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin({ // define where to save the file
      filename: 'main.css',
      allChunks: true,
    })   
  ]
};
