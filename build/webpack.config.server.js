const path = require('path');
const WebpackMerge = require('webpack-merge');
const base = require('./webpack.base');

module.exports = WebpackMerge(base, {
  // 执行环境
  target: 'node',
  // 入口配置
  entry: {
    app: path.join(__dirname, '../client/server.entry.js')
  },
  // 打包模式 development： 开发环境      production：生产环境
  mode: 'development',
  // 输出配置
  output: {
    filename: 'server.entry.js',
    libraryTarget: 'commonjs2'
  }
});
