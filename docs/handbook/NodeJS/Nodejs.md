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

- `require` 方法

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

- `_load` 方法

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

```bash
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

1. `const absolutePath = path.join(__dirname, some, dir);`:`path.join` 将连接 `__dirname`--它是当前文件的目录名，与 some 和 dir 的值连接，带有特定于平台的分隔符。(从左向右进行拼接)，返回相对路径。参数都是 string。
2. `const absolutePath = path.resolve(__dirname, some, dir);`:`path.resolve` 将处理 `__dirname`、some 和 dir，即从左到右处理，如果第一个参数不是绝对路径或`__dirname`，那么默认使用当前路径的绝对路径，也就是说，如果三个（全部）参数都是相对路径，那么默认使用当前路径的绝对路径作为第 0 个参数，然后依次拼接后续参数，返回绝对路径。如果 some 或 dir 的任何值对应于根路径(以`/`开头？)，则先前的路径将被省略，并通过将其视为根来处理--即从右往左找到第一个绝对路径，以他为根，再向右拼接其余相对路径。
3. `__dirname`:**`__dirname`** 是包含正在执行的源文件的目录的**绝对路径**，而不是当前工作目录*current working directory*。(在 Shell 中`pwd`命令即打印当前工作路径)
4. `path.join()`将所有给定的路径段连接在一起，使用平台特定的分隔符作为分隔符，然后将得到的路径规范化。而`path.resolve()`从右到左处理路径序列，每一个后续的路径都会被预置，直到构造出一个绝对路径。

```javascript
const path = require("path");

const result = path.join("/foo", "bar", "baz/asdf", "quux", "..");
console.log(result); // 输出: '/foo/bar/baz/asdf'
console.log("path.join() : ", path.join());
// path.join() :  .                // 表示当前工作路径

console.log("path.resolve : ", path.resolve());
// path.resolve :  /Users/eric/workspace/my-blog     // 打印绝对路径

path.resolve("/a", "b", "c"); // returns:    '/a/b/c'
path.resolve("/a", "/b", "c"); // returns:    '/b/c'
path.resolve("/a", "/b", "/c"); // returns:    '/c'

path.join("/a", "b", "/c", "d"); // returns:    '/a/b/c/d'
```

### process

进程对象提供有关当前 Node.js 进程的信息并对其进行控制。

### nvm

[refer](https://juejin.cn/post/6932302283958910984)

### url.parse

![URL](https://cdn.jsdelivr.net/gh/EricYangXD/vital-images@master/imgs/20230419113045.png)

## 常见问题

### TCP 数据粘包

1. 粘包问题主要是因为 TCP 是面向流的协议，它不关心数据边界。
2. 现象是：粘包是指在 TCP 流中，多个数据包被组合在一起，导致接收方无法正确解析数据。

解决方法：

- 预先定义数据包的长度：发送端：在每个数据包前加上一个固定长度的头，头部包含数据包的长度信息。接收端：读取固定长度的头部以确定数据包的长度。根据读取到的长度读取完整的数据包。
- 使用特殊的分隔符：通过在每个数据包之间使用特定的分隔符（如换行符、特殊字符串等）来划分数据包：发送端：在每个数据包后面加一个特殊的分隔符。接收端：在接收到的数据中寻找分隔符，分隔数据包。
- 使用更高层次的协议：使用更高层次的协议（如 HTTP、WebSocket、gRPC 等），它们已经为了解决粘包问题进行了优化。
- 使用第三方库：使用专门解决 TCP 粘包问题的第三方库，如 protobuf、msgpack 等，这些库提供了数据的序列化和反序列化功能，并且能够自动处理粘包问题。

```js
// 发送端
const net = require("net");

const client = net.createConnection({ port: 8080 }, () => {
  console.log("connected to server!");

  const data = "Hello, World!";
  const buffer = Buffer.from(data);
  const header = Buffer.alloc(4); // 假设头部长度为4字节
  header.writeInt32BE(buffer.length, 0);

  client.write(Buffer.concat([header, buffer]));
});

// 接收端
const server = net.createServer((socket) => {
  socket.on("data", (data) => {
    let offset = 0;
    while (offset < data.length) {
      const length = data.readInt32BE(offset);
      offset += 4;
      const message = data.slice(offset, offset + length).toString();
      offset += length;
      console.log(`Received: ${message}`);
    }
  });
});

