require('dotenv').config();
const path = require('path');
const miniCssExtract = require('mini-css-extract-plugin');
const uglifyJS = require('uglifyjs-webpack-plugin');
const styleLintPlugin = require('stylelint-webpack-plugin');
const optimizeCSS = require('optimize-css-assets-webpack-plugin');
const browserSync = require('browser-sync-webpack-plugin');

module.exports = (env, options) => {
  return {
    context: __dirname,
    entry: './src/index.js',
    output: {
      path: path.resolve(__dirname, 'public'),
      publicPath: './',
      filename: '[name].bundle.js'
    },
    mode: 'development',
    devtool: 'source-map',
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: [ { loader: 'babel-loader' }, { loader: 'eslint-loader' } ]
        },
        {
          test: /\.s?css$/,
          use: [
            miniCssExtract.loader,
            {
              loader: 'css-loader',
              options: { sourceMap: true }
            },
            {
              loader: 'sass-loader',
              options: { sourceMap: true }
            }
          ]
        },
        {
          test: /\.(jpe?g|png|gif)$/,
          use: [
            {
              loader: 'file-loader',
              options: {
                outputPath: 'images/',
                name: '[name].[ext]'
              }
            },
            'img-loader'
          ]
        }
      ]
    },
    plugins: [
      new styleLintPlugin({
        syntax: 'scss',
        files: [ '**/*.scss' ],
        quiet: false,
        emitErrors: true
      }),
      new miniCssExtract({ filename: '../style.css' }),
      new browserSync({
        files: '**/*.php',
        proxy: process.env.HOST
      })
    ],
    optimization: {
      namedModules: true,
      minimizer: [
        new uglifyJS({
          sourceMap: options.mode === 'development'
        }),
        new optimizeCSS()
      ]
    }
  };
};
