---
title: 记录一些开发中的小技巧
author: EricYangXD
date: "2021-12-29"
---

## LAMP/MEAN 环境指的是啥

1. LAMP

- L: Linux 操作系统
- A: Apache 网页服务器
- M: MySQL 数据库
- P: PHP 编程语言

2. MEAN

- M: MongoDB 数据库
- E: Express 网页框架
- A: AngularJS 前端框架
- N: Node.js 服务器环境

其实就是几个软件的简写。

LAMP 一直作为 Web 开发人员选用最广的环境，其生态圈庞大，文档资料丰富，适合小型到大型 Web 项目的开发。
如果你想开发一个简单的动态网站，LAMP 无疑是一个不错的选择。它简单、免费、开源，并得到广泛支持与帮助。

MEAN 作为当代流行的 Web 开发技术栈，其生态系统也比较强大，得到许多公司和开发者的支持，适用于中小型到大型的 Web 应用开发。
如果你想开发一个高性能的现代 Web 应用，MEAN 是一个很好的选择。

## 快速复制一个代码运行中生成的超大变量并保存到本地

1. 在代码里先 console.log($this_variable);
2. 在控制台找到打印出来的$this_variable，在它上面「点击右键」->「Store as global variable」;
3. 在控制台会自动输出一个类似「temp1」的内容，然后在控制台输入「copy(temp1)」，然后新建一个文件「Control+C」即可把该对象复制出来。
4. 该方法支持小程序开发者工具！

## 用户登录加密

```js
import JSEncrypt from "jsencrypt";
// 公钥
const cloudPublicKey = `abcdefg`;

const encrypt = (value, publicKey = cloudPublicKey) => {
  const jsEncrypt = new JSEncrypt({});
  jsEncrypt.setPublicKey(publicKey);
  return jsEncrypt.encrypt(value);
};

export default encrypt;

// 使用的时候
const enUsername = encrypt("username");
```

## 代码风格检查&license 声明添加