server.listen(8080, () => {
  console.log("server is listening");
});
```

## 线程池

1. Node.js 本身单进程单主线，但底层 libuv 实现了一个固定大小的“工作池”（thread pool，默认 4），用于处理文件 IO、加密等异步操作
2. Node.js `worker_threads` 模块可以实现真正多线程，但较少用于普通业务场景。
3. 通常 IO 密集型操作自动走 `libuv thread pool`，无需手动干预。

## 事件循环

1. 顺序：`timers -> pending callbacks -> idle, prepare -> poll -> check -> close callbacks`
2. 通常情况下，如果代码在主模块中直接调用，timeout 会先于 immediate；如果在 I/O 回调中调用，则 immediate 会先于 timeout。
3. 在 Node.js，还有一个更快的“微任务”队列——`process.nextTick()`，它会比上述两者更早执行，在本轮事件循环的所有其他 I/O 和定时器之前。

## Trouble Shooting -- Aliyun

### 处理线上异常

1. 错误日志：通过统一日志平台收集错误日志，其中的采集服务器和 Agent 上报之间一般会采用消息队列（Kafka）来作为缓冲区减轻双方的负载，ELK 就是一个比较成熟的日志服务。
2. 系统指标：

   - CPU & Memory：`top`，对于 CPU 很高 Node.js 进程，我们可以使用 Node.js 性能平台 提供的 CPU Profiling 工具来在线 Dump 出当前的 Javascript 运行情况，进而找到热点代码进行优化。对于 Memory 负载很高的情况，正常来说就是发生了内存泄漏（或者有预期之外的内存分配导致溢出），那么同样的我们可以用性能平台提供的工具来在线 Dump 出当前的 Javascript 堆内存和服务化的分析来结合你的业务代码找到产生泄漏的逻辑
   - Disk 磁盘占用率：`df`，当我们的日志/核心转储等大文件逐渐将磁盘打满到 100% 的时候，Node.js 应用很可能会无法正常运行
   - I/O 负载： `top | iostat` 和 `cat /proc/${pid}/io` 来查看当前的 I/O 负载，负载很高的话，也会使得 Node.js 应用出现卡死的情况
   - TCP 连接状态：绝大部分的 Node.js 应用实际上是 Web 应用，每个用户的连接都会创建一个 Socket 连接，在一些异常情况下（比如遭受半连接攻击或者内核参数设置不合理），服务器上会有大量的 `TIME_WAIT` 状态的连接，而大量的 `TIME_WAIT` 积压会导致 Node.js 应用的卡死（内核无法为新的请求分配创建新的 TCP 连接），我们可以使用 `netstat -ant|awk '/^tcp/ {++S[$NF]} END {for(a in S) print (a,S[a])}'` 命令来确认这个问题

   3. 核心转储：服务器内核提供了一项机制帮助我们在应用 Crash 时自动地生成核心转储（Core dump）文件，让开发者可以在事后进行分析还原案发现场，因此获取到核心转储文件后，我们可以通过 MDB、GDB、LLDB 等工具即可实现解析诊断实际进程的 Crash 原因。触发核心转储生成转储文件目前主要有两种方式：

   - 设置内核参数：使用 `ulimit -c unlimited` 打开内核限制，并且考虑到默认运行模式下，Node.js 对 JS 造成的 Crash 是不会触发核心转储动作的，因此我们可以在应用启动时加上参数 `--abort-on-uncaught-exception` 来对出现未捕获的异常时也能让内核触发自动的核心转储动作。
   - 手动调用：手动调用 `gcore <pid>` （可能需要 sudo 权限）的方式来手动生成，因为此时 Node.js 应用依旧在运行中，所以实际上这种方式一般用于 「活体检验」，用于 Node.js 进程假死状态 下的问题定位。
   - 获取到 Node.js 应用生成的核心转储文件后，我们可以借助于 Node.js 性能平台 提供的在线 Core dump 文件分析功能进行分析定位进程 Crash 的原因了

   4. 正确打开 Chrome devtools：

   - 导出 JS 代码运行状态：`v8-profiler-next`导出的代码运行状态实际上是一个很大的 JSON 对象，将这个 JSON 对象序列化为字符串后存储到文件：`test.cpuprofile`。注意这里的文件名后缀必须为`.cpuprofile`，否则 Chrome devtools 是不识别的。
   - CPU 飙高问题，分析 CPU Profile 文件：点击工具栏右侧的 更多 按钮，然后选择 More tools -> JavaScript Profiler 来进入到 CPU 的分析页面。（20231225 目前已无此页面）
   - 内存泄漏问题，导出 JS 堆内存快照：如果我们发现 Node.js 应用的总内存占用曲线 处于长时间的只增不降 ，并且堆内存按照趋势突破了 堆限制的 70% 了，那么基本上应用 很大可能 产生了泄漏。如果确实因为 QPS 的不断增长导致堆内存超过堆限制的 70% 甚至 90%，此时我们需要考虑的扩容服务器来缓解内存问题。
   - 导出 JS 堆内存快照：采用 heapdump 这个模块，得到一个堆快照文件：test.heapsnapshot ，后缀必须为 .heapsnapshot，分析堆快照，在 Chrome devtools 的工具栏中选择 Memory 即可进入到分析页面，Load 刚才生成 test.heapsnapshot 文件

   5. Node.js 性能平台使用指南：异常指标告警，导出线上 Node.js 应用状态，在线分析结果和更好的 UI 展示。配置合适的告警，按照告警类型进行分析等
      - `node --prof` 或 `node --inspect`，然后用 chrome devtools 分析。
   6. 利用 CPU 分析调优吞吐量：打开了模板缓存，按理来说不会再出现 ejs.compile 函数对应的模板编译。模板的编译本质上字符串处理，它恰恰是一个 CPU 密集的操作。将 koa-view 替换为更好用的 koa-ejs >= 4.1.2 模块，可以正确开启模板缓存。
   7. 调试工具 ndb
   8. 使用 Chrome inspect 的调试方法：

   - 启动应用时携带 `--inspect` 参数
   - 打开 Chrome 浏览器访问: `chrome://inspect/#devices`
   - 找到对应的 target，点击 inspect 即可打开 Chrome devtools 进行调试
   - 在 mongoose Model Query 的操作中，如果不加 lean() 方法的话，mongoose 拿到结果会将数据包装成为我们熟知的 mongoose Document

   9. 冗余配置传递引发的内存溢出：
      - 最小化复现代码
      - 优化代码，合理使用设计模式
   10. 综合性 GC 问题和优化：实际上绝大部分的 GC 机制引发的问题往往表象都是反映在 Node.js 进程的 CPU 上，而本质上这类问题可以认为是引擎的 GC 引起的问题，也可以理解为内存问题：堆内存不断达到触发 GC 动作的预设条件->进程不断触发 GC 操作->进程 CPU 飙高。借助于性能平台的 GC 数据抓取和结果展示，使用 --max-semi-space-size=128 来将新生代使用的空间设置为 128M（举例）。
   11. 类死循环导致进程阻塞：进程假死状态下是无法直接使用 V8 引擎提供的抓取 CPU Profile 文件的接口。

   - CPU Profile：类死循环的问题本质上也是 CPU 高的问题，因此我们只要对问题进程抓取 CPU Profile，就能看到当前卡在哪个函数了。对 AliNode runtime 版本有所要求
   - 诊断报告：是 AliNode 定制的一项导出更多更详细的 Node.js 进程当前状态的能力，导出的信息也包含当前的 JavaScript 代码执行栈以及一些其它进程与系统信息。对 AliNode runtime 版本有所要求
   - 核心转储分析：对 AliNode runtime 版本没有任何要求，且能拿到更精准信息的核心转储分析功能。

   12. 简单的解释下为什么字符串的正则匹配会造成类死循环的状态，它实际上异常的用户输入触发了 正则表达式灾难性的回溯，会导致执行时间要耗费几年甚至几十年，显然不管是那种情况，单主工作线程的模型会导致我们的 Node.js 应用处于假死状态，即进程依旧存活，但是却不再处理新的请求。
   13. 其实这类正则回溯引发的进程级别阻塞问题，本质上都是由于不可控的用户输入引发的，而 Node.js 应用又往往作为 Web 应用直接面向一线客户，无时不刻地处理千奇百怪的用户请求，因此更容易触发这样的问题。相似的问题其实还有一些代码逻辑中诸如 while 循环的跳出条件在一些情况下失效，导致 Node.js 应用阻塞在循环中。
   14. 雪崩型内存泄漏问题：堆快照一般来说确实是分析内存泄漏问题的最佳手段。但是还有一些问题场景下下应用的内存泄漏非常严重和迅速，甚至于在我们的告警系统感知之前就已经造成应用的 OOM 了，这时我们来不及或者说根本没办法获取到堆快照，因此就没有办法借助于之前的办法来分析为什么进程会内存泄漏到溢出进而 Crash 的原因了。这种问题场景实际上属于线上 Node.js 应用内存问题的一个极端状况。
   15. Egg-logger 官方是使用 `circular-json` 来替换掉原生的 `util.inspect` 序列化动作，并且增加序列化后的字符串最大只保留 10000 个字符的限制，这样就解决这种包含大字符串的错误对象在 Egg-logger 模块中的序列化问题。

