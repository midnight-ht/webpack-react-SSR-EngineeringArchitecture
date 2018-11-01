
const axios = require('axios');
const path = require('path');
const MemoryFs = require('memory-fs'); // 内存读写插件
const webpack = require('webpack');
const proxy = require('http-proxy-middleware'); // 代理插件
const ReactDomServer = require('react-dom/server');

// 获取到服务更新配置文件
const serverConfig = require('../../build/webpack.config.server');

// 异步请求 获取主页
const getTemplate = () => {
    return new Promise((resolve, reject) => {
        axios.get('http://localhost:8888/public/index.html').
        then(res => {
            resolve(res.data);
        })
        .catch(reject);
    });
};

// copy构造函数
const Module = module.constructor;

// 创建MemoryFs对象
const mfs = new MemoryFs;
// 执行webpack服务配置文件
const serverCompiler =webpack(serverConfig);
serverCompiler.outputFileSystem = mfs;
// 保存读取结果
let serverBundle;

serverCompiler.watch({}, (err, status) => {
    if (err) throw err;
    status = status.toJson();
    status.errors.forEach(err => console.error(err));
    status.warnings.forEach(warn => console.warn(warn));

    // 获取文件地址
    const bundlePath = path.join(
        serverConfig.output.path,
        serverConfig.output.filename
    );

    // 读取文件 并指定编码
    const bundle = mfs.readFileSync(bundlePath, "utf8");
    const m = new Module();
    // 读取文件
    m._compile(bundle, 'server.entry.js');
    serverBundle = m.exports.default;
})

module.exports = function (app) {
    app.use('/public', proxy({
        target: 'http://localhost:8888'
    }))
    app.get('*', function (req, res) {
        getTemplate().then(template => {
            const content = ReactDomServer.renderToString(serverBundle);
            res.send(template.replace('<!-- app -->', content));
        })
    });
};