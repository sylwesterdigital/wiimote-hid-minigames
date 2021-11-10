const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CopyPlugin = require("copy-webpack-plugin");
const webpack = require('webpack')
/*const { SourceMapDevToolPlugin } = require("webpack");
*/
module.exports = {
  mode: 'development',
  devServer: {
    historyApiFallback: true,
    open: true,
    compress: true,
    hot: true,
    https: true,
    host: 'localhost',
    port: 5555  
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
/*      {
        test: /\.js$/,
        enforce: 'pre',
        use: ['source-map-loader'],
      },            
*/        ]
  },    
  entry: {
    main: path.resolve(__dirname, './src/app.js'),
  },
   output: {
    path: path.resolve(__dirname, './dist'),
    filename: '[name].bundle.js',
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: '5G Tours - Interactive Wall - GAM',
      template: path.resolve(__dirname, './src/index.html'), // template file
      filename: 'index.html', // output file
    }),
    new CopyPlugin({
      patterns: [
        { from: 'assets', to: 'assets' },
      ],
    }),    
    new CleanWebpackPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.ProvidePlugin({
      $: 'webpack-zepto',
      Zepto: 'webpack-zepto'
    }),
/*    new SourceMapDevToolPlugin({
      filename: "[file].map"
    })
*/
  ],  
}