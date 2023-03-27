---
title: Node.js
author: EricYangXD
date: "2022-02-23"
---

## 记录 nodejs 知识

### npx

- npx 想要解决的主要问题:

  1.  就是「**调用项目内部安装的模块**」。
  2.  npx 还能「**避免全局安装的模块**」。

- Node 自带 npm 模块(npm 从 5.2 版开始，增加了 npx 命令)，所以可以直接使用 npx 命令。万一不能用，就要手动安装一下。`npm install -g npx`。
- npx 的原理很简单，就是运行的时候，会到`node_modules/.bin`路径和环境变量`$PATH`里面，检查命令是否存在。
- 由于 npx 会检查环境变量`$PATH`，所以系统命令也可以调用。`ls`==`npx ls`。
- 注意，Bash 内置的命令不在`$PATH`里面，所以不能用。比如，`cd`是 Bash 命令，因此就不能用`npx cd`。
- npx 还能避免全局安装的模块。比如，`create-react-app`这个模块是全局安装，npx 可以运行它，而且不进行全局安装。
- 下载全局模块时，npx 允许指定版本。
- 注意，只要 npx 后面的模块无法在本地发现，就会下载同名模块。比如，本地没有安装 http-server 模块，后面的命令会自动下载该模块，在当前目录启动一个 Web 服务。`npx http-server`。
- 如果想让 npx 强制使用本地模块，不下载远程模块，可以使用`--no-install`参数。如果本地不存在该模块，就会报错。`npx --no-install http-server`。
- 如果忽略本地的同名模块，强制安装使用远程模块，可以使用`--ignore-existing`参数。比如，本地已经全局安装了`create-react-app`，但还是想使用远程模块，就用这个参数。`npx --ignore-existing create-react-app my-react-app`。
- 利用 npx 可以下载模块这个特点，可以指定某个版本的 Node 运行脚本。它的窍门就是使用 npm 的 node 模块。`npx node@0.12.8 -v`。命令会使用 0.12.8 版本的 Node 执行脚本。原理是从 npm 下载这个版本的 node，使用后再删掉。某些场景下，这个方法用来切换 Node 版本，要比 nvm 那样的版本管理器方便一些。
- `-p`参数用于指定 npx 所要安装的模块，所以上个的命令可以写成这样：`npx -p node@0.12.8 node -v`。
- `-p`参数对于需要安装多个模块的场景很有用。`npx -p lolcatjs -p cowsay [command]`
- `-c`参数可以将所有命令都用 npx 解释。如果 npx 安装多个模块，默认情况下，所执行的命令之中，只有第一个可执行项会使用 npx 安装的模块，后面的可执行项还是会交给 Shell 解释。`npx -p lolcatjs -p cowsay -c 'cowsay hello | lolcatjs'`
- `-c`参数的另一个作用，是将环境变量带入所要执行的命令。`npx -c 'echo "$npm_package_name"'`
- npx 还可以执行 GitHub 上面的模块源码。执行 Gist 代码`npx https://gist.github.com/zkat/4bc19503fe9e9309e2bfaa2c58074d32`
- 执行仓库代码`npx github:piuccio/cowsay hello`
- 注意，远程代码必须是一个模块，即必须包含`package.json`和入口脚本。

#### 调用项目内部安装的模块

1. 比如，项目内部安装了测试工具 Mocha。`npm install -D mocha`
2. 一般来说，调用 Mocha ，只能在项目脚本和 package.json 的 scripts 字段里面，如果想在命令行下调用，必须像下面这样。`node-modules/.bin/mocha --version`
3. 通过 npx 调用就会很简单：`npx mocha --version`
4. npx 的原理很简单，就是运行的时候，会到`node_modules/.bin`路径和环境变量`$PATH`里面，检查命令是否存在。
5. 由于 npx 会检查环境变量`$PATH`，所以系统命令也可以调用。`npx ls`
6. 注意，Bash 内置的命令不在`$PATH`里面，所以不能用。比如，cd 是 Bash 命令，因此就不能用`npx cd`。

#### 避免全局安装的模块

- npx 可以运行某些模块/脚手架工具，而且不进行全局安装。`npx create-react-app my-react-app`
- npx 将`create-react-app`下载到一个临时目录，使用以后再删除。所以，以后再次执行上面的命令，会重新下载`create-react-app`。只要 npx 后面的模块无法在本地发现，就会下载同名模块。
- 下载全局模块时，npx 允许指定版本。`npx uglify-js@3.1.0 main.js -o ./dist/main.js`

### require 工作原理

- require 方法

```js
Module.prototype.require = function (id) {
  if (typeof id !== "string") {
    throw new ERR_INVALID_ARG_TYPE("id", "string", id);
  }
  if (id === "") {
    throw new ERR_INVALID_ARG_VALUE("id", id, "must be a non-empty string");
  }
  return Module._load(id, this, /* isMain */ false);
};
```

- \_load 方法

```js
Module._load = function (request, parent, isMain) {
  if (parent) {
    debug("Module._load REQUEST %s parent: %s", request, parent.id);
  }

  var filename = Module._resolveFilename(request, parent, isMain);

  var cachedModule = Module._cache[filename];
  if (cachedModule) {
    updateChildren(parent, cachedModule, true);
    return cachedModule.exports;
  }

  if (NativeModule.nonInternalExists(filename)) {
    debug("load native module %s", request);
    return NativeModule.require(filename);
  }

  // Don't call updateChildren(), Module constructor already does.
  var module = new Module(filename, parent);

  if (isMain) {
    process.mainModule = module;
    module.id = ".";
  }

  Module._cache[filename] = module;

  tryModuleLoad(module, filename);

  return module.exports;
};
```

如上，require 的大致过程如下：

1. 先检测传入的 id 是否有效。
2. 如果有效，则调用 Module.\_load 方法，该方法主要负责加载新模块和管理模块的缓存，而 require 本身就是对该方法的一个封装。
3. 然后会调用 Module.\_resolveFilename 去取文件地址。

- 1. 查询文件名是否是核心模块，如果是直接返回传入的 id
- 2. 因为 option 没有参数传入，所以会调用 Module.\_resolveLookupPaths 方法去获取路径
- 3. 调用 Module.\_findPath 方法
  - \_resolveLookupPaths：其实就是 node 解析模块中的路径查找，他会向父目录查找，直到根目录为止。
  - \_findPath：其实就是将\_resolveLookupPaths 查找出来的文件名和文件 id 向匹配，返回一个文件地址。

4. 判断是否有缓存模块，如果有则返回缓存模块的 exports。
5. 如果没有缓存，再检测文件名是否是核心模块，如果是则调用核心模块的 require。
6. 如果不是核心模块，那么创建一个新的 module 对象。
7. 在 Module.\_cache 中缓存该对象，`Module._cache[filename] = module;`。
8. 调用`tryModuleLoad(module, filename);`，去尝试加载模块，如果报错，那么清除模块的缓存。
9. 返回模块本身的 exports 对象。

## RPC 协议之 protobuf

nodejs 中的 `protobufjs` 库包含一个 `toObject` 方法，该方法提供一个可以传递给 `JSON.stringify()` 的纯 javascript 对象。接收一个 protobuf 实例对象和一个配置对象。返回一个 js 对象。

## 常用 npm 脚本示例

```Bash
# 删除目录
"clean": "rimraf dist/*",

# 本地搭建一个 HTTP 服务
"serve": "http-server -p 9090 dist/",

# 打开浏览器
"open:dev": "opener http://localhost:9090",

# 实时刷新
 "livereload": "live-reload --port 9091 dist/",

# 构建 HTML 文件
"build:html": "jade index.jade > dist/index.html",

# 只要 CSS 文件有变动，就重新执行构建
"watch:css": "watch 'npm run build:css' assets/styles/",

# 只要 HTML 文件有变动，就重新执行构建
"watch:html": "watch 'npm run build:html' assets/html",

# 部署到 Amazon S3
"deploy:prod": "s3-cli sync ./dist/ s3://example-com/prod-site/",

# 构建 favicon
"build:favicon": "node scripts/favicon.js",
```

