const path = require('path');
const webpack = require('webpack');
const WebpackMerge = require('webpack-merge');
const base = require('./webpack.base');
const HtmlPlugin = require('html-webpack-plugin');

// 判断环境
const isDev = process.env.NODE_ENV === 'development';

const config = WebpackMerge(base, {
  // 入口配置
  entry: {
    app: path.join(__dirname, '../client/app.js')
  },
  // 输出配置
  output: {
    filename: '[name].[hash:8].js'
  },
  resolve: {
    extensions: [' ', '.jsx', '.js']
  },
  plugins: [
    new HtmlPlugin({
      template: path.join(__dirname, '../client/template.html')
    })
  ]
});

if (isDev) {
  config.entry = [
    'react-hot-loader/patch',
    path.join(__dirname, '../client/app.js')
  ]
  // 打包模式 development： 开发环境      production：生产环境
  config.mode = 'development';
  config.devServer = {
    // 配置0.0.0.0后localhost、127.0.0.1、IP 都可访问
    host: '0.0.0.0',
    port: '8888',
    // 资源地址
    contentBase: path.join(__dirname, '../dist'),
    // 热更新
    hot: true,
    // 错误在页面显示
    overlay: {
      errors: true
    },
    // 静态资源地址
    publicPath: '/public',
    // 映射资源
    historyApiFallback: {
      index: '/public/index.html'
    }
  };
  config.plugins.push(new webpack.HotModuleReplacementPlugin());
} else {
  // 打包模式 development： 开发环境      production：生产环境
  config.mode = 'production';
}

module.exports = config;