## 常用库

#### fs

```js
const fs = require("node:fs");
const data = JSON.parse(fs.readFileSync("./809.json", "utf8"));
console.log(data);
```

1. `fs.readFileSync()` 方法用于同步读取文件内容。返回一个包含文件内容的 Buffer 对象。参数是文件路径和字符编码。会阻塞当前线程，直到文件读取完成。
2. `fs.readFile()` 方法用于异步读取文件内容。返回一个 Promise 对象。参数是文件路径和字符编码。不会阻塞当前线程，而是将读取文件的操作放入事件队列中，当文件读取完成时，会触发回调函数。

#### fs-extra

Node.js 文件系统操作的强化版

#### co-body

co-body 是一个用于解析 HTTP 请求体和响应体的中间件，它提供了多种解析方法，如 JSON、Form、Text、Buffer 等。

#### body-parser

body-parser 是一个用于解析 HTTP 请求体和响应体的中间件，它提供了多种解析方法，如 JSON、Form、Text、Buffer 等。

#### cors

跨域资源共享的 Node.js 解决方案，作为 Connect/Express 的中间件来提供 CORS 支持。

#### Sequelize

Node.js 下的 ORM（对象关系映射）神器，支持多种流行的数据库，包括 PostgreSQL、MySQL、MariaDB 和 SQLite 等。

