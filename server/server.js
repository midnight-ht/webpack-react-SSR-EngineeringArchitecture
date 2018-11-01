const express = require('express');
const ico = require('serve-favicon');
const ReactSSR = require('react-dom/server');
const fs = require('fs');
const path = require('path');

// 判断当前环境
const isDev = process.env.NODE_ENV === 'development';

// 创建服务对象
const app = express();

app.use(ico(path.join(__dirname, '../favicon.ico')));

if (!isDev) {
  // 读取入口文件
  const serverEntry = require('../dist/server.entry').default;

  // 读取html文件 并指定编码格式
  const template = fs.readFileSync(path.join(__dirname, '../dist/index.html'), 'utf8');

  // 静态文件映射 防止被全局拦截
  app.use('/public', express.static(path.join(__dirname, '../dist')));

  // 全局拦截 服务端渲染后返回内容
  app.get('*', function (req, res) {
    // 渲染内容
    const appString = ReactSSR.renderToString(serverEntry);
    // 拼接后返回
    res.send(template.replace('<!-- app -->', appString));
  });
} else {
  const devStatic = require('./util/dev.static');
  devStatic(app);
}

// 新建服务 端口为3333
app.listen(3333, function () {
  console.log('server is listening on 3333');
});
