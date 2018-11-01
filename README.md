# 单页应用存在的问题

>* SEO不友好
>* 首次请求等待时间较长，体验不好

# webpack的基础配置

> 代码编写环境

<br>

>       系统 : redhat 7.5
>       IDE : Visual Staudio Code
>       node : 10.11.0
>       webpack : 4.23.1
>       react : 16.6.0

## 创建服务端的入口文件

<pre>
    mkdir webpack_react_SSR
    cd webpack_react_SSR
    npm init -y
</pre>

> 使用mkdir 创建项目根文件夹 webpack_react_SSR
> cd 进入webpack_react_SSR目录
> npm init -y 创建package.json 文件

* 生成的package.json文件

<pre>
    {
        "name": "webpack_demo2",
        "version": "1.0.0",
        "description": "",
        "main": "index.js",
        "scripts": {
            "test": "echo \"Error: no test specified\" && exit 1"
        },
        "keywords": [],
        "author": "",
        "license": "ISC"
    }
</pre>

---

<pre>
    cnpm i webpack webpack-cli -D
    cnpm i react -S
</pre>

> 安装在构建环境下使用的webpack webpack-cli

> 安装在生产环境下需使用的react

---

<pre>
    mkdir build client
    touch webpack.config.js
    touch client/app.js client/App.jsx
</pre>

> build文件夹用来存放工程代码，client存放业务代码

* 编写 webpack.config.js 文件

<pre>
    const path = require('path');

    module.exports = {
        // 入口配置
        entry: {
            app: path.join(__dirname, '../client/app.js')
        },
        // 打包模式 development： 开发环境      production：生产环境
        mode: 'development',
        // 输出配置
        output: {
            filename: '[name].[hash:8].js',
            path: path.join(__dirname, '../dist'),
            publicPath: './'
        }
    }
</pre>

* 编写基础的 App.jsx 文件

<pre>
    import React from 'react';

    export default class App extends React.Component {
        render () {
            return <div>This is D</div>;
        }
    }
</pre>



* 编写基础的 app.js 文件

<pre>
    import React from 'react';
    import ReactDom from 'react-dom';
    import App from './App.jsx';

    ReactDom.render(<App />, document.body);
</pre>

以上文件使用到了react-dom，及jsx文件，是不能直接构建的。

<pre>
    cnpm i react-dom -S
</pre>

---

## babel的配置

* jsx需要babel去解析，但babel此时有俩个版本需特别关注。

> 在bable 6 及以下 需要如下配置

<pre>
    cnpm i babel-loader babel-preset-es2015 babel-preset-es2015-loose babel-preset-react -D
</pre>

* 在根目录下编写 .babelrc 文件

<pre>
    {
        "presets":
        [
            ["es2015", ["loose": true]],
            "react"
        ]
    }
</pre>

> 在bable 7 中需如下配置

<pre>
    cnpm i babel-loader @babel/core @babel/preset-env @babel/preset-react -D
</pre>

* 在根目录下编写 .babelrc 文件

<pre>
    {
        "presets": [
            "@babel/preset-env", "@babel/preset-react"
        ]
    }
</pre>

babel 配置完毕后修改webpack.config.js 文件如下：

<pre>
    const path = require('path');

    module.exports = {
        // 入口配置
        entry: {
            app: path.join(__dirname, '../client/app.js')
        },
        // 打包模式 development： 开发环境      production：生产环境
        mode: 'development',
        // 输出配置
        output: {
            filename: '[name].[hash:8].js',
            path: path.join(__dirname, '../dist'),
            publicPath: './'
        },
        module: {
            rules: [
                {
                    test: /.jsx$/,
                    loader: 'babel-loader'
                },
                {
                    test: /.js$/,
                    loader: 'babel-loader',
                    exclude: [
                        path.join(__dirname, '../node_modules')
                    ]
                }
            ]
        }
    }
</pre>

---

## 使用 html-webpack-plugin

<pre>
    cnpm i html-webpack-plugin -D
</pre>

修改webpack.config.js 文件如下：

<pre>
    const path = require('path');
    const htmlPlugin = require('html-webpack-plugin');

    module.exports = {
        // 入口配置
        entry: {
            app: path.join(__dirname, '../client/app.js')
        },
        // 打包模式 development： 开发环境      production：生产环境
        mode: 'development',
        // 输出配置
        output: {
            filename: '[name].[hash:8].js',
            path: path.join(__dirname, '../dist'),
            publicPath: './'
        },
        module: {
            rules: [
                {
                    test: /.jsx$/,
                    loader: 'babel-loader'
                },
                {
                    test: /.js$/,
                    loader: 'babel-loader',
                    exclude: [
                        path.join(__dirname, '../node_modules')
                    ]
                }
            ]
        },
        plugins: [
            new htmlPlugin()
        ]
    }
</pre>

## 配置快捷打包

* 修改package.json文件下的scripts 项：

<pre>
  "scripts": {
    "build": "webpack --config build/webpack.config.js"
  }
</pre>

> 使用npm run build 即可启动打包

# 服务端渲染基础配置

## 创建服务端渲染入口文件

> 在client 文件夹下新建server.entry.js文件

* server.entry.js

<pre>
    import React from 'react';
    import App from './App.jsx';

    export default <App />;
</pre>

---

## 配置webpack配置文件

> 新建webpack.config.server.js 文件
> 修改webpack.config.js 文件名为 webpack.config.client.js

* webpack.config.server.js

<pre>
    const path = require('path');

    module.exports = {
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
            path: path.join(__dirname, '../dist'),
            publicPath: '/public/',
            libraryTarget: 'commonjs2'
        },
        module: {
            rules: [
                {
                    test: /.jsx$/,
                    loader: 'babel-loader'
                },
                {
                    test: /.js$/,
                    loader: 'babel-loader',
                    exclude: [
                        path.join(__dirname, '../node_modules')
                    ]
                }
            ]
        }
    }
</pre>

> 在client 文件夹下创建template.html 文件

* template.html

<pre>

```html

    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="utf8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <title>Document</title>
    </head>
    <body>
        <div id="root"><app></app></div>
    </body>
    </html>

```

</pre>

* 修改webpack.config.client.js

<pre>
    const path = require('path');
    const htmlPlugin = require('html-webpack-plugin');

    module.exports = {
        // 入口配置
        entry: {
            app: path.join(__dirname, '../client/app.js')
        },
        // 打包模式 development： 开发环境      production：生产环境
        mode: 'development',
        // 输出配置
        output: {
            filename: '[name].[hash:8].js',
            path: path.join(__dirname, '../dist'),
            publicPath: '/public/'
        },
        module: {
            rules: [
                {
                    test: /.jsx$/,
                    loader: 'babel-loader'
                },
                {
                    test: /.js$/,
                    loader: 'babel-loader',
                    exclude: [
                        path.join(__dirname, '../node_modules')
                    ]
                }
            ]
        },
        plugins: [
            new htmlPlugin({
                template: path.join(__dirname, '../client/template.html')
            })
        ]
    }
</pre>

## 创建server

<pre>
    mkdir server && touch server/server.js
    cnpm i express -S
</pre>

> 根目录下创建 server 文件夹 并新建server.js文件

> 服务使用的是 express

* server.js

<pre>
    const express = require('express');
    const ReactSSR = require('react-dom/server');
    const fs = require('fs');
    const path = require('path');

    // 读取入口文件
    const serverEntry = require('../dist/server.entry').default;

    // 读取html文件 并指定编码格式
    const template = fs.readFileSync(path.join(__dirname, '../dist/index.html'), 'utf8');

    // 创建服务对象
    const app = express();

    // 静态文件映射 防止被全局拦截
    app.use('/public', express.static(path.join(__dirname, '../dist')));

    // 全局拦截 服务端渲染后返回内容
    app.get('*', function(req, res) {
        // 渲染内容
        const appString = ReactSSR.renderToString(serverEntry);
        // 拼接后返回
        res.send(template.replace('<app></app>', appString));
    });

    // 新建服务 端口为3333
    app.listen(3333, function() {
        console.log('server is listening on 3333');
    });
</pre>

> 修改 package.json 文件
> 引入node 删除文件模块 rimraf

<pre>
    cnpm i rimraf -D
<pre>

* package.json scripts配置项

<pre>
  "scripts": {
    "build:client": "webpack --config build/webpack.config.client.js",
    "build:server": "webpack --config build/webpack.config.server.js",
    "clear": "rimraf dist",
    "build": "npm run clear && npm run build:client && npm run build:server",
    "start": "node server/server.js"
  }
</pre>

> * npm run build 构建
> * npm run start 启动

# webpack-dev-server

> 安装webpack-dev-server
> 安装 cross-env
> 修改webpack.server.client.js 文件
> 修改package.json scripts 方法

<pre>
    cnpm i webpack-dev-server cross-env -D
</pre>

* webpack.server.client.js