#### Nodemailer

让你的 Node.js 服务轻松发送邮件

#### Passport

Node.js 的灵活认证中间件，支持超过 500 种认证方案，这包括了谷歌、脸书、推特等社交媒体平台的认证，以及其他定制的认证和单点登录（SSO）方案。它不仅支持普通的用户名和密码登录，还支持通过 OAuth 进行的社交网站代理认证，以及用于联合认证的 OpenID。

#### Async

Node.js 中处理异步 JavaScript 的强大工具，Async 库以其提供的一系列函数和控制流结构，为管理和协调这些随时间进行的任务（或者说，承诺）提供了强大的支持。它旨在通过清晰和可预测的方式，解决异步编程的复杂性。

#### Winston

Node.js 日志管理神器，对于 Node.js 应用而言，Winston 库以其灵活性和多功能性成为了日志记录的首选工具。它支持多种传输机制，包括控制台、文件、云服务和第三方服务，使得监控和调试工作变得更加全面和高效。

#### Mongoose

Node.js 的数据模型大师，它是一个基于 Node.js 的 MongoDB（轻量级、高效的 NoSQL 数据库）对象建模工具，简称 ODM（对象数据建模）库，使得与 MongoDB 的交互变得既简单又高效。

#### Socket.IO

实时通信利器，它允许客户端浏览器和服务器之间进行实时、双向和基于事件的通信。通过低级连接和数字握手（如 HTTP 长轮询），Socket.IO 确保了客户端与服务器之间的实时通信。

#### Puppeteer

自动化 Chrome 的 Node.js 框架，在前端开发中，自动化测试是提高效率和确保质量的关键。Puppeteer，作为一个 Node.js 框架，正是为了这一需求而生。它提供了一个高级 API，允许通过 DevTools 协议控制 Chrome/Chromium 浏览器，从而实现浏览器的自动化操作。

#### Multer

Node.js 中的文件上传利器，它基于 HTML 表单解析器 Busboy 构建，支持多部分（multipart）和多格式（multiform）数据，特别适用于处理文件上传。

#### Busboy

#### Dotenv

保护 Node.js 应用配置的利器，在 Node.js 开发中，管理应用的环境变量是一项基本且重要的任务。Dotenv 正是为此而生的实用模块。它帮助开发者维护应用的环境变量，保护关键的配置数据，如 API 密钥、登录凭证等。Dotenv 遵循十二因素应用方法论，有效地管理环境变量。

#### Prisma

一个专为 Node.js 和 TypeScript 应用设计的下一代 ORM 工具。它通过提供类型安全的 API、自动生成查询和迁移，简化了数据库的交互操作。这不仅使开发过程变得高效，而且还帮助开发者避免了许多常见的错误。

#### Express-rate-limit

它是一个专为 Express.js 应用设计的中间件，用于强制执行请求速率限制，确保控制进入流量，保护资源不被滥用。

#### Semver