### npm adduser

切换私有仓库之后，可能需要登录才能下载依赖。

1. `yrm/nrm` 切换到对应的源。或者手动切换`npm config set registry=xxxx`。
2. 然后`npm adduser`:输入用户名密码邮箱即可。
3. 之后`.npmrc`文件中会增加一行类似：`//registry.npmjs.org/:_authToken=MYTOKEN`
4. 重新`npm i`。
5. [参考这里](https://docs.npmjs.com/cli/v8/configuring-npm/npmrc)

> `Unable to authenticate, need: BASIC realm="Sonatype Nexus Repository Manager"`这个报错怎么解决？

1. 如上，登录即可，注意`.npmrc`文件中的 registry 要配置正确，应该以`/`结尾？？（TODO）
2. `package-lock=false` // 在安装时忽略 lock 文件。
3. `loglevel=timing` // 安装依赖包的时候指定日志的类型
4. `ignore-scripts=false` // 执行通过`npm i`安装的依赖中的脚本

## 基础 api/方法

### path

1. `const path = require('path');`，`node:path` 模块提供了用于处理文件和目录路径的实用程序。
2. `path.basename(path[, suffix(加上后缀，则只返回文件名)])`:返回路径的最后一部分，类似于 Unix basename 命令。忽略尾随目录分隔符。
3. `path.dirname('/foo/bar/baz/asdf/quux');`:返回路径的目录名称'/foo/bar/baz/asdf'，类似于 Unix dirname 命令。
4. `path.parse(path)`:解析路径字符串，返回一个对象，其属性表示路径的重要元素：dir、root、base、name、ext

### path.join vs path.resolve with `__dirname`

1. `const absolutePath = path.join(__dirname, some, dir);`:`path.join` 将连接 `__dirname`--它是当前文件的目录名，与 some 和 dir 的值连接，带有特定于平台的分隔符。(从左向右进行拼接)，返回相对路径。参数都是 string
2. `const absolutePath = path.resolve(__dirname, some, dir);`:`path.resolve` 将处理 `__dirname`、some 和 dir，即从左到右处理，如果第一个参数不是绝对路径或`__dirname`，那么默认使用当前路径的绝对路径，也就是说，如果三个（全部）参数都是相对路径，那么默认使用当前路径的绝对路径作为第 0 个参数，然后依次拼接后续参数，返回绝对路径。如果 some 或 dir 的任何值对应于根路径(以`/`开头？)，则先前的路径将被省略，并通过将其视为根来处理--即从右往左找到第一个绝对路径，以他为根，再向右拼接其余相对路径。
3. `__dirname`:**`__dirname`** 是包含正在执行的源文件的目录的**绝对路径**，而不是当前工作目录*current working directory*。(在 Shell 中`pwd`命令即打印当前工作路径)
4. `path.join()`将所有给定的路径段连接在一起，使用平台特定的分隔符作为分隔符，然后将得到的路径规范化。而`path.resolve()`从右到左处理路径序列，每一个后续的路径都会被预置，直到构造出一个绝对路径。

```javascript
console.log("path.join() : ", path.join());
// path.join() :  .                // 表示当前工作路径

console.log("path.resolve : ", path.resolve());
// path.resolve :  /Users/valtechwh/workspace/my-blog     // 打印绝对路径

path.resolve("/a", "b", "c"); // returns:    '/a/b/c'
path.resolve("/a", "/b", "c"); // returns:    '/b/c'
path.resolve("/a", "/b", "/c"); // returns:    '/c'

path.join("/a", "b", "/c", "d"); // returns:    '/a/b/c/d'
```

### process

进程对象提供有关当前 Node.js 进程的信息并对其进行控制。

### nvm

[refer](https://juejin.cn/post/6932302283958910984)