<pre>
    const path = require('path');
    const htmlPlugin = require('html-webpack-plugin');

    // 判断环境
    const isDev = process.env.NODE_ENV === "development";

    const config = {
        // 入口配置
        entry: {
            app: path.join(__dirname, '../client/app.js')
        },
        // 输出配置
        output: {
            filename: '[name].[hash:8].js',
            path: path.join(__dirname, '../dist'),
            publicPath: '/public/'
        },
        module: {
            rules: [
                {
                    test: /.jsx$/,
                    loader: 'babel-loader'
                },
                {
                    test: /.js$/,
                    loader: 'babel-loader',
                    exclude: [
                        path.join(__dirname, '../node_modules')
                    ]
                }
            ]
        },
        plugins: [
            new htmlPlugin({
                template: path.join(__dirname, '../client/template.html')
            })
        ]
    };

    if (isDev) {
        // 打包模式 development： 开发环境      production：生产环境
        config.mode = 'development';
        config.devServer = {
            // 配置0.0.0.0后localhost、127.0.0.1、IP 都可访问
            host: '0.0.0.0',
            port: '8888',
            // 资源地址
            contentBase: path.join(__dirname, '../dist'),
            // 热更新
            // hot: true,
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
        }
    } else {
        // 打包模式 development： 开发环境      production：生产环境
        config.mode = 'production';
    }

    module.exports = config;
</pre>

> package.json scripts 方法

<pre>
    "scripts": {
        "build:client": "webpack --config build/webpack.config.client.js",
        "build:server": "webpack --config build/webpack.config.server.js",
        "dev:client": "cross-env NODE_ENV=development webpack-dev-server --config build/webpack.config.client.js",
        "clear": "rimraf dist",
        "build": "npm run clear && npm run build:client && npm run build:server",
        "start": "node server/server.js"
    }
</pre>

> 使用 npm run dev:client 启动服务
> loaclhost:8888 访问

* Warning: Expected server HTML to contain a matching <div> in <div>. 错误     修改app.js 文件

* app.js

<pre>
    import React from 'react';
    import ReactDom from 'react-dom';
    import App from './App.jsx';

    const isDev = process.env.NODE_ENV === "development";

    if (isDev) {
        ReactDom.render( < App / > , document.querySelector('#root'));
    } else {
        ReactDom.hydrate( < App / > , document.querySelector('#root'));
    }
</pre>

# hot-module-replacement

> 安装 react-hot-loader

<pre>
    cnpm i react-hot-loader@next -D
</pre>

> 修改 .babelrc 文件

* .babelrc

<pre>
    {
        "presets": [
            "@babel/preset-env", "@babel/preset-react"
        ],
        "plugins": [
            "react-hot-loader/babel"
        ]
    }
</pre>

> 修改 app.js 文件

* app.js

<pre>
    import React from 'react';
    import ReactDom from 'react-dom';
    import { AppContainer } from 'react-hot-loader';
    import App from './App.jsx';

    // 当前执行的环境
    const isDev = process.env.NODE_ENV === "development";
    const  ROOT= document.querySelector('#root');
    const render = Comment => {
        if (isDev) {
            ReactDom.render(
                    <AppContainer>
                        <Comment />
                    </AppContainer>,
                    ROOT
                );
        } else {
            ReactDom.hydrate(
                    <AppContainer>
                        <Comment />
                    </AppContainer>,
                    ROOT
                );
        };
    };

    render(App);

    if (module.hot) {
        module.hot.accept('./App.jsx', () => {
            const NextApp = require('./App.jsx').default;
            render(NextApp);
        });
    };
</pre>

> 修改 webpack.config.client.js 文件

* webpack.config.client.js

<pre>
    const path = require('path');
    const webpack = require('webpack');
    const htmlPlugin = require('html-webpack-plugin');

    // 判断环境
    const isDev = process.env.NODE_ENV === "development";

    const config = {
        // 入口配置
        entry: {
            app: path.join(__dirname, '../client/app.js')
        },
        // 输出配置
        output: {
            filename: '[name].[hash:8].js',
            path: path.join(__dirname, '../dist'),
            publicPath: '/public/'
        },
        module: {
            rules: [
                {
                    test: /.jsx$/,
                    loader: 'babel-loader'
                },
                {
                    test: /.js$/,
                    loader: 'babel-loader',
                    exclude: [
                        path.join(__dirname, '../node_modules')
                    ]
                }
            ]
        },
        plugins: [
            new htmlPlugin({
                template: path.join(__dirname, '../client/template.html')
            })
        ]
    };

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
</pre>

# 开发时的服务端渲染

> 在server目录下新建 util 文件夹， 并新建dev.static.js文件

<pre>
    mkdir server/util && touch server/util/dav.static.js
</pre>

> 修改 server.js 文件

* server.js

<pre>
    const express = require('express');
    const ReactSSR = require('react-dom/server');
    const fs = require('fs');
    const path = require('path');

    // 判断当前环境
    const isDev = process.env.NODE_ENV === "development";

    // 创建服务对象
    const app = express();

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
</pre>

> 安装依赖 axios、memory-fs、http-proxy-middleware
> 编写 dev.static.js 文件

<pre>
    cpm i axios -S
    cnpm i memory-fs http-proxy-middleware -D
</pre>

* dev.static.js

<pre>

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
</pre>

# 代码规范

## eslint

> 安装依赖