它提供了一套标准化的版本号表示方法，通过 MAJOR（主版本号）、MINOR（次版本号）、PATCH（修订号）的格式来传达版本间的兼容性和变更的重要性。

#### JS-YAML

YAML 作为一种人类可读的数据序列化格式，在配置文件、数据交换等场景中被广泛使用。它以其简洁明了的结构赢得了开发者的喜爱。js-yaml 库则为 JavaScript 提供了 YAML 数据的解析和字符串化功能，使得在 Node.js 应用中整合 YAML 数据变得轻而易举。

#### Mime-types

Node.js 中处理 MIME 类型的实用工具，mime-types 包为 Node.js 应用提供了一个全面的工具集，以便正确处理各种文件格式。

#### Chalk

通过使用 Chalk，开发者可以轻松地改善控制台日志、错误信息等文本输出的可读性和视觉吸引力，让枯燥的黑白文本变得生动鲜明。

#### Commander

打造人性化命令行工具，

#### Debug

轻量级 Node.js 调试神器，debug 库为 Node.js 开发者提供了一个精确且信息丰富的日志记录工具，通过一种轻量级和灵活的机制，使得开发者能够向控制台打印自定义消息，进行有针对性的调试和故障排除，而不会让输出因不必要的信息而变得杂乱无章。debug 库注重简洁和上下文意识，确保日志信息既相关又可操作。

#### tslib

TypeScript 运行时的核心支持库

#### TypeORM

打通 TypeScript 与数据库的桥梁，TypeORM 是一个为 TypeScript 和 JavaScript 设计的强大对象关系映射（ORM）库，它旨在弥合代码中的对象与关系数据库世界之间的鸿沟。通过使用熟悉的面向对象范式与数据库进行交互，TypeORM 简化了开发流程，提升了代码的可维护性。

#### mkdirp

轻松创建嵌套目录结构

#### glob

Node.js 中的模式匹配文件查找神器

#### minimist

简化命令行参数解析的利器

#### Joi

JavaScript 对象模式验证的强大工具。在开发过程中，确保数据的完整性和遵守既定规则至关重要。Joi 为 JavaScript 开发者提供了全面的对象模式验证，通过在开发过程的早期捕捉无效数据，发挥着预防错误、安全漏洞和意外行为的关键作用。

#### GraphQL

API 数据获取的革命性方法。GraphQL 作为一种数据查询和操作语言，提供了一种灵活高效的方式来处理 API 中的数据。它使客户端能够精确指定所需的数据，大大减少了传统 REST API 中常见的数据过度获取和数据不足的问题。

#### Ajv

JavaScript 应用中的快速 JSON 模式验证器，用于 JavaScript 应用中的 JSON 数据验证。通过定义的模式（schemas），Ajv 确保数据遵循结构和语义规则，促进数据完整性和应用可靠性。

#### Helmet

加固 Node.js Web 应用的安全盾牌，在开发基于 Express 的 Node.js Web 应用时，安全性是一个不可忽视的重要方面。Helmet 作为一个中间件，通过设置各种 HTTP 头来增强应用的安全性。这些头部设置针对常见的漏洞进行了优化，可以缓解攻击并保护敏感信息，为用户创造了更加安全的网络体验。

#### Ora

你的 CLI 任务进度指示器

#### Faker

轻松生成测试数据

#### CSV

高效处理 CSV 数据，

#### Pdfkit

生成 PDF 文档是一项常见需求。Pdfkit 作为一个功能强大的 Node.js 库，为开发者提供了一个简洁的 API，使得生成美观且功能丰富的 PDF 文档变得非常容易。

#### Pino

高效日志记录利器，它不仅帮助开发者监控和调试应用，还能在出现问题时提供关键的诊断信息。Pino 作为一个高性能的日志记录库，以其速度和效率为优先，同时提供了一系列丰富的功能，使得结构化和信息化的日志记录变得更加便捷。

#### Cheerio

Cheerio 是 jQuery 的一个子集的服务端实现，为开发者提供了熟悉的语法和 API，用于在 Node.js 中导航、选择和修改 HTML 元素。

#### Grunt

在 Web 开发中，重复性的任务如代码编译、压缩、质量检查等往往耗时费力。Grunt 作为一个 JavaScript 任务管理工具，通过自动化这些任务，极大地提升了开发效率。通过配置文件（Gruntfile），Grunt 可以定义任务和插件，使开发流程更加流畅和高效。

#### 其他常用的的库

Lodash、Axios、Axios-retry、Superagent、dayjs、date-fns、rxjs、jest、ramda、ejs、