- 利用 git hook
- 使用 husky5.0 参考[这里](https://zhuanlan.zhihu.com/p/366786798)。安装后，可以很方便的在 package.json 配置 git hook 脚本，如下：
- `lint-staged`: 该工具库仍允许我们使用 Husky 运行 Git hooks，但它只能在已暂存的文件上运行。

1. package.json

```json
{
  "scripts": {
    "prestart": "node config/fix-sls-offline.js",
    "lint:eslint": "eslint --ignore-path .gitignore --ignore-pattern 'src/components/xxxx' --ignore-pattern src/assets/**/*.js",
    "lint:license": "node ./config/license"
  },
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged", // 在后续的每一次git commit 之前，都会执行一次对应的 hook 脚本npm run lint 。其他hook同理
      "commit-msg": "commitlint -E HUSKY_GIT_PARAMS" // 检查Git commit内容
    }
  },
  "lint-staged": {
    // 只检查staged状态的代码，lint-staged是个库，需要安装在devDependencies中
    "*.{js,ts,tsx}": [
      // 只对js,ts,tsx文件进行校验
      "npm run lint:eslint",
      "npm run lint:license"
    ]
  }
}
```

2. .eslintrc.js 配置

```js
module.exports = {
  parser: "@typescript-eslint/parser",
  // extends: ['xxxx', 'prettier'],
  plugins: ["@typescript-eslint", "prettier"],
  // ignorePatterns: ['/src/components/xxxx/*'],
  env: {
    browser: true,
    node: true,
    commonjs: true,
  },
  parserOptions: {
    ecmaVersion: 2017,
    sourceType: "module",
    ecmaFeatures: {
      modules: true,
      jsx: true,
    },
  },
  rules: {
    "import/extensions": 0,
    "import/no-unresolved": 0,
    "react/prop-types": 0,
    "jsx-a11y/click-events-have-key-events": 0,
    "jsx-a11y/no-noninteractive-element-interactions": 0,
    "jsx-a11y/no-static-element-interactions": 0,
    "jsx-a11y/anchor-is-valid": 0,
    "no-underscore-dangle": 0,
    "jsx-a11y/label-has-associated-control": 0,
    "jsx-a11y/label-has-for": 0,
  },
  settings: {
    react: {
      pragma: "React",
      version: "detect",
    },
    "import/resolver": {
      webpack: {
        config: "./webpack.dev.config.js",
      },
    },
  },
};
```

3. license.js 配置

```js
const path = require("path");
const gulp = require("gulp");
const licenser = require("gulp-licenser");

// license 模板
const LICENSE_TEMPLATE = "/** Copyright © 1992-2021 YXD, All Rights Reserved. */";

// 从参数中获取文件列表，配合lint-stage使用
const files = process.argv.slice(2); // node license [files]

// 默认全量自定义文件
const defaultFiles = [
  "src/*.js",
  "src/*.ts",
  "src/*.tsx",
  "src/**/*.js",
  "src/**/*.ts",
  "src/**/*.tsx",
  "framework/**/*.js",
  "framework/**/*.ts",
  "framework/**/*.tsx",
  "config/**/*.js",
  "packages/**/*.js",
  "packages/**/*.ts",
  "packages/**/*.tsx",
  "*.js",
];

// 处理source，拼接绝对路径
const source = files.length > 0 ? files : defaultFiles.map((item) => path.resolve(process.cwd(), item));

// 检查是否有license并自动加上
function updateLicense() {
  gulp
    .src(source)
    .pipe(licenser(LICENSE_TEMPLATE))
    .pipe(gulp.dest((file) => file.base));
}

updateLicense();
```

4. .prettierrc

```json
{
  "printWidth": 120,
  "tabWidth": 2,
  "useTabs": false,
  "semi": true,
  "singleQuote": true,
  "trailingComma": "es5",
  "arrowParens": "always"
}
```

5. commitlint.config.js

```js
module.exports = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "type-enum": [
      2,
      "always",
      ["build", "ci", "chore", "docs", "feat", "fix", "perf", "refactor", "revert", "style", "test", "merge"],
    ],
    "subject-case": [0],
  },
};
```

## npx husky install

- fix-sls-offline.js 文件用于判断修复 serverless 离线 bug？？？

```js
const fs = require("fs");
const LINE_NUMBER = 6;
const FILE_LOCATION = "node_modules/hapi/lib/defaults.js";
const INJECT_FIX_STRING = `
var isWin = process.platform === "win32";
var isLinux = process.platform === "linux";
var isDarwin = process.platform === "darwin";
if (isDarwin || isLinux) {
  Os.tmpDir = Os.tmpdir;
} else if (isWin) {
   Os.tmpDir = os.tmpDir;
}
`;

let data = fs.readFileSync(FILE_LOCATION);
if (data.includes(INJECT_FIX_STRING)) {
  console.log("Skipping fix injection, already exists.");
} else {
  data = data.toString().split("\n");
  data.splice(LINE_NUMBER, 0, INJECT_FIX_STRING);
  let text = data.join("\n");

  fs.writeFile(FILE_LOCATION, text, (err) => {
    if (err) {
      return console.log(err);
    } else {
      return console.log("Injected fix successfully");
    }
  });
}
```

- 原理：
- 在安装 husky 的时候，husky 会根据 package.json 里的配置，在.git/hooks 目录生成所有的 hook 脚本（如果你已经自定义了一个 hook 脚本，husky 不会覆盖它）

1. husky 使用了自定义的安装过程：node lib/installer/bin install（在 node_modules/husky/package.json 里）。执行的时会在项目的.git/hooks 目录生成所有 hook 的脚本

2. 这些脚本除了文件名之外，别的都一摸一样，包括内容：比如 Mac 上就都长下面这样：

```bash
#!/bin/sh
# husky

# Created by Husky v4.2.5 (https://github.com/typicode/husky#readme)
#   At: 7/5/2021, 1:31:56 PM
#   From: /Users/EricYangXD/test/husky-test/node_modules/husky (https://github.com/typicode/husky#readme)

. "$(dirname "$0")/husky.sh"
```

3. 最后根据 package.json 的配置，执行我们定义相对应的 hook 脚本。

## 启动一个本地 mock server

1. 在 webpack.base.config.js:

```js
const mockServer = require('./mock_server/index');
const isMock = process.env.MOCK_ENV === 'mock'; // 配置在package.json的script中
devServer: {
    ...
    before: app => {
      if (isMock) {
        mockServer(app);
      }
    },
    ...
  },
```

2. mock_server/index.js:

```js
const cloud = require("./cloud");
const mock = require("./mock");

module.exports = (app) => {
  app.use("/cloud", cloud);
  app.use("/mock", mock);
};
```

3. mock.js

```js
const express = require('express');
const router = express.Router();
// mock api url
router.get('/news/list', (req, res) => {
  res.json({...});
});
...
module.exports = router;
```

## 启动一个本地文件上传 mock server

[参考](https://github.com/EricYangXD/upload-file-server)

下载启动之后，自己配置上传的 URL 即可

## 断点调试

Debugger 打断点的方式除了直接在对应代码行单击的普通断点以外，还有很多根据不同的情况来添加断点的方式。

一共有六种：

1. 普通断点：运行到该处就断住
2. 条件断点：运行到该处且表达式为真就断住，比普通断点更灵活
3. DOM 断点：DOM 的子树变动、属性变动、节点删除时断住，可以用来调试引起 DOM 变化的代码
4. URL 断点：URL 匹配某个模式的时候断住，可以用来调试请求相关代码
5. Event Listener 断点：触发某个事件监听器的时候断住，可以用来调试事件相关代码
6. 异常断点：抛出异常被捕获或者未被捕获的时候断住，可以用来调试发生异常的代码

这些打断点方式大部分都是 Chrome Devtools 支持的（普通、条件、DOM、URL、Event Listener），也有的是 VSCode Debugger 支持的（普通、条件、异常）。

## 常用 node 工具

### nvm

管理 nodejs 版本

1. 官方`curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash`命令不好使
2. 使用 gitee，执行并重新打开 zsh 即可

   - `cd ~/ git clone https://gitee.com/Annlix/nvm-sh_nvm.git .nvm`如果仓库没了或者很慢，可以在 Gitee 搜一下别的替换即可
   - 复制之后让然需要手动配置.zshrc 文件，如下 3.

3. 使用 brew 安装

   - You should create NVM's working directory if it doesn't exist: `mkdir ~/.nvm`
   - Add the following to `~/.zshrc` or your desired shell configuration file:

     ```sh
     export NVM_DIR="$HOME/.nvm"
     [ -s "/usr/local/opt/nvm/nvm.sh" ] && \. "/usr/local/opt/nvm/nvm.sh"  # This loads nvm
     [ -s "/usr/local/opt/nvm/etc/bash_completion.d/nvm" ] && \. "/usr/local/opt/nvm/etc/bash_completion.d/nvm"  # This loads nvm bash_completion
     ```

   - You can set $NVM_DIR to any location, but leaving it unchanged from `/usr/local/opt/nvm` will destroy any nvm-installed Node installations upon upgrade/reinstall.

4. 常用命令：
   - `nvm install version`
   - `nvm use version`
   - `nvm uninstall version`
   - `nvm ls`
   - `nvm ls-remote`
   - `nvm alias default v10.24.1`
   - `nvm run 6.10.3 app.js`
   - `nvm --help`
   - `nvm exec 4.8.3 node app.js`
   - `nvm set-colors cgYmW`
   - `to remove, delete, or uninstall nvm - just remove the '$NVM_DIR' folder (usually '~/.nvm')`
   - `nvm unalias <name>`
   - `nvm uninstall <version>`

### npm

nodejs 原生自带包管理工具。

1. `npm add` 和 `npm install` 完全等价。`npm add` 是 `npm install` 的 别名 之一，所以当我们执行 `npm add` 时，对于 npm 来说完完全全等同于执行了 `npm install`
2. 在 8.x 版本，npm install 在之前 add、i 的基础上增加了 9 个别名，它们是：`in, ins, inst, insta, instal, isnt, isnta, isntal, isntall`
3. 每个 script 脚本都有前任与下一任：比如在执行 `npm run build` 指令执行之前，做一些特定的别的操作，或者在执行之后执行一些操作，应该定义以下两个脚本：

```js
{
  "scripts": {
    "prebuild": "",// 这是 build 执行前的钩子
    "postbuild": "" // 这是 build 执行后的钩子
  }
}
```

4. 通过 `npm link`，能创造一些实用的工具指令。`npm link`可以创建一个软连接，使得你可以在不发布到 npm 源的情况下，在 B 项目里依赖 A 项目进行联调。
   - 在项目的 package.json 里定义了 bin 属性，并将它指向某个可执行的脚本文件。
   - 一旦你在项目里通过 npm link 发布了，恭喜你，你只需要在命令行中输入 i-love-u 就会直接执行它所指向的脚本了。

```js
{
  "bin": {
    "i-love-u": "src/index.js"
  }
}
```

5. 当你使用依赖时，导入的具体是哪个文件:
   1. 从 node 14.x 版本开始，package.json 里支持了 exports 属性，当它存在时，它的优先级最高。
   2. 当 exports 属性不存在，而 module 属性存在时，构建工具（如 webpack、rollup）会把 module 属性作为 ESM 的入口来使用。
   3. 如果 exports 和 module 都不存在，则 package.json 中的 main 属性会成为指定入口的唯一属性。
6. 默认情况下，只要运行`npm install`，`package-lock.json`就会更新。然而，这可以通过在`~/.npmrc`全局设置`package-lock=false`禁用。
7. `npm install --package-lock`: 生成`package-lock.json`文件，此命令是全局`package-lock=false`设置处于活动状态时，强制执行`package-lock.json`更新的唯一保证方式。
8. `npm config set ignore-scripts true`，`npm i --ignore-scripts`或者`yarn --ignore-scripts`，在安装依赖包时，确保添加`–ignore-scripts`后缀以禁止 npm 里第三方依赖包的预先安装脚本或则安装后脚本被执行，这样就可以避免一个恶意包里的病毒。这样可以减轻恶意代码的危害，但同时也会导致下载的依赖包没有正常发挥作用。
9. 怎么样可以预先了解哪些依赖包需要脚本文件，我们不能使用`–ignore-scripts`后缀呢？可以预先先去下载`can-i-ignore-scripts`这个依赖包：可以帮助我们分析各个依赖包是否可以使用`--ignore-scripts`命令。去官网下载或者`npx can-i-ignore-scripts`安装。
10. 如何使用这个工具呢？我们去安装了 node_modules 包的目录下运行`can-i-ignore-scripts`命令去查看。
11. npm 脚本有 pre 和 post 两个钩子。举例来说，build 脚本命令的钩子就是 prebuild 和 postbuild。用户执行 npm run build 的时候，会自动按照下面的顺序执行。`npm run prebuild && npm run build && npm run postbuild`。

### yrm/nrm

1. 管理 registry 源地址：`npm i yrm -g`，推荐 yrm
2. 手动修改源：`npm config set registry https://registry.npm.taobao.org`
3. 通过`.npmrc`文件可以设置项目级的配置

```bash
registry = https://registry.npm.taobao.org/
@juejin:registry = https://siyouyuan.org/
```

以上两行代码分别做了如下两件事：

- @juejin 命名空间的项目，直接在私有源请求包;
- 其他包则从 taobao 源发起请求。

### pm2

PM2 是 node 进程管理工具，可以利用它来简化很多 node 应用管理的繁琐任务，如性能监控、自动重启、负载均衡等，而且使用非常简单。`npm install -g pm2`，使用的时候`pm2 node.js`

### nodemon

nodemon 是 node 的一个调试工具。当我们修改了后台 node 服务器的代码之后，都需要重启 node 服务器。我们可以使用 nodemon 来自动重启服务。
`npm install -g nodemon`，使用的时候`nodemon node.js`

### npm/yarn/pnpm

1. npm 是 nodejs 自带的
2. `brew install yarn`
3. `npm install -g pnpm`

### ni

自动依赖安装，不用管 `npm/yarn/pnpm`， `npm i ni -g`

### npm ERR! code EINTEGRITY 解决方案

0. [github issue](https://github.com/npm/npm/issues/16861)
1. 可以删除 package-lock.json；
2. 可以选择执行下面的操作：

```sh
npm cache verify
// 清理npm缓存
npm cache clean
npm cache clean --force
// 更新npm版本
npm i -g npm
// 修改SHA
grep -ir "sha1-xxxxxxxxxxxxxxxx" ~/.npm

npm install --no-shrinkwrap --update-binary
```

### Chrome 浏览器如何强制刷新页面(不使用缓存)？

1. 按下 F12(Windows) 或 Cmd+Opt+I(MAC)，打开"开发者工具"；
2. 在左上角「浏览器刷新」按扭上点右键，在弹出菜单上选择"清空缓存并硬件加载"；

### Chrome 浏览器网络请求日志

chrome://net-export/

### zsh 打印本机公网 ip

```sh
#!/bin/bash

ip=$(curl -s http://myip.ipip.net)
echo "My public IP address is: $ip"
```

或 `curl cip.cc`

### 快速请求一个网址

`http --pretty format get https://www.baidu.com/`

## wechat helper

1. [WeChatExtension-ForMac](https://github.com/MustangYM/WeChatExtension-ForMac)

2. omw (Oh My WeChat) 是[微信小助手](https://github.com/MustangYM/WeChatExtension-ForMac)的安装/更新工具

### 安装

1. `curl -o- -L https://omw.limingkai.cn/install.sh | bash -s`
2. `sudo rm -r -f WeChatExtension-ForMac && git clone --depth=1 https://github.com/MustangYM/WeChatExtension-ForMac && cd WeChatExtension-ForMac/WeChatExtension/Rely && ./Install.sh && cd ~`

### 卸载

1. `bash <(curl -sL https://git.io/JUO6r)`
2. `omw un`

## tar：file-changed-as-we-read-it 报错处理

在使用 tar 命令对 Mysql 的数据目录进行备份打包时出现如下报错：

- command: `tar cvzf mysql.tgz mysql`

- error: `/bin/tar: /path/to/mysql: file changed as we read it`

1. 因为在打包的过程中文件发生了变化，所以导致报错，但是打包依然进行并且有效。需要屏蔽的是文件修改的报错：`file-changed %s: file changed as we read it`，在使用 tar 命令时加上`--warning=no-file-changed`参数即可不输出报错。例：`/bin/tar --warning=no-file-changed -zcvf /path/to/bak/archive.tar.gz \ --exclude '*.pyc' --exclude .git -C /path/to/app target_dir_name`
2. tar 命令的退出值会有三种情况：
   - 0 - Successful termination. - 1 - Some files differ. - 2 - Fatal error
     在返回值为 1 的时候，还有以下情况:

- 当使用 `--compare (--diff, -d)` 调用 tar 命令的时候，表示 tar 包中的文件与磁盘上对应的文件不一致。
- 当使用`--create, --append or --update`参数时候，表示打包过程中，文件有变化，导致无法打包准确的文件内容。
  所以当返回值为 1 的时候，可以认为 tar 命令还是能够正确打包完成，只不过可能无法包含最终准确的内容而已，可以认为这个时候 tar 命令结果还是正常的。因此可以通过忽略返回值为 1 的情况，参考以下信息：

```sh
set +e
tar -czf sample.tar.gz dir1 dir2
exitcode=$?

if [ "$exitcode" != "1" ] && [ "$exitcode" != "0" ]; then
		exit $exitcode
fi
set -e
```

## ApiFox 使用技巧

### 本地接口 mock

1. 直接添加接口，设置对应的环境，设置 response 响应字段，可以对字段定义 mock 规则，即可 mock。
2. 如果不想使用 mock，只是使用已有的 response 响应数据，那么可以使用高级 mock 功能，在「脚本」中配置返回值，页面旁边就有官方示例。需要开启才能 mock。

### tips

1. `{}`:接口 path 中的单个花括号表示路径 path 参数，可以配置相应 mock 规则
2. `{{}}`:接口 path 中的双花括号表示全局设置的变量，可以从右上角进入管理设置页面
3. 添加 cookie 时，只能一个一个添加，从右下角「Cookie 管理」进入管理设置页面

## npm 踩坑记录

### npm 安装 node-sass 经常失败

> node-sass 已经淘汰，现在都用 dart-sass

- 在使用 npm 安装依赖时，遇到含有二进制文件的依赖包会经常失败，比如：node-sass、puppeteer 等
- 为什么配置了国内镜像源安装也会失败？因为配置的国内镜像源只对 npm 包生效，而其中包含的二进制文件使用的是专门的下载地址，需要单独配置

解决方法:

- 前置知识：.npmrc
- .npmrc 文件是 npm 的配置文件
- 当在使用 npm 时它会从命令行、环境变量和 .npmrc 文件中获取其配置
- 其加载优先级：命令行 > 项目 .npmrc > 全局 .npmrc > 默认
- yarn 的配置文件为 .yarnrc
- pnpm 的配置文件为 .npmrc

1. 临时解决（以 node-sass 为例）

```sh
npm install -D node-sass --sass_binary_site=https://npmmirror.com/mirrors/node-sass
# OR
yarn add -D node-sass --sass_binary_site=https://npmmirror.com/mirrors/node-sass
```

2. 长期解决

在项目根目录新建 .npmrc 文件，然后配置对应的二进制下载地址

```sh
# npm 镜像地址
registry=https://registry.npmmirror.com

# 二进制文件下载地址
sass_binary_site=https://npmmirror.com/mirrors/node-sass
phantomjs_cdnurl=https://npmmirror.com/mirrors/phantomjs
electron_mirror=https://npmmirror.com/mirrors/electron
profiler_binary_host_mirror=https://npmmirror.com/mirrors/node-inspector
chromedriver_cdnurl=https://npmmirror.com/mirrors/chromedriver
```

## h5 跳转中转页唤醒应用商店

一般的做法是用户扫二维码或者手机浏览器访问 url，打开中转页面，在中转页面上我们通过`navigator.userAgent`可以判断当前用户的操作系统是安卓还是 ios，然后通过`window.location.href = targetUrl`的方式来跳转到应用商店或者 appstore。

对于在微信中的跳转（一般国内用户都会用微信扫码），ios 可以通过上述方案实现自动跳转到 appstore。而对于安卓用户，因为微信浏览器的缘故，不会自动跳转浏览器或目标 app（其实是有方法的，需要自家的 app 端和微信申请 APPID 和 h5 接入微信`weixin-js-sdk`，使用微信的提供的开放标签），这是一般建议在中转页面做个提示，比如：请手动点击右上角选择在浏览器中打开。让用户手动处理。

### 安卓

如何通过 H5 跳转至应用商店下载指定 app, 实现方式如下：

- `window.location.href = "market://details?id=com.jingdong.app.mall"`
- 一般来说上面的方式就够了

> 注：url 地址主要分为 2 部分：应用商店地址 + 应用包名

目前国内主流应用商店地址如下：

- oppo 应用商店下载 QQ：`oppomarket://details?packagename=com.tencent.mobileqq`
- 华为应用商店：`appmarket://details?id=com.xx.xx`
- 小米应用商店：`mimarket://details?id=com.xx.xx`
- OPPO 应用商店：`oppomarket://details?packagename=com.xx.xx`
- vivo 应用商店：`vivomarket://details?id=com.xx.xx`
- 三星应用商店：`samsungapps://ProductDetail/com.xx.xx`
- [其他参考](https://juejin.cn/post/6865182194608898061)

### iOS

类似这种：`window.location.href = "https://apps.apple.com/us/app/%E4%BA%AC%E4%B8%9C-%E4%B8%8D%E8%B4%9F%E6%AF%8F%E4%B8%80%E4%BB%BD%E7%83%AD%E7%88%B1/id414245413"`

## Office 文档前端处理展示

1. 用 `「sheet.js」` 来解析 xlsx，`「mammoth.js」` 来解析 word -- 可以调 API 转换成简单的 html 或者 markdown，`「pptxjs」` 来解析 ppt
2. Office 在线预览方案：

   - WPS 金山文档在线预览编辑服务：支持在线预览编辑，多人协同[接入文档](https://wwo.wps.cn/docs/)
   - 阿里云 IMM，支持文件转换预览：但是需要与阿里云 OSS 一起使用[接入文档](https://help.aliyun.com/zh/imm/product-overview/what-is-imm)
   - 微软 Office Web Viewer：调用微软在线预览服务，用法简单。重点是免费，官网栗子：`http://view.officeapps.live.com/op/view.aspx?src=文件地址`，Office Web 应用程序查看器工具还可用于将 Microsoft Office 文档嵌入到您的网站或博客中。嵌入代码是这样的：`<iframe src="https://view.officeapps.live.com/op/embed.aspx?src=文件地址" width="100%" height="600px" frameborder="0">`
   - 微软 Office Online Server：可私有部署
   - Google Drive 查看器：Google Drive 包含一个内置的查看器功能，允许您直接在浏览器中查看 Office 文件，而无需下载它们。文件从托管网站流式传输，也不会上传到您的 Google Drive。`https://drive.google.com/viewer?url=FILE_URL`，同样也可以嵌入到网页中：`<iframe src="https://drive.google.com/viewer?url=FILE_URL&embedded=true&hl=en-US" width="100%" height="600px" frameborder="0">`
   - Office 文件转 PDF：office 文件转 pdf，浏览器可以自动预览。 可使用 libreoffice、OpenOffice 转换
   - onlyoffice 可以私有部署社区版免费

3. 主流的三个办公文件 excel、word、ppt 本质上都是一个包含多个文件目录且每个目录中含有一些.xml 文件的压缩包而已。另外他们的压缩算法通常都是 zip。
4. 当我们的办公文件（excel、word、ppt）解压缩之后就变成一堆 xml 文件了，然后在浏览器端可以通过`DOMParser Api`进行解析，可以把数据提取出来生成「json」，也可以创建为「DOM」。第三方库将依据 Microsoft Office Open XML 标准提取信息。
5. PDF 对应的就是电子世界的打印纸张，它拥有「不可编辑」、「占用空间小」、「稳定性强」、「可加密」等特点，它由「Adobe」于 1993 年首次提出，旨在实现跨平台和可靠性的文档显示。PDF 文件可以包含文本、图形、图像和其他多媒体元素，并以一种独立于操作系统和硬件的方式呈现。PDF 的本质就是一套有含义的指令集合，用来描述一份文档信息绝对位置。
6. PDF 文件不是压缩包，PDF 中描述了文字的布局信息，相当于一个指针告诉解析器应该在哪个位置画一个怎样的符号。我们可以选择使用「embed」标签或者「iframe」标签来解析 PDF。
7. `vue-office`x 支持多种文件(docx、excel、pdf、pptx)预览的 vue 组件库，支持 vue2/3。也支持非 Vue 框架的预览，分为多个包。貌似是闭源？

## 有用的前端库

1. `jszip`：用于创建、读取和编辑 `「.zip」` 文件的 JavaScript 库，支持浏览器和 Nodejs
2. `turndown`：使用 JavaScript 开发的 HTML to Markdown 转换器
3. `markmap`：使用思维导图的方式来实现 Markdown 文档的可视化
4. `docx` 或 `html-docx-js`：前端动态生成 Word 文档
5. `ni`：`npm i -g @antfu/ni`，智能安装前段依赖
6. `pdf.js`：解析 PDF 文件，还有很多能预览 pdf 的库，但是一般可以直接借助 iframe 即浏览器自身来预览即可了。
7. `@nest-public/totp`：是一个用 TypeScript 编写的 TOTP 库。它提供了一个简单易用的 API，可以方便地生成和验证 TOTP 密码。
8. `docxjs`：`npm install docx-preview`在线预览 docx 文件
9. `vue-office`：支持多种文件(docx、excel、pdf、pptx)预览的 vue 组件库，支持 vue2/3。也支持非 Vue 框架的预览，分为多个包。貌似是闭源？
10. `docx-preview`：`npm install docx-preview`在线预览 docx 文件

## DOM Api 解析 xml

xml 本质还是文本文件，可以通过 DOM Api 解析 xml

```js
// 假设有以下 XML 数据
var xmlData = `
      <employees>
          <employee>
              <id>1</id>
              <name>John Doe</name>
              <position>Developer</position>
          </employee>
          <employee>
              <id>2</id>
              <name>Jane Smith</name>
              <position>Designer</position>
          </employee>
      </employees>
    `;

// 创建 DOMParser 对象
var parser = new DOMParser();

// 使用 DOMParser 解析 XML 字符串
var xmlDoc = parser.parseFromString(xmlData, "text/xml");

// 获取 XML 中的元素
var employees = xmlDoc.getElementsByTagName("employee");

// 遍历元素并输出内容
for (var i = 0; i < employees.length; i++) {
  var id = employees[i].getElementsByTagName("id")[0].textContent;
  var name = employees[i].getElementsByTagName("name")[0].textContent;
  var position = employees[i].getElementsByTagName("position")[0].textContent;

  console.log("Employee ID: " + id);
  console.log("Name: " + name);
  console.log("Position: " + position);
  console.log("--------------------");
}
```

## 前端压缩解压缩示例

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>JSZip Demo</title>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.1.5/jszip.min.js"></script>
  </head>
  <body>
    <script>
      // 压缩字符串
      function compressString(originalString) {
        return new Promise((resolve, reject) => {
          const zip = new JSZip();
          zip.file("compressed.txt", originalString);
          zip
            .generateAsync({ type: "blob" })
            .then((compressedBlob) => {
              const reader = new FileReader();
              reader.onload = () => resolve(reader.result);
              reader.readAsText(compressedBlob);
            })
            .catch(reject);
        });
      }

      // 解压缩字符串
      function decompressString(compressedString) {
        return new Promise((resolve, reject) => {
          const zip = new JSZip();
          zip
            .loadAsync(compressedString)
            .then((zipFile) => {
              const compressedData = zipFile.file("compressed.txt");
              // debugger;
              if (compressedData) {
                return compressedData.async("string");
              } else {
                reject(new Error("Unable to find compressed data in the zip file."));
              }
            })
            .then(resolve)
            .catch(reject);
        });
      }

      // 示例
      const originalText = "Hello, this is a sample text for compression and decompression with JSZip.";
      console.log("Original Text:", originalText);

      // 压缩字符串
      compressString(originalText)
        .then((compressedData) => {
          console.log("Compressed Data:", compressedData);

          // 解压字符串
          decompressString(compressedData)
            .then((decompressedText) => {
              console.log("Decompressed Text:", decompressedText);
            })
            .catch((error) => {
              console.error("Error during decompression:", error);
            });
        })
        .catch((error) => {
          console.error("Error during compression:", error);
        });
    </script>
  </body>
</html>
```

## 如何在线上使用 SourceMap

常见的使用姿势是通过浏览器的开发者工具进行本地调试，而在线上使用 SourceMap 则需要手动添加 SourceMap 地址。针对线上无法自动加载 SourceMap 的问题，可以尝试使用浏览器插件、Charles 进行转发或者私有静态服务托管 SourceMap。

### 浏览器是如何识别并加载 SourceMap 的

如果我们让构建工具开启了 `SourceMap`，例如 Webpack 的 `devtools`，源码经过构建过程（编译、混淆、压缩等）生成的部署代码会在底部增加一行注释，如下：`//# sourceMappingURL=detect_angular_for_extension_icon_bundle.js.map`

`sourceMappingURL` 告诉我们，当前资源文件 `ConsoleSiteList.57ca29c2.chunk.js` 对应的 `SourceMap` 文件的路径是 `ConsoleSiteList.57ca29c2.chunk.js.map`。这是相对路径的写法，也就是说，在本地启用的服务中，构建后的 `chunk` 和对应的 `SourceMap` 文件的地址分别为：

构建后的 `chunk` 地址：`http://localhost:3000/ConsoleSiteList.57ca29c2.chunk.js`

对应 `SourceMap` 地址：`http://localhost:3000/ConsoleSiteList.57ca29c2.chunk.js.map`

这样一来，浏览器就可以根据 `sourceMappingURL` 去自动加载 `SourceMap`，而不用苦哈哈的手动添加。

### 查看浏览器是否加载了 SourceMap

打开 `DevTools Network` 标签页，使用过滤器过滤 `.map` 文件，我们发现什么都没有！这是出于安全考虑有意为之。不过我们仍然有其他手段看到 `.map` 文件的请求，打开 `Charles` 抓一把，就可以看到一堆迷途的请求。或者打开浏览器`Developer Resources`（开发者工具右上角三个点->`More tools`） 标签页过滤出 `SourceMap` 相关的请求即可（也可以使用 `net-internals`）。

### 为什么本地可以自动加载而线上不可以

一般来讲，线上产物中会把 `SourceMap` 去除，除了为了加速构建过程，更重要的是避免有开发经验的人直接在浏览器中「阅读源码」。除了直接去除，企业内也常常利用内部的存储能力，将构建好的 `SourceMap` 资源转存到其他地方比如内网，这样一来，构建产物中的 `sourceMappingURL` 将无法正确指向 `SourceMap` 的资源地址，从而实现与直接去除接近的效果。

这样一来，在生产环境下 Chrome 根据 `sourceMappingURL` 相对路径的写法就只能寻址到不存在的 404，浏览器会加载不到需要的资源。

### 排查线上 bug 的做法

前提是打包的时候生成了`SourceMap` 资源，否则也不好直接看源码。

1. 发现控制台中报异常，根据 Chrome 提供的堆栈定位到报错文件
2. 在代码编辑面板中，右键 - `Reveal in sidebar`，在文件树中定位到部署文件
3. 右键部署文件，点击 `Copy link address`，在控制台中查看资源的地址，其实目的就是推测一下`SourceMap` 资源地址
4. 确定构建产物对应的 `SourceMap` 资源地址
5. 在代码编辑面板，右键 - `Add source map`，添加 `SourceMap` 地址，即上一步 4 的 `SourceMap` 资源地址
6. 从已经映射到源码的堆栈信息再次进入，即可看到报错在源码中的位置

### 具体做法尝试

1. 基于浏览器插件 Redirect 资源请求 -- 比如使用 `XSwitch` 插件，不行！能够确定的是：

   - 只有在 `DevTools` 打开时才会加载 `SourceMap`（性能优化 & 用户并不需要）
   - `DevTools` 也是一种扩展，而扩展是无法拦截另一个扩展的请求的（安全性问题）
   - `SourceMap` 的加载不能从 `Network` 中看到而要从 `Developer Resources` 看到（这也是故意的设计）
   - 基于以上信息，可以理解为 `Chrome Extension` 主要还是用于折腾 content 区域，而不是希望你 hack 浏览器。

2. 基于 `Charles -> Tools -> Map Remote` -- 可行

   - 因为 `Chrome` 检测到 `sourceMappingURL` 后会实际发起请求，所以使用 `Charles` 进行转发是肯定可行的。

3. 基于私有静态服务托管 SourceMap -- 可行

在构建时将 `SourceMap` 上传至某个私有的地址（如 CDN 或 OSS），然后利用 `Webpack` 插件将 `sourceMappingURL` 改为该私有地址。这样开发人员在打开 `DevTools` 时，`Chrome` 将根据 `sourceMappingURL` 直接加载实际的 `SourceMap` 地址，而外部用户则完全被隔离(因为他们无法访问内网或没有权限)。

4. 通过浏览器插件在响应头`Http Header`中添加 `SourceMap`，设为实际的`SourceMap`地址 -- 可行
   - `SourceMap` 文件在命名上与源文件保持一致，仅额外多出 `.map` 后缀
   - 添加 `Http Header：sourcemap`，浏览器将识别并加载 `SourceMap` 文件
   - `sourceMappingURL` 注释的优先级比 `HttpHeader sourcemap` 的优先级高
   - `Rollup`打包时 `sourcemap` 需指定为 `hidden`，其效果等同 `Webpack` 的 `hidden-source-map`，此时会构建出 `SourceMap` 但不会有 `sourceMappingURL` 的注释。这样我们就可以保证只有 `Http Header sourcemap` 生效。
   - 以 Manifest V2 为例，插件代码如下:

```js
const REGEX = /^.*g\.alicdn\.com\/(马上到！|aimake|muyang-test)\/(.*)\.js.*/;
const TARGET_TPL = "https://sourcemap.def.alibaba-inc.com/sourcemap/$1/$2.js.map?enableCatchAll=true";

chrome.webRequest.onHeadersReceived.addListener(
  function (details) {
    if (details.url.match(REGEX)) {
      const targetUrl = details.url.replace(REGEX, TARGET_TPL);
      const headerSourcemap = { name: "sourcemap", value: targetUrl };
      const responseHeaders = details.responseHeaders.concat(headerSourcemap);
      return { responseHeaders };
    }
    return { responseHeaders: details.responseHeaders };
  },
  // filters
  {
    urls: ["<all_urls>"],
  },
  // extraInfoSpec
  ["blocking", "responseHeaders", "extraHeaders"]
);
```

## 流程图/时序图

```bash
title:sequenceDiagram
participant 用户
participant ChatGPT
participant MCP服务端
participant 金融数据API

用户->>ChatGPT: 输入查询请求
ChatGPT->>MCP服务端: 调用stockHistory工具
MCP服务端->>金融数据API: 获取TSLA历史数据
MCP服务端->>金融数据API: 获取NVDA历史数据
MCP服务端->>ChatGPT: 返回结构化数据
ChatGPT->>MCP服务端: 调用analyzeTrend工具
MCP服务端->>ChatGPT: 流式返回分析结果
ChatGPT->>用户: 生成自然语言报告    
```