<pre>
    cnpm i babel-eslint \ eslint-config-airbnb eslint-config-standard \ eslint-loader \ eslint-plugin-import \ eslint-plugin-jsx-a11y \ eslint-plugin-node \ eslint-plugin-promise \ eslint-plugin-react \ eslint-plugin-standard -D
</pre>

> 根目录下新建.eslintrc 文件

* .eslintrc

<pre>
    {
        "extends": "standard",
        "rules": {
            "semi": [0]
        }
    }
</pre>

> client 文件下新建 .eslintrc 文件

<pre>
    {
        "parser": "babel-eslint",
        "env": {
            "browser": true,
            "es6": true,
            "node": true
        },
        "parserOptions": {
            "ecmaVersion": 6,
            "sourceType": "module"
        },
        "extends": "airbnb",
        "rules": {
            "react/jsx-filename-extension": [0]
        }
    }
</pre>

> 修改webpack.config.client.js 文件 与 webpack.config.server.js 文件 下的module方法

* module方法

<pre>
    module: {
        rules: [{
        enforce: 'pre',
        test: /.(js|jsx)$/,
        loader: 'eslint-loader',
        exclude: [
            path.resolve(__dirname, '../node_modules')
        ]
        },
        {
        test: /.jsx$/,
        loader: 'babel-loader'
        },
        {
        test: /.js$/,
        loader: 'babel-loader',
        exclude: [
            path.join(__dirname, '../node_modules')
        ]
        }
        ]
  }
</pre>

然后根据eslint错误提示修改好代码的规范

## editorconfig

> 在根目录下新建 .editorconfig 文件

* .editorconfig

<pre>
    root = true

    [*]
    charset = utf-8
    indent_style = space
    indent_size = 2
    end_of_line = lf
    insert_final_newline = true
    trim_trailing_whitespace = true
</pre>

> 安装editorconfig插件

## 使用husky

> 安装husky 依赖

<pre>
    cnpm i husky -D
</pre>

> 配置package.json 文件

* package.json scripts 方法

<pre>
  "scripts": {
    "build:client": "webpack --config build/webpack.config.client.js",
    "build:server": "webpack --config build/webpack.config.server.js",
    "dev:client": "cross-env NODE_ENV=development webpack-dev-server --config build/webpack.config.client.js",
    "dev:server": "cross-env NODE_ENV=development node server/server.js",
    "clear": "rimraf dist",
    "build": "npm run clear && npm run build:client && npm run build:server",
    "start": "node server/server.js",
    "lint": "eslint --ext .js --ext .jsx client/",
    "precommit": "npm run lint"
  }
</pre>

# 优化

## webpack-merge

<pre>
    cnpm i webpack-merge -D
</pre>

> build 目录下新建 webpack.base.js 文件

* webpack.base.js

<pre>
    const path = require('path');

    module.exports = {
    // 输出配置
    output: {
        path: path.join(__dirname, '../dist'),
        publicPath: '/public/'
    },
    resolve: {
        extensions: [' ', '.jsx', '.js']
    },
    module: {
        rules: [{
        enforce: 'pre',
        test: /.(js|jsx)$/,
        loader: 'eslint-loader',
        exclude: [
            path.resolve(__dirname, '../node_modules')
        ]
        },
        {
        test: /.jsx$/,
        loader: 'babel-loader'
        },
        {
        test: /.js$/,
        loader: 'babel-loader',
        exclude: [
            path.join(__dirname, '../node_modules')
        ]
        }
        ]
    }
    }
</pre>

> 修改 webpack.config.client.js 文件

<pre>
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

</pre>

> 修改 webpack.config.server.js 文件

<pre>
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
</pre>

## serve-favicon

<pre>
    cnpm i serve-favicon -S
</pre>

> 根目录下创建ico图标

> 修改 server.js 文件

<pre>
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

</pre>

## nodemon

<pre>
    cnpm i nodemon -D
</pre>

> 根目录下创建nodemon.json 文件

<pre>
    {
    "restartable": "rs",
    "ignore": [
        ".git",
        "node_modules/**/node_modules",
        ".eslintrc",
        "client",
        "build"
    ],
    "env": {
        "NODE_ENV": "development"
    },
    "verbose": true,
    "ext": "js"
    }
</pre>

> 配置package.json 文件

* package.json scripts 方法

<pre>
  "scripts": {
    "build:client": "webpack --config build/webpack.config.client.js",
    "build:server": "webpack --config build/webpack.config.server.js",
    "dev:client": "cross-env NODE_ENV=development webpack-dev-server --config build/webpack.config.client.js",
    "dev:server": "nodemon server/server.js",
    "clear": "rimraf dist",
    "build": "npm run clear && npm run build:client && npm run build:server",
    "start": "node server/server.js",
    "lint": "eslint --ext .js --ext .jsx client/",
    "precommit": "npm run lint"
  }
</pre>
