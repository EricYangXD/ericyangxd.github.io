---
title: 前端面试题2
author: EricYangXD
date: "2025-04-09"
meta:
  - name: keywords
    content: 前端面试题
---

## this 指向

`fn() < obj.fn() < fn.call(obj) < new fn()`四条规则的优先级是递增的:

首先，new 调用的优先级最高，只要有 new 关键字，this 就指向实例本身；接下来如果没有 new 关键字，有 call、apply、bind 函数，那么 this 就指向第一个参数；然后如果没有 new、call、apply、bind，只有 obj.foo()这种点调用方式，this 指向点前面的对象；最后是光杆司令 foo() 这种调用方式，this 指向 window（严格模式下是 undefined）。

es6 中新增了箭头函数，而箭头函数最大的特色就是没有自己的 this、arguments、super、new.target，并且箭头函数没有原型对象 prototype 不能用作构造函数（new 一个箭头函数会报错）。因为没有自己的 this，所以箭头函数中的 this 其实指的是包含函数中的 this。无论是点调用，还是 call 调用，都无法改变箭头函数中的 this。

## 接口防刷

1. 网关控制流量洪峰，对在一个时间段内出现流量异常，可以拒绝请求
2. 源 ip 请求个数限制。对请求来源的 ip 请求个数做限制
3. http 请求头信息校验；（例如 host，User-Agent，Referer）
4. 对用户唯一身份 uid 进行限制和校验。例如基本的长度，组合方式，甚至有效性进行判断。或者 uid 具有一定的时效性
5. 前后端协议采用二进制方式进行交互或者协议采用签名机制
6. 人机验证，验证码，短信验证码，滑动图片形式，12306 形式
7. 网络服务商流量清洗（参考 DDoS）

## 路由拦截

## 提高 webpack 打包速度

1. 在尽可能少的模块上应用 loader
2. Plugin 尽可能精简并可靠
3. resolve 参数的合理配置
4. 使用 DllPlugin 提高打包速度
   - 第三方模块单独打包，生成打包结果
   - 使用 library 暴露为全局变量
   - 借助 dll 插件来生成 manifest 映射文件，从 dll 文件夹里面拿到打包后的模块（借助 dllReference 插件）就不用重复打包了
   - 中间进行了很多分析的过程，最后决定要不要再去分析 node_modules 内容
5. 去除冗余引用
6. 多进程打包:利用 node 的多进程，利用多个 cpu 进行项目打包（thread-loader，parallel-webpack，happypack）
7. 合理使用 SourceMap
8. 结合 stats.json 文件分析打包结果;分析 bundle 包,打包后的 bundle 文件生成一个分析文件:`"analyse": "webpack --config ./webpack.config.js --profile --json>states.json"`
9. `webpack-bundle-analyzer`
10. 开发环境无用插件需要剔除

### 相关 webpack 插件和 loader 等

四步：分析打包速度，分析打包体积，优化打包速度，优化打包体积。

1. 进行优化的第一步需要知道我们的构建到底慢在那里。通过 `speed-measure-webpack-plugin` 测量你的 webpack 构建期间各个阶段花费的时间。使用插件的 wrap()方法将 webpack 配置 module.exports 包起来，打包完成后控制台会输出各个 loader 的打包耗时，可根据耗时进一步优化打包速度;
2. 体积分析：1.依赖的第三方模块文件大小；2.业务里面的组件代码大小。安装插件`webpack-bundle-analyzer`，打包后可以很清晰直观的看出各个模块的体积占比。
3. 代码分割:`CommonsChunkPlugin`;
4. 使用 `HashedModuleIdsPlugin` 来保持模块引用的 `module_id` 不变;
5. `hard-source-webpack-plugin`该插件的作用是为打包后的模块提供缓存，且缓存到本地硬盘上。默认的缓存路径是：`node_modules/.cache/hard-source`。
6. 使用高版本的 webpack 和 node.js，优化一下代码语法：
   - `for of 替代 forEach`
   - `Map和Set 替代Object`
   - `includes 替代 indexOf()`
   - `默认使用更快的md4 hash算法 替代 md5算法，md4较md5速度更快`
   - `webpack AST 可以直接从loader传递给AST，从而减少解析时间`
   - `使用字符串方法替代正则表达式`
7. 多进程/多实例构建（资源并行解析）:在 webpack 构建过程中，我们需要使用 Loader 对 js，css，图片，字体等文件做转换操作，并且转换的文件数据量也是非常大的，且这些转换操作不能并发处理文件，而是需要一个个文件进行处理，我们需要的是将这部分任务分解到多个子进程中去并行处理，子进程处理完成后把结果发送到主进程中，从而减少总的构建时间。
   - thread-loader（官方推出）
   - parallel-webpack
   - HappyPack
8. 多进程/多实例进行代码压缩（并行压缩）:在代码构建完成之后输出之前有个代码压缩阶段，这个阶段也可以进行并行压缩来达到优化构建速度的目的。
   - `webpack-parallel-uglify-plugin`
   - `uglifyjs-webpack-plugin`
   - `terser-webpack-plugin`**(webpack4.0 推荐使用，支持压缩 es6 代码)**
9. 通过分包提升打包速度：可以使用`html-webpack-externals-plugin`分离基础包，分离之后以 CDN 的方式引入所需要的资源文件，缺点就是一个基础库必须指定一个 CDN，实际项目开发中可能会引用到多个基础库，还有一些业务包，这样会打出很多个 script 标签。
10. 进一步分包，采用预编译资源模块：采用 webpack 官方内置的插件`DLLPlugin`进行分包，`DLLPlugin`可以将项目中涉及到的例如 react、react-router 等组件和框架库打包成一个文件，同时生成`manifest.json`文件。`manifest.json`是对分离出来的包进行一个描述，实际项目就可以引用`manifest.json`，引用之后就会关联 `DLLPlugin`分离出来的包，这个文件是用来让`DLLReferencePlugin`映射到相关的依赖上去。
11. 通过**缓存**提升二次打包速度:
    - 模块缓存：Webpack5 会在首次构建时将模块的编译结果存储在缓存中。设置`cache.type`字段，比如：`filesystem`，表示使用文件系统缓存存储到硬盘中，适合长期使用的项目。`memory`表示默认。缓存存储路径默认是 `node_modules/.cache/webpack`
    - 持久化缓存：Webpack 5 的缓存是持久化的，即使在重新启动构建工具后，缓存仍然可用。这种机制使得后续构建的速度可以显著提高。
    - `babel-loader `开启缓存:`cacheDirectory=true`
    - `terser-webpack-plugin` 开启缓存:`new TerserPlugin({cache: true,})`
    - 使用`cache-loader`或者 `hard-source-webpack-plugin`
12. 打包体积优化
    - 图片压缩:使用 Node 库的 imagemin，配置`image-webpack-loader`对图片优化，改插件构建时会识别图片资源，对图片资源进行优化，借助 pngquant（一款 PNG 的压缩器）压缩图片
    - 擦除无用到的 css:插件`purgecss-webpack-plugin`
    - 动态 Polyfill：由于 Polyfill 是非必须的，对一些不支持 es6 新语法的浏览器才需要加载 polyfill，为了百分之 3.几的用户让所有用户去加载 Polyfill 是很没有必要的；我们可以通过 polyfill-service，只给用户返回需要的 polyfill。每次用户打开一个页面，浏览器端会请求 polyfill-service，polyfill-service 会识别用户 User Agent，下发不同的 polyfill。如何使用动态 Polyfill service，通过[官方](https://polyfill.io)提供的服务，自建 polyfill 服务。

## ES6 继承

参考「ES5/ES6 的继承除了写法以外还有什么区别」

## 路由跳转

`history.replaceState();`

## 管道函数

将多个函数按顺序组合起来，使数据依次通过这些函数进行处理。

```js
// 管道函数实现
// 从左向右执行
const pipe =
  (...functions) =>
  (input) =>
    functions.reduce((acc, fn) => fn(acc), input);
// 或者
const pipe =
  (...fns) =>
  (x) =>
    fns.reduce((v, f) => f(v), x);

// 示例函数
const add = (x) => x + 2;
const multiply = (x) => x * 3;
const square = (x) => x * x;

// 使用管道
const process = pipe(add, multiply, square);
console.log(process(2)); // (((2 + 2) * 3) ^ 2) = 144

// 从右向左执行
// 从右向左的函数组合
const compose =
  (...functions) =>
  (input) =>
    functions.reduceRight((acc, fn) => fn(acc), input);

// 示例函数
const add = (x) => x + 2;
const multiply = (x) => x * 3;
const square = (x) => x * x;

// 使用 compose
const process = compose(square, multiply, add);
console.log(process(2)); // (((2 + 2) * 3) ^ 2) = 144
```

## 如何不指定特定的文件来创建 webworker

用途：打包的时候不希望打出一堆 worker 文件，而希望和主线程代码放在一起的时候，可以把这些 worker 的代码写成字符串，然后通过如下两种方法来生成 worker。

不用特定 js 文件的话，那就需要把 js 代码写成字符串，然后：有两种做法

1. Object URL: 是一种特殊的 URL，它表示一个对象，该对象可以作为 URL 的一部分（本地的临时资源）。Object URL 可以用于创建指向 JavaScript 代码的 URL。先用这个字符串创建一个 blob 对象，然后通过 URL.createObjectURL(blob)创建一个 URL，然后通过 new Worker(URL)创建一个 worker 对象。
2. Data URL: 有固定格式：`data:application/javascript;utf8,${sourceCode}`（直接把资源写到字符串里了），然后通过 new Worker(dataUrl)创建一个 worker 对象。

```js
// 1. Object URL
// 定义 Worker 的功能
const workerCode = `
self.onmessage = function(e) {
    const result = e.data * 2; // 例如，将收到的数据乘以 2
    self.postMessage(result); // 将结果发送回主线程
};
`;

// 创建一个 Blob 对象
const blob = new Blob([workerCode], { type: "application/javascript" });

// 创建对象 URL
const workerBlobURL = URL.createObjectURL(blob);

// 创建 Worker 实例
const worker1 = new Worker(workerBlobURL);

// 监听 Worker 发送的消息
worker1.onmessage = function (e) {
  console.log("Worker 发送的结果:", e.data);
};

// 向 Worker 发送数据
worker1.postMessage(10); // 发送数字 10

// 2. Data URL
const dataUrl = `data:application/javascript;utf8,${workerCode}`;
const worker2 = new Worker(dataUrl);

// 监听 Worker 发送的消息
worker2.onmessage = function (e) {
  console.log("Worker 发送的结果:", e.data);
};

// 向 Worker 发送数据
worker2.postMessage(20); // 发送数字 20
```

## 作用域链

参考「V8」

## keep-alive 使用

1. keep-alive 是 Vue 内置的一个组件，可以使被包含的组件保留状态，避免重新渲染
2. 一般结合路由和动态组件一起使用，用于缓存组件；
3. 提供 include 和 exclude 属性，两者都支持字符串或正则表达式， include 表示只有名称匹配的组件会被缓存，exclude 表示任何名称匹配的组件都不会被缓存 ，其中 exclude 的优先级比 include 高；
4. 对应两个钩子函数 activated 和 deactivated ，当组件被激活时，触发钩子函数 activated，当组件被移除时，触发钩子函数 deactivated。

## keep-alive 原理

Vue 的渲染是从 render 阶段开始的，但 keep-alive 的渲染是在 patch 阶段，这是构建组件树（虚拟 DOM 树），并将 VNode 转换成真正 DOM 节点的过程。

- 原理：源码就类似于一个 SFC 的 script 部分

1. 在 created 生命周期时，初始化了 cache 缓存对象和 keys 对象，cache 用于缓存虚拟 dom，keys 主要用于保存 VNode 对应的键集合
2. 在 destroyed 生命周期时，删除缓存 VNode 还要对应执行组件实例的 destory 钩子函数。
3. 在 mounted 这个钩子中对 include 和 exclude 参数进行监听，然后实时地更新（删除）this.cache 对象数据。pruneCache 函数的核心也是去调用 pruneCacheEntry。

所以 keep-alive 的原理可以分成以下几步：

1. 获取 keep-alive 包裹着的第一个子组件对象及其组件名；
2. 根据设定的 include/exclude（如果有）进行条件匹配，决定是否缓存。不匹配，直接返回组件实例；
3. 根据组件 ID 和 tag 生成缓存 Key，并在缓存对象中查找是否已缓存过该组件实例。如果存在，直接取出缓存值并更新该 key 在 this.keys 中的位置(更新 key 的位置是实现 LRU 置换策略的关键)；
4. 如果不匹配，在 this.cache 对象中存储该组件实例并保存 key 值，之后检查缓存的实例 数量是否超过 max 的设置值，超过则根据 LRU 置换策略删除最近最久未使用的实例（即是下标为 0 的那个 key）；
5. 最后组件实例的 keepAlive 属性设置为 true，这个在渲染和执行被包裹组件的钩子函数会用到。

- render 过程：

1. 第一步：获取 keep-alive 包裹着的第一个子组件对象及其组件名；
2. 第二步：根据设定的黑白名单（如果有）进行条件匹配，决定是否缓存。不匹配，直接返回组件实例（VNode），否则执行第三步；
3. 第三步：根据组件 ID 和 tag 生成缓存 Key，并在缓存对象中查找是否已缓存过该组件实例。如果存在，直接取出缓存值并更新该 key 在 this.keys 中的位置（更新 key 的位置是实现 LRU 置换策略的关键），否则执行第四步；
4. 第四步：在 this.cache 对象中存储该组件实例并保存 key 值，之后检查缓存的实例数量是否超过 max 的设置值，超过则根据 LRU 置换策略删除最近最久未使用的实例（即是下标为 0 的那个 key）。
5. 第五步：最后并且很重要，将该组件实例的 keepAlive 属性值设置为 true。

- 从 render 到 patch 的过程:

1. Vue 在渲染的时候先调用原型上的\_render 函数将组件对象转化为一个 VNode 实例；而\_render 是通过调用 createElement 和 createEmptyVNode 两个函数进行转化；
2. createElement 的转化过程会根据不同的情形选择 new VNode 或者调用 createComponent 函数做 VNode 实例化；
3. 完成 VNode 实例化后，这时候 Vue 调用原型上的\_update 函数把 VNode 渲染为真实 DOM，这个过程又是通过调用**patch**函数完成的（这就是 pacth 阶段了）

- keep-alive 组件的渲染:
- Q:用过 keep-alive 都知道，它不会生成真正的 DOM 节点，这是怎么做到的?
- A:Vue 在初始化生命周期的时候，为组件实例建立父子关系会根据 abstract 属性决定是否忽略某个组件。在 keep-alive 中，设置了 abstract: true，那 Vue 就会跳过该组件实例。最后构建的组件树中就不会包含 keep-alive 组件，那么由组件树渲染成的 DOM 树自然也不会有 keep-alive 相关的节点了。

- Q:keep-alive 包裹的组件是如何使用缓存的？
- A:在 patch 阶段，会执行 createComponent 函数：

  1. 在首次加载被包裹组件时，由 keep-alive.js 中的 render 函数可知，vnode.componentInstance 的值是 undefined，keepAlive 的值是 true，因为 keep-alive 组件作为父组件，它的 render 函数会先于被包裹组件执行；那么就只执行到 `i(vnode, false /_ hydrating _/)`，后面的逻辑不再执行；
  2. 再次访问被包裹组件时，vnode.componentInstance 的值就是已经缓存的组件实例，那么会执行 insert(parentElm, vnode.elm, refElm)逻辑，这样就直接把上一次的 DOM 插入到了父元素中。

- Q:一般的组件，每一次加载都会有完整的生命周期，即生命周期里面对应的钩子函数都会被触发，为什么被 keep-alive 包裹的组件却不是呢？
- A:被缓存的组件实例会为其设置 keepAlive = true，而在初始化组件钩子函数中：从 componentVNodeHooks()函数中可以看出，当 vnode.componentInstance 和 keepAlive 同时为 truly 值时，不再进入$mount 过程，那 mounted 之前的所有钩子函数（beforeCreate、created、mounted）都不再执行。

- 在 patch 的阶段，最后会执行 invokeInsertHook 函数，而这个函数就是去调用组件实例（VNode）自身的 insert 钩子，在这个 insert 钩子里面，调用了 activateChildComponent 函数递归地去执行所有子组件的 activated 钩子函数。相反地，deactivated 钩子函数也是一样的原理，在组件实例（VNode）的 destroy 钩子函数中调用 deactivateChildComponent 函数。

### keep-alive 层级较深的时候怎么处理？

> keep-alive 组件对第三级及以上级的路由页面缓存失效。
> 方案 1、直接将路由扁平化配置，都放在一级或二级路由中
> 方案 2、再一层缓存组件用来过渡，并将其 name 配置到 include 中

1. 每一层的`<router-view>`/组件都包裹一层`keep-alive`就好了？
   - 菜单多层级嵌套底下的子组件是不会缓存下来的，这个时候我们就要继续往下给下面的层级继续加上`keep-alive`；
   - 同时在`keep-alive`的 include 中绑定一个数组 cachesViewList，数组里面必须把它父级的 name 都放进去。
2. 把嵌套的`<router-view>`拍平，也就是在路由守卫`router.afterEach`中添加一个将无用的 layout 布局消除的方法
   - 因为`import()`异步懒加载，第一次获取不到 `element.components.default.name`，所以不能在 `beforeEach` 中处理，不然第一次访问的界面不缓存第二次才会缓存
   - `afterEach` 就不一样了，这时候可以获取到 `element.components.default.name` 了

#### 缓存后如何获取数据

1. beforeRouteEnter：每次组件渲染的时候，都会执行 beforeRouteEnter

```js
beforeRouteEnter(to, from, next){
    next(vm=>{
        console.log(vm)
        // 每次进入路由执行
        vm.getData()  // 获取数据
    })
},
```

2. activated：在 keep-alive 缓存的组件被激活的时候，都会执行 actived 钩子

```js
activated(){
   this.getData() // 获取数据
},
```

## 购物车提交订单数据怎么传

1. 商品添加至购物车是不需要登录的，但是需要把 skuId 和数量传给后端，查询是否有库存，然后返回给前端，并把购物车信息存在 cookie (或者 sessionStorage) 里。
2. 选择购物车内的商品购买，提交订单，这时候需要用户登录了。
3. 用户登录后获取用户 cookie (或者 sessionStorage)内购物车信息，以及登录信息，更新数据库或 redis 中的购物车表（购物车表，一个 skuId 对应购物车一条记录）。
4. 用户勾选购物车内商品，生成预览订单（重新获取商品的最新情况比如库存、商品价格等），具体金额由后端计算并返回给前端（前端计算的值仅供参考）。
5. 提交并生成订单唤起支付组件或跳到支付页面，然后删除购物车已购买的商品，预减库存，同步更新 cookie (或者 sessionStorage)内购物车信息。

一般会先从购物车或者商品详情页到确认订单页面。根据确认订单页面的数据格式从购物车组织数据（通常最后是搞成一个 json 对象或者跟后端约定拼成字符串），然后存在 localstorage 里面（做的都是移动端），然后直接跳页面，去确认订单页面遍历渲染那个数据对象就好了。前端这些只是给用户看的，后台在付钱的时候还会再算一遍订单金额，再拆单的。所以就算用户改了支付信息，他还是要付那些钱的。

例：淘宝购物车 post 方法更新购物车的 payload：

```json
{
  "_input_charset": "utf-8",
  "tk": "f88fe5116a335",
  "_tb_token_": "f88fe5116a335",
  "data": [
    {
      "shopId": "s_3910391259",
      "comboId": 0,
      "shopActId": 0,
      "cart": [
        {
          "quantity": 43,
          "cartId": "4117652227290",
          "skuId": "4811854276366",
          "itemId": "644712582517"
        }
      ],
      "operate": ["4117652227290"],
      "type": "update"
    }
  ],
  "shop_id": 0,
  "t": 1656004343910,
  "type": "update",
  "ct": "e5798e786c8a9627ee23ada7a462673c",
  "page": 1,
  "_thwlang": "zh_CN"
}
```

## js 精度丢失

1. 原因：在 JavaScript 中，现在主流的数值类型是 Number，而 Number 采用的是 IEEE754 规范中 64 位双精度浮点数编码：

- 符号位 S：第 1 位是正负数符号位（sign），0 代表正数，1 代表负数
- 指数位 E：中间的 11 位存储指数（exponent），用来表示次方数，可以为正负数。在双精度浮点数中，指数的固定偏移量为 1023
- 尾数位 M：最后的 52 位是尾数（mantissa），超出的部分自动进一舍零

2. 因为存储时有位数限制（64 位），并且某些十进制的浮点数在转换为二进制数时会出现无限循环，会造成二进制的舍入操作(0 舍 1 入)，当再转换为十进制时就造成了计算误差。

3. 理论上用有限的空间来存储无限的小数是不可能保证精确的，但我们可以处理一下得到我们期望的结果。
   - 保留需要的小数位数，`toFixed(保留位数)`:不够精确，有时 5 不会进位;
   - 字符串模拟：基本原理是将浮点数表示为整数进行计算，然后再转换回浮点数。
   - `bignumber.js`第三方库: 解决大数的问题。原理是把所有数字当作字符串，重新实现了计算逻辑，缺点是性能比原生差很多。
   - `0.10000000000000000555.toPrecision(16);`// 原生 API，做精度运算，超过的精度会自动做凑整处理，返回字符串。使用 toPrecision 凑整并 parseFloat 转成数字后再显示。
   - `math.js`、`BigDecimal.js`、`big.js`、`decimal.js(据说计算基金净值比较快)`
   - 最后，建议所有对运算精度要求极高的业务场景都放到后端去运算，切记。
   - 对于运算类操作，如 `+-*/`，就不能使用 toPrecision 了。正确的做法是把小数转成整数后再运算，也是有上限的，对于非常大的浮点数，转换为整数可能会超出 JavaScript 的安全整数范围（Number.MAX_SAFE_INTEGER），如果小数位不确定这个方法也可能会有误差。以加法为例：

```js
/**
 * 精确加法
 */
function add(num1, num2) {
  const num1Digits = (num1.toString().split(".")[1] || "").length;
  const num2Digits = (num2.toString().split(".")[1] || "").length;
  const baseNum = Math.pow(10, Math.max(num1Digits, num2Digits));
  return (num1 * baseNum + num2 * baseNum) / baseNum;
}
```

4. `number.toPrecision(precision);`，precision：一个介于 1 到 100 之间的整数，表示**有效数字的位数**。返回一个表示指定精度的数字字符串。可以返回科学计数法表示（如 "1.2e+2"）。

```js
let num = 123.456;

console.log(num.toPrecision(2)); // "1.2e+2"（科学计数法）
console.log(num.toPrecision(4)); // "123.5"
console.log(num.toPrecision(5)); // "123.46"
console.log((123.455).toPrecision(5)); // "123.45"
console.log(num.toPrecision(6)); // "123.456"
console.log(num.toPrecision(1)); // "1e+2"
```

## 运算符优先级

![运算符优先级](https://cdn.jsdelivr.net/gh/EricYangXD/vital-images/imgs/202501191802077.png)

[MDN-运算符优先级](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Operator_precedence)

## 数组扁平化

即把数组从多维的展成一维的。大概有如下几种方法：字节外包遇到了。

- 使用 `Array.prototype.flat()`：`arr.flat(Infinity)`使用 Infinity 可以展开任意深度的嵌套数组。
- 递归方法，对于大型数组或深层嵌套，可能导致栈溢出。
- 使用 reduce 方法
- 使用扩展运算符

代码示例：

```js
const arr = [1, [2, [3, 4], 5], 6, [7, 8]];
console.log(arr.flat(Infinity)); // [1, 2, 3, 4, 5, 6, 7, 8]

function flattenArray(arr) {
  let result = [];
  for (let i = 0; i < arr.length; i++) {
    if (Array.isArray(arr[i])) {
      result = result.concat(flattenArray(arr[i]));
    } else {
      result.push(arr[i]);
    }
  }
  return result;
}
const arr = [1, [2, [3, 4], 5], 6, [7, 8]];
console.log(flattenArray(arr)); // [1, 2, 3, 4, 5, 6, 7, 8]

function flattenArray(arr) {
  return arr.reduce((acc, val) => (Array.isArray(val) ? acc.concat(flattenArray(val)) : acc.concat(val)), []);
}
const arr = [1, [2, [3, 4], 5], 6, [7, 8]];
console.log(flattenArray(arr)); // [1, 2, 3, 4, 5, 6, 7, 8]

function flattenArray(arr) {
  while (arr.some((item) => Array.isArray(item))) {
    arr = [].concat(...arr);
  }
  return arr;
}
const arr = [1, [2, [3, 4], 5], 6, [7, 8]];
console.log(flattenArray(arr)); // [1, 2, 3, 4, 5, 6, 7, 8]
```

## jsBridge 通信失败怎么处理

1. 错误检测和日志记录:首先，实现一个全面的错误检测和日志记录机制
2. 重试机制:对于一些非关键操作，可以实现自动重试机制
3. 降级策略:当 JSBridge 完全不可用时，实现降级策略
4. 版本检查:确保 Web 端和 App 端的 JSBridge 版本兼容
5. 超时处理:为 JSBridge 调用添加超时处理
6. 健康检查/网络检查:定期进行 JSBridge 健康检查
7. 用户反馈:当遇到持续的 JSBridge 问题时，提供用户反馈机制

## h5 怎么调用 native 的方法

## v-if 和 v-show 的区别

- v-if：条件判断，当条件为 true 时，渲染组件；当条件为 false 时，组件根节点会被销毁，不再渲染。v-show：条件展示，当条件为 true 时，渲染组件；当条件为 false 时，组件根节点仍然存在，只是 `display:none`。
- v-if 的开销较大，因为它涉及到组件的销毁和重建；v-show 的开销较小，因为它只是简单地切换 CSS 属性。
- v-if 有更高的切换开销，因为它需要同时把旧的组件实例销毁（回收内存）和新的组件实例创建（渲染）；v-show 有更高的初始渲染开销，因为它需要初始渲染时就渲染组件，没有切换过程。
- v-if 适用于运行时条件，v-show 适用于初始渲染条件。
- v-if 惰性渲染，性能开销大，适合条件切换较少的场景。v-show 通过样式控制显示，性能开销小，适合频繁切换的场景。
- v-if：会触发组件的生命周期钩子（如 created、mounted 等）。v-show：不会触发组件的生命周期钩子。
- v-if：可以和 `v-else`、`v-else-if` 配合使用。v-show：不能和 v-else 等指令配合使用。
- v-show: 条件切换频率较高。页面初次加载时，内容需要渲染出来，但可以通过样式快速切换来控制显示。
- v-if: 如果涉及敏感信息或需要严格控制渲染。条件切换较少。页面初次加载时，需要根据条件决定是否渲染内容，条件为 true 时才渲染。隐藏的内容较多，或者需要动态销毁和重新创建的场景。

| 特性     | v-if                           | v-show                        |
| -------- | ------------------------------ | ----------------------------- |
| 机制     | 添加或移除 DOM 元素            | 修改元素的 display 样式       |
| 初始渲染 | 条件为 true 时才渲染           | 无论条件如何，都会渲染一次    |
| 切换性能 | 切换成本高，适合条件变化不频繁 | 切换成本低，适合频繁显示/隐藏 |
| DOM 占用 | 条件为 false 时，不存在于 DOM  | 始终存在于 DOM 中             |

## 合成事件和原生事件

1. 原生事件是浏览器提供的 DOM 事件，直接绑定在真实的 DOM 节点上。例如，常见的原生事件有 click、mousemove、keydown 等。这些事件是由浏览器引擎直接触发和管理的。
2. 合成事件是 React 提供的一种跨浏览器的事件封装。React 的合成事件系统是为了提供一致的接口，保证在不同浏览器中具有相同的行为，并且能够更高效地管理事件。React 中的事件处理函数接收到的事件对象是 SyntheticEvent，而不是原生的 DOM 事件对象。
3. 合成事件：通过事件委托和池化机制提高性能，减少内存分配和垃圾回收。原生事件：直接绑定在 DOM 上，无法享受 React 的优化。
4. 合成事件：默认绑定在组件的根节点，通过事件委托机制进行处理。原生事件：可以直接绑定在具体的 DOM 节点上。

合成事件的特点：

- 跨浏览器兼容性：合成事件屏蔽了浏览器之间的兼容性问题，提供了一致的 API。
- 事件池化：React 对合成事件进行了池化，这意味着在事件回调函数中不能异步访问事件对象，因为事件对象会被重用以提高性能。在异步操作中，需要调用事件对象的 persist() 方法来保持事件的引用。
- 与原生事件的交互：合成事件在事件冒泡阶段被处理，通常绑定在组件的根节点上，而不是直接绑定在 DOM 节点上。

```js
import React from "react";

function Example() {
  // 合成事件
  const handleClick = (e) => {
    console.log("合成事件:", e);
    console.log("合成事件类型:", e.type);

    // 保留事件对象以供异步使用
    e.persist();
    setTimeout(() => {
      console.log("异步访问事件对象:", e.type);
    }, 1000);
  };

  // 原生事件
  const divRef = React.useRef(null);

  React.useEffect(() => {
    const handleNativeClick = (e) => {
      console.log("原生事件:", e);
    };

    const currentDiv = divRef.current;
    currentDiv.addEventListener("click", handleNativeClick);

    // 清除原生事件监听器
    return () => {
      currentDiv.removeEventListener("click", handleNativeClick);
    };
  }, []);

  return (
    <div ref={divRef} onClick={handleClick}>
      点击我
    </div>
  );
}

export default Example;
```

## React 中定义一个变量，不使用 state 怎么更新它？

在 React 中，如果一个变量的变化不需要触发组件重新渲染，可以使用 useRef 来保持其值。useRef 可以在组件的生命周期内保持不变且不会引起重渲染。

```jsx
import React, { useRef } from "react";

function ExampleComponent() {
  const countRef = useRef(0);

  const increment = () => {
    countRef.current += 1;
    console.log(countRef.current);
  };

  return <button onClick={increment}>Increase</button>;
}
```

## 前端如何优雅通知用户刷新页面

这里说的是用户不会主动刷新页面的情况，比如代码更新了，需要主动弹窗等方式通知用户刷新页面。

1. 前端起一个定时器 setInterval 轮询后端服务器，对比 etag 是否变化，如果变化，则刷新页面。
2. 每次上线，后端加一下自定义响应字段`add_header X-App-Version "1.0.0"`，然后前端每次请求都会带上，如果某次带的和返回的不一致就是有更新，提示用户刷新。
3. websocket 或者 EventSource（SSE），服务端推送版本变化情况，前端监听结果并根据结果刷新页面。[SSE demo](../../../demos/js/sse-client.html)
4. 使用 Service Worker，监听更新事件，当检测到新版本时，提示用户刷新页面。

## 实现一个支持链式调用的函数

1. 利用 Proxy 的特性，拦截函数调用，返回一个新的函数，该函数在调用时会更新变量的值。

```js
function chain(value) {
  const handler = {
    get: function (obj, prop) {
      if (prop === "end") {
        return obj.value;
      }
      if (typeof window[prop] === "function") {
        obj.value = window[prop](obj.value);
        return proxy;
      }
      return obj[prop];
    },
  };

  const proxy = new Proxy({ value }, handler);
  return proxy;
}

function plusOne(a) {
  return a + 1;
}
function double(a) {
  return a * 2;
}
function minusOne(a) {
  return a - 1;
}

console.log(chain(1).plusOne.double.minusOne.end); // 3
```

## 动态执行函数

1. `eval(str)` -> 同步代码，作用域是局部/函数作用域
2. `setTimeout(str, 0)` -> 宏任务，需要注意作用域是全局作用域
3. `(new Function(arg1, arg2, str))()` -> 同步代码
4. `<script>`标签 -> 在浏览器的 JavaScript 环境中，`<script>` 标签中的代码是在宏任务（macro task）中执行的。`script.textContent = str; document.body.appendChils(script);`

## 静态属性与动态属性

1. 静态属性：
   - 静态属性是定义在类或对象的构造函数上，属性名是硬编码，且在编写时就已知，可以通过类名或对象名直接访问。
   - 可以直接通过`.`点符号访问
   - 不能使用数字、变量作为属性名
2. 动态属性：
   - 可以通过方括号`[]`访问但不能通过`.`点符号访问
   - 可以在运行时计算得出，可以使用数字、变量、字符串字面量、表达式作为属性名

## 函数的 name 是不可被修改的

## `==/===/Object.is()`的区别

1. `==`会进行隐式类型转换。
2. `===`/`Object.is()`不会进行类型转换，`===` 会比较值和类型，`Object.is()` 也会比较值和类型，但 `NaN === NaN` 为 false，而 `Object.is(NaN, NaN)` 为 true。`+0===-0` 是 true，而 `Object.is(+0, -0)` 为 false。
3. `==`相等比较：如果一个操作数是对象，另一个操作数是字符串或者数字，会首先调用对象的 valueOf 方法，将对象转化为基本类型，在进行比较。当 valueOf 返回的不是基本类型的时候，才会调用 toString 方法。

## 页面多图片加载优化

## 移动端 h5 适配问题

## 二叉搜索树

## 白屏原因&优化

## 白屏时间计算

## Git hotfix

## npm i/npm start/npm run build 区别

## webpack 热加载 HMR 原理

- 使用 `HotModuleReplacementPlugin` 插件，并配置 `webpack-dev-server` 启用 HMR。开发服务器监控文件变化，检测到变化后重新编译并推送更新，浏览器通过 WebSocket 接收并替换模块。

- Webpack HMR 特性的原理并不复杂，核心流程：

1. 使用 webpack-dev-server (后面简称 WDS)托管静态资源，同时以 Runtime 方式注入 HMR 客户端代码
2. 浏览器加载页面后，与 WDS 建立 WebSocket 连接
3. Webpack 监听到文件变化后，增量构建发生变更的模块，并通过 WebSocket 发送 hash 事件
4. 浏览器接收到 hash 事件后，请求 manifest 资源文件，确认增量变更范围
5. 浏览器加载发生变更的增量模块
6. Webpack 运行时触发变更模块的 `module.hot.accept` 回调，执行代码变更逻辑
7. done

![hmr](https://cdn.jsdelivr.net/gh/EricYangXD/vital-images@master/imgs/hmr.png)
![hmr-process](https://cdn.jsdelivr.net/gh/EricYangXD/vital-images@master/imgs/hmr-process.png)

Webpack 的 HMR 特性有两个重点，一是监听文件变化并通过 WebSocket 发送变更消息到浏览器端；二是需要客户端提供配合，通过 `module.hot.accept` 接口明确告知 Webpack 如何执行代码替换。

生产环境打包时 Webpack 默认配置可能残留部分未引用代码，需要手动配置`optimization.usedExports`等选项。

## Vite 的 HMR 原理

- Vite 的热更新（HMR）通过浏览器原生支持 ES 模块和 WebSocket 实现。当代码文件被修改时，Vite 服务端会精准定位到变化的模块，通过 WebSocket 通知浏览器，浏览器动态加载新模块并替换旧模块，无需刷新页面。例如修改 Vue 单文件组件时，仅该组件的实例会被更新，保留当前应用状态。

- Vite 的 HMR 利用浏览器原生 ESM 特性，直接按需加载模块，**无需打包**，因此更新速度更快。而 Webpack 的 HMR 依赖打包后的模块系统，每次修改需重新构建依赖图，并通过 hot.accept 手动声明更新边界。修改一个 Vue 文件时，Vite 仅替换该文件，而 Webpack 可能需要重新构建整个 chunk（可能需构建完整依赖图谱）。

- Vite 在开发模式下借助浏览器原生 ESM 能力也能实现**实时按需加载**。

- 模块处理机制：
  - Vite 通过 ESM 的 import/export 实现实时按需编译
  - Webpack 需通过 AST 解析构建模块依赖关系图

## vue diff 和 react diff

| 特性       | React Diff                      | Vue2 Diff                              |
| ---------- | ------------------------------- | -------------------------------------- |
| 基本策略   | 同层比较 + key 优化             | 同层比较 + 双端比较                    |
| 列表 Diff  | 依赖唯一 key，逐一对比          | 双端比较，按头尾指针寻找最优解         |
| 跨层级操作 | 不支持，跨层级直接删除新增      | 同样不支持，直接删除新增               |
| 性能       | 列表更新性能依赖于 key 是否合理 | 列表更新性能较高，适合头尾频繁插入删除 |
| 复杂度     | O(n)                            | O(n)                                   |

原理和区别：

1. 虚拟 DOM 树同层比较：只比较虚拟 DOM 的同一层级，不会跨层级比较，如果节点类型相同（如`<div>` 对比 `<div>`），则继续对比属性和递归对比子节点。如果类型不同，则直接销毁旧节点，创建新节点。
2. React 列表的比较：使用 key 进行优化，避免出现全量更新。
   - 如果所有节点都有唯一的 key，React 可以快速找到对应的节点，按 key 匹配更新。即使节点顺序发生变化，也只更新必要部分。
   - 如果没有 key 或 key 不唯一，React 会按默认顺序逐一对比，这在插入或删除节点时可能导致性能下降。
3. Vue2 列表的比较：使用了一种高效的 双端比较算法。它通过四个指针，分别指向新旧列表的头尾节点，

   - 1. 从新旧列表的头部开始比较，如果相同则复用，更新内容，指针向后移动。newStart++，oldStart++。否则，进入下一步。
   - 2. 从新旧列表的尾部开始比较，如果相同则复用，更新内容，指针向前移动。newEnd--，oldEnd--。否则，进入下一步。
   - 3. 比较新列表的起始节点与旧列表的结束节点，如果相同则复用，更新内容，将旧节点移动到 newStart 的位置（DOM 操作），移动指针：newStart++，oldEnd--。否则，进入下一步。
   - 4. 比较新列表的结束节点与旧列表的起始节点，如果相同则复用，更新内容，将旧节点移动到 newEnd 的位置（DOM 操作），移动指针：newEnd--，oldStart++。否则，进入下一步。
   - 5. 如果头尾无法匹配即以上 4 步均未找到相同节点，则尝试查找旧节点中能复用的节点（通过 key 查找新节点在旧列表中的位置）-遍历旧列表，查找 newStart 节点是否存在。如果找到：复用旧节点，更新内容（如有变化）。将旧节点移动到 newStart 的位置（DOM 操作）。如果未找到：创建新节点并插入到 newStart 的位置（DOM 操作）。移动指针：newStart++。
   - 6. 处理剩余节点，如果旧列表遍历完毕，但新列表仍有剩余节点：创建新节点并插入到对应位置（DOM 操作）。如果新列表遍历完毕，但旧列表仍有剩余节点：删除旧节点（DOM 操作）。

4. Vue3 中的 diff：

   - 基于 Proxy 的响应式系统：Vue 3 引入了基于 Proxy 的响应式系统，这使得其在处理数据变化时更加高效。Diff 算法可以在更细粒度的变化中快速识别更新，减少不必要的重渲染。
   - 编译时优化：Vue 3 使用了新的模板编译器，可以在编译时就生成更优化的虚拟 DOM 结构，减少运行时的开销，提升 Diff 效率。
   - 优化的 Diff 算法：Vue 3 的 Diff 算法对比逻辑进行了简化，采用了一种基于层级的比较策略。它首先比较节点的位置信息，从而快速决定哪些节点需要更新。对于同一层级的节点，Vue 3 会直接对比节点类型，如果节点类型相同，则只需更新属性和事件。
   - Fragment 支持：Vue 3 支持 Fragment，使得多个根节点的支持更为简单。Diff 算法在处理这些情况下也进行了优化。
   - 逻辑分离：Vue 3 通过重构，将不同的 Diff 逻辑分离到不同的函数中，使得代码更加清晰，易于维护和扩展。
   - key 的使用：同样地，Vue 3 依然鼓励在列表渲染时使用 key 属性，但它在处理带有 key 的节点时也进行了优化，能够更高效地利用节点缓存。

5. 总结：

   - React 的 diff 算法更侧重于简单规则和 key 的使用，通过假设更新操作是局部的来优化性能。
   - Vue 的 diff 算法使用了双端比较，更适合频繁插入、删除的场景，进一步提升了列表的更新效率。
   - 两者的核心思想是相似的，都是为了实现高效的视图更新，但实现细节和场景优化各有侧重。

## vue 指令

### vue2

### vue3

## 扁平数据结构转 Tree

```js
const arr = [
  { id: 1, name: "部门1", pid: 0 },
  { id: 2, name: "部门2", pid: 1 },
  { id: 3, name: "部门3", pid: 1 },
  { id: 4, name: "部门4", pid: 3 },
  { id: 5, name: "部门5", pid: 4 },
];
// 转为tree
[
  {
    id: 1,
    name: "部门1",
    pid: 0,
    children: [
      {
        id: 2,
        name: "部门2",
        pid: 1,
        children: [],
      },
      {
        id: 3,
        name: "部门3",
        pid: 1,
        children: [
          // 结果 ,,,
        ],
      },
    ],
  },
];

// 1
/**
 * 递归查找，获取children
 */
const getChildren = (data, result, pid) => {
  for (const item of data) {
    if (item.pid === pid) {
      const newItem = { ...item, children: [] };
      result.push(newItem);
      getChildren(data, newItem.children, item.id);
    }
  }
};

/**
 * 转换方法
 */
const arrayToTree = (data, pid) => {
  const result = [];
  getChildren(data, result, pid);
  return result;
};

// 2
function arrayToTree(items) {
  const result = []; // 存放结果集
  const itemMap = {}; //

  // 先转成map存储
  for (const item of items) {
    itemMap[item.id] = { ...item, children: [] };
  }

  for (const item of items) {
    const { id, pid } = item;
    const treeItem = itemMap[id];
    if (pid === 0) {
      // root
      result.push(treeItem);
    } else {
      if (!itemMap[pid]) {
        itemMap[pid] = {
          children: [],
        };
      }
      itemMap[pid].children.push(treeItem);
    }
  }
  return result;
}

// 3 性能最优
function arrayToTree(items, rootId) {
  const result = []; // 存放结果集
  const itemMap = {}; //
  for (const item of items) {
    const id = item.id;
    const pid = item.pid;

    if (!itemMap[id]) {
      itemMap[id] = {
        children: [],
      };
    }

    itemMap[id] = {
      ...item,
      children: itemMap[id]["children"],
    };

    const treeItem = itemMap[id];

    if (pid === rootId) {
      result.push(treeItem);
    } else {
      if (!itemMap[pid]) {
        itemMap[pid] = {
          children: [],
        };
      }
      itemMap[pid].children.push(treeItem);
    }
  }
  return result;
}
```

## JavaScript 中 (0, function)(param) 是什么?

0. 通常用于改变函数调用时的上下文 this 的指向，或者用于间接调用函数。确保函数调用时，this 指向的是全局上下文对象（严格模式下是 undefined），而不是当前作用域。可用于：模块化代码、避免副作用、解绑对象方法。
1. 逗号操作符: 对它的每个操数求值（从左到右），并返回最后一个操作数的值。
2. eval 执行的代码环境上下文，通常是局部上下文。直接调用，使用本地作用域。间接调用，使用全局作用域。

```js
function test() {
  var x = 2,
    y = 4;
  console.log(eval("x + y")); // 直接调用，使用本地作用域，结果是 6

  var geval = eval; // 等价于在全局作用域调用
  console.log(geval("x + y")); // 间接调用，使用全局作用域，throws ReferenceError 因为`x`未定义
}

// 解绑对象方法
const obj = {
  value: "Hello",
  logValue() {
    console.log(this.value);
  },
};

// 直接调用，this 指向 obj
obj.logValue(); // 输出: Hello

// 使用 (0, function) 解绑 this
const logValue = (0, obj.logValue);
logValue(); // 输出: undefined（严格模式）或 window.value（非严格模式）
```

3. `(0,eval)` 属于间接调用，使用的是 全局作用域，this 指向的是全局上下文。
4. 为什么不用 call / apply 指定全局上下文 window ? 是为预防 call / apply 被篡改后，导致程序运行异常。
5. 为什么逗号操作符用 0 ? 其实，用其他数字或者字符串也是没问题的。至于为什么用 (0, function) ? 可以说是业界的默认规则。如果硬要说个为什么，可能是 0 在二进制的物理存储方式上，占用的空间较小。

## 并发请求

```js
// 给定一个待请求的url数组，和允许同时发出的最大请求数，写一个函数fetch并发请求，要求最大并发数为maxNum，并且尽可能快的完成所有请求
const urls = [
  "https://jsonplaceholder.typicode.com/posts/1",
  "https://jsonplaceholder.typicode.com/posts/2",
  "https://jsonplaceholder.typicode.com/posts/3",
  "https://jsonplaceholder.typicode.com/posts/4",
  "https://jsonplaceholder.typicode.com/posts/5",
  "https://jsonplaceholder.typicode.com/posts/6",
  "https://jsonplaceholder.typicode.com/posts/7",
  "https://jsonplaceholder.typicode.com/posts/8",
  "https://jsonplaceholder.typicode.com/posts/9",
  "https://jsonplaceholder.typicode.com/posts/10",
];

function fetchUrls(urls, maxNum) {
  return new Promise((resolve) => {
    if (urls.length === 0) {
      resolve([]);
      return;
    }

    const results = new Array(urls.length);
    let count = 0;
    let index = 0;

    async function request() {
      if (index >= urls.length) {
        return;
      }

      const curIndex = index++;
      const url = urls[curIndex];

      try {
        const res = await fetch(url);
        results[curIndex] = await res.json(); // Assuming you want the JSON response
      } catch (e) {
        results[curIndex] = e;
      } finally {
        count++;
        if (count === urls.length) {
          resolve(results);
        } else {
          request(); // Start the next request
        }
      }
    }

    const times = Math.min(maxNum, urls.length);
    // 最开始先同时发出times个请求，然后每个请求结束后在finally中判断count也就是一共已经发出了多少个请求，如果还有请求没发出，那就继续调用request，否则就把results返回。
    for (let i = 0; i < times; i++) {
      request();
    }
  });
}

fetchUrls(urls, 3).then((results) => {
  console.log(results);
});
```

## Composition API 有哪些

1. setup 函数：是 Composition API 的入口点，用于定义组件的响应式状态、计算属性、方法等，在组件创建之前执行，可以返回一个对象，对象中的属性和方法可以在模板中直接使用。
2. ref 和 reactive：用于定义响应式数据，ref 用于定义单个基本数据类型的响应式数据，reactive 用于定义对象或数组的响应式数据。
3. computed：用于定义计算属性，计算属性会根据依赖的数据自动更新，且会缓存计算结果。
4. watch 和 watchEffect：用于监听数据的变化，watch 用于监听指定的数据，watchEffect 用于监听数据的变化，不需要指定监听的数据。
5. 生命周期钩子：使用 onMounted、onUpdated、onUnmounted 等函数来定义组件的生命周期钩子。用于在组件的不同生命周期阶段执行代码。

## Vue3 中父子组件通信的方式

1. `props`：父组件通过 props 向子组件传递数据。
2. `$emit`事件：子组件通过 $emit 触发父组件的事件，可以向父组件传递数据。
3. `provide`/`inject`：父组件通过 provide 提供数据，子组件通过 inject 注入数据。适用于跨多层的组件之间的通信。
4. vuex/Pinia：状态管理库，适用于大/中小型应用的状态管理，集中管理应用的状态，使得状态的变化可预测。
5. EventBus：通过事件总线实现父子组件通信，适用于简单的应用场景。
6. `$attrs`/`$listeners`：适用于透传属性和事件，将父组件的属性和事件透传给子组件。
7. `v-model`：用于实现双向绑定，父组件通过 v-model 绑定数据，子组件通过 emit 触发 input 事件。
   - `v-model` 是语法糖，等价于 `:value` 和 `@input` 两个属性。
   - 子组件通过 emit 触发 `update:modelValue` 事件，父组件通过 v-model 绑定数据。`modelValue` 是 `v-model` 的默认 prop 名称，`update:modelValue` 是 `v-model` 的默认事件名称。
   - `<input :value="props.modelValue" @input="emit('update:modelValue', $event.target.value)" />`。
   - 可以传递多个参数：`<Child v-model:param1="param1" v-model:param2="param2" />`。
   - 父组件中的监听是通过`v-model`自动实现的，监听的属性名即`v-model`传的参数的名称。
8. `$refs`：父组件通过 `$refs` 获取子组件的实例，从而调用子组件的方法或访问子组件的数据。

### Vue 3 Proxy 响应式系统的优化

1. Proxy 使 Vue3 的响应式系统更高效，支持新增属性监听、数组操作拦截等。
2. 依赖按需收集：Vue2 在初始化时遍历整个对象，而 Vue3 采用 `Lazy Proxy（惰性代理）`只有在访问属性时才进行代理，减少性能消耗。
3. 自动清理无效依赖：Vue3 采用 `WeakMap + Set` 进行依赖存储，避免内存泄漏，Vue2 需要手动管理依赖删除。
4. 只更新受影响的组件 Vue3 的 `trigger()` 机制让每个组件只更新它所依赖的部分，避免 Vue2 中全局重新计算的问题。

### vue 的 vm 实例在挂载时发生了什么

当 Vue2 实例 (vm) 挂载时，会发生一系列重要的初始化过程：

1. 初始化生命周期：设置实例的`$parent`、`$root`等属性
2. 初始化事件系统：建立`$on`、`$emit`等事件方法
3. 初始化渲染函数：设置`$createElement`等渲染相关方法
4. 调用`beforeCreate`钩子：此时数据观察和事件配置都还未初始化
5. 初始化注入(`inject`)：处理父组件提供的依赖注入
6. 初始化状态：
   - 初始化 props
   - 初始化 methods
   - 初始化 data（响应式处理）
   - 初始化 computed
   - 初始化 watch
7. 初始化提供(`provide`)：设置组件提供的依赖
8. 调用 `created` 钩子：此时实例已创建完成，数据观察等已完成，但 DOM 还未生成
9. 挂载阶段开始：
10. 检查是否有 el 选项，如果没有则等待手动调用`$mount`
11. 检查是否有`template`选项，有则编译为渲染函数，没有则使用 el 的`outerHTML`作为模板
12. 调用`beforeMount`钩子
13. 创建渲染 Watcher：
    - 创建一个渲染 Watcher 来监听依赖变化
    - 执行初始渲染，生成虚拟 DOM 并转换为真实 DOM
14. 调用`mounted`钩子：此时组件已挂载到 DOM 上

Vue3 的过程类似，有些许不同：

1. 应用初始化：`const app = createApp(AppComponent); app.mount('#app');`
2. 组件实例创建阶段：
   - 初始化组件选项：合并全局/局部配置
   - 建立响应式上下文：通过 `reactive()` 创建响应式系统
   - 执行 `setup()` 函数（替代 Vue 2 的 `beforeCreate/created`）
     - 接收 `props` 和 `context`
     - 返回的对象将被合并到渲染上下文
3. 生命周期流程：
   1. `beforeCreate`（兼容选项式 API）：组合式 API 中通过 `setup()` 替代
   2. `setup()` 执行
   3. `onBeforeMount` 钩子触发
   4. 编译阶段（如果使用模板）：
      - 将模板编译为优化后的渲染函数
      - 应用静态节点提升（Static Node Hoisting），Patch Flags：标记动态内容类型，Block Tree：减少不必要的树遍历
   5. `render()` 函数执行：
      - 生成虚拟 DOM（vnode）
      - 应用 Block Tree 优化
   6. `onMounted` 钩子触发：
      - 子组件的 `mounted` 会先于父组件触发

性能优化点：

1. 编译时优化
   - 动态节点标记（Patch Flags）
   - 静态树提升（Static Hoisting）
   - 缓存事件处理程序
2. 运行时优化
   - 更快的虚拟 DOM diff 算法
   - 基于 Proxy 的响应式追踪
   - 组件实例复用机制改进
3. Tree-shaking 支持
   - 未使用的功能不会打包进生产代码

## 消除异步的传染性

及如果一个函数调用了另一个异步的函数，那么这个函数也会变成异步的。

比如：fetch 是异步的函数，那么可以把 fetch 改成同步的函数，这样就可以消除异步的传染性。

例如：自定义 myFetch 函数，在执行 fetch 时先查看缓存，如有缓存则返回缓存，否则先抛出一个 Error 中断执行，然后在 fetch 成功后抛出一个 resolve 设置缓存，重新执行 fetch 或者 main 函数。

React 中的 Suspense 组件也是类似的原理，通过抛出一个 Promise 中断渲染，然后在 Promise resolve 后重新渲染。渲染两次组件。

```js
function run(func) {
  // 1. 保存旧的fetch函数
  const oldFetch = window.fetch;
  // 2. 修改fetch
  const cache = {
    status: "pending", // 'pending' | 'fulfilled' | 'rejected'
    value: null,
  };
  function myFetch(...args) {
    if (cache.status === "fulfilled") {
      return cache.value;
    } else if (cache.status === "rejected") {
      throw cache.value;
    }
    const promise = oldFetch(...args)
      .then((res) => res.json())
      .then((res) => {
        cache.status = "fulfilled";
        cache.value = res;
      })
      .catch((err) => {
        cache.status = "rejected";
        cache.value = err;
      });
    throw promise;
  }
  window.fetch = myFetch;
  // 3. 运行func
  try {
    func();
  } catch (err) {
    if (err instanceof Promise) {
      err.finally(() => {
        window.fetch = myFetch;
        func();
        window.fetch = oldFetch;
      });
    } else {
      console.log(err.message);
    }
  }
  // 4. 恢复fetch
  window.fetch = oldFetch;
}

run(main);

function myFetch(url) {
  return new Promise((resolve, reject) => {
    throw new Error("中断执行");
    fetch(url);
    fetch(url).then((res) => {
      resolve(res);
    });
  });
}
```

## 判断两个字符串中的数字的大小

<!--
两个字符串：'1-2-34-567-8-9' 和 '1-2-33-567-88-9'，长度可能很长，从左向右比较判断两个字符串中的数字的大小，如果数字相等，继续比较下一个数字，如果数字不相等，返回数字较大的字符串。
 -->

通过一个生成器函数来从头迭代这 2 个字符串，如果相等就继续比较下一个数字，如果不相等就返回数字较大的字符串。

```js
function* walk(str) {
  let s = "";
  for (let c of str) {
    if (c === "-") {
      yield Number(s); // Number()===Number('')===Number(false)===Number([])===Number('0')===Number(0)===0
      s = "";
    } else {
      s += c;
    }
  }
  if (s) {
    yield Number(s);
  }
}
function compare(str1, str2) {
  const iter1 = walk(str1);
  const iter2 = walk(str2);
  while (true) {
    const { value: v1, done: d1 } = iter1.next();
    const { value: v2, done: d2 } = iter2.next();
    if (d1 && d2) {
      return 0; // 相等
    }
    if (d1) {
      return -1; // str1 小
    }
    if (d2) {
      return 1; // str2 小
    }
    if (v1 < v2) {
      return -1;
    }
    if (v1 > v2) {
      return 1;
    }
  }
}
```

## em 和 rem 的区别

em 和 rem 是 CSS 中用于设置相对单位的两种测量方式，它们的主要区别在于它们的计算基准不同。

1. em 是一个相对单位，其基准是元素自身的字体大小。
   - 当你在一个元素上使用 em 单位时，它的值是相对于该元素的字体大小来计算的。
   - 如果在某个元素内嵌套了另一个元素，那么内嵌元素的 em 单位将会继承其父元素的字体大小，从而产生乘法效应。
2. rem 是根元素的相对单位，其基准是根元素的字体大小（即 html 标签）。 -不管元素的层级如何，使用 rem 单位时，它的值总是相对于 `<html>` 元素的字体大小来计算。
   - 这意味着 rem 单位不会受到嵌套元素的影响。

## 前端加载图片

### CSS 中的 background 属性来实现

利用 CSS 的 background 属性将图片预加载到屏幕外的背景上。只要这些图片的路径保持不变，当它们在 Web 页面的其他地方被调用时，浏览器就会在渲染过程中使用预加载（缓存）的图片。简单、高效，不需要任何 JavaScript。该方法虽然高效，但仍有改进余地。使用该法加载的图片会同页面的其他内容一起加载，增加了页面的整体加载时间。

### 使用 JavaScript 方式来实现

在 JS 中利用 Image 对象，为元素对象添加 src 属性，将对象缓存起来待后续使用。

```JavaScript
//banner img 高清加载
function imgdownLoad(){
    var setImg = function(imgLgUrl) {
        if(imgLgUrl) {
            var imgObject = new Image();
            imgObject.src = imgLgUrl;
            if(imgObject.complete){ //发现缓存则加载缓存
                $img.attr("src", imgLgUrl);
                return ;
            }
            imgObject.onload = function(){ //图片加载完成后替换图片
                $img.attr("src", imgLgUrl);
            }
        }
    }
    $("img").each(function(){
        var $img = $(this);
        var imgLg = $img.attr("data-imglg"); //高清
        var imgMd = $img.attr("data-imgmd"); //中等
        var imgSm = $img.attr("data-imgsm"); //一般
        setImg(imgSm);
        setImg(imgMd);
        setImg(imgLg);
    });
}
```

### 计算页面滚动位置进行预加载

先给图片设置统一的占位图，然后再根据页面滚动情况使用自定义属性`data-src`去加载图片。

```html
<body>
  <div>
    <img class="lazy-load" data-src="https://fakeimg.pl/600x200" alt="images" />
    <img class="lazy-load" data-src="https://fakeimg.pl/700x200" alt="images" />
    <img class="lazy-load" data-src="https://fakeimg.pl/800x200" alt="images" />
    <img class="lazy-load" data-src="https://fakeimg.pl/900x200" alt="images" />
  </div>
  <script src="https://cdn.jsdelivr.net/npm/lodash@4.17.21/lodash.min.js" type="text/javascript"></script>

  <script type="text/javascript">
    let lazyImages = [...document.querySelectorAll(".lazy-load")];
    let inAdvance = 300;
    function lazyLoad() {
      console.log("lazyLoading...");
      lazyImages?.forEach((image) => {
        if (image.offsetTop < window.innerHeight + window.pageYOffset + inAdvance) {
          image.src = image.dataset.src;
        }
      });
    }
    lazyLoad();
    window.addEventListener("scroll", _.throttle(lazyLoad, 50));
    window.addEventListener("resize", _.throttle(lazyLoad, 50));
  </script>
</body>
```

### 每次加载一张图片

通过 onload 事件判断 Img 标签加载完成。

```js
const imgArrs = [
  "https://fakeimg.pl/100x200",
  "https://fakeimg.pl/200x200",
  "https://fakeimg.pl/300x200",
  "https://fakeimg.pl/400x200",
  "https://fakeimg.pl/500x200",
  "https://fakeimg.pl/600x200",
]; // 图片地址
const content = document.getElementById("content");
const loadImg = () => {
  if (!imgArrs.length) return;
  const img = new Image(); // 新建一个Image对象
  img.src = imgArrs[0];
  img.setAttribute("class", "img-item");
  img.onload = () => {
    // 监听onload事件
    // setTimeout(() => { // 使用setTimeout可以更清晰的看清实现效果
    content.appendChild(img);
    imgArrs.shift();
    loadImg();
    // }, 1000);
  };
  img.onerror = () => {
    // do something here
  };
};
loadImg();
```

#### img 标签加载时机

img 标签是什么时候发送图片资源请求的？

1. HTML 文档渲染解析，如果解析到 img 标签的 src 时，浏览器就会立刻开启一个线程去请求图片资源。
2. 动态创建 img 标签，设置 src 属性时，即使这个 img 标签没有添加到 dom 元素中，也会立即发送一个请求。

```js
const img = new Image();
img.src = "https://fakeimg.pl/100x200";
```

3. 创建了一个 div 元素，然后将存放 img 标签元素的变量添加到 div 元素内，而 div 元素此时并不在 dom 文档中，页面不会展示该 div 元素，那么浏览器会发送请求吗？-- 会！
4. 通过设置 css 属性能否做到禁止发送图片请求资源？-- 不一定
   - 给 img 标签设置样式`display: none`或者`visibility: hidden`，隐藏 img 标签，无法做到禁止发送请求。
   - 将图片设置为元素的背景图片`background-image`，但此元素不存在，可以做到禁止发送请求。dom 文档中不存在 class 为 test 的元素时，即使给 test 这个 class 设置了背景图片，也不会发送请求，只有有使用到 test 这个 class 的元素存在时才会发送请求。

```html
<style>
  .test {
    background-image: url("https://fakeimg.pl/300x200");
  }
</style>
<div id="container">
  <div class="test1">test background-image</div>
  <img src="https://fakeimg.pl/100x200" style="display: none" />
  <img src="https://fakeimg.pl/200x200" style="visibility: hidden" />
</div>
<script>
  const img = `<img src='https://fakeimg.pl/600x200'>`;
  const dom = document.createElement("div");
  dom.innerHTML = img;
  // document.body.appendChild(dom);
</script>
```

## iframe 相关

### 父子页面通信问题

iframe 和父页面是两个独立的上下文环境，这使得父子页面之间的通信变得复杂。父页面想操作 iframe 内的 Vue 子应用数据（或者反过来）。如果 iframe 加载的是跨域内容，直接访问 iframe 的内容会触发 跨域限制。

- 同源情况：使用 window.postMessage 做通信，父子页面同源时，可以通过 postMessage 实现数据通信：
- 跨域情况：后端接口代理，如果 iframe 加载的是跨域资源，推荐通过后端代理实现同源加载，或者借助中间服务器转发通信。

### iframe 加载速度慢，阻塞父页面性能

iframe 的加载是一个独立的网络请求和渲染过程，如果其加载的内容较多或速度较慢，会影响父页面的性能表现。iframe 加载时间过长，页面白屏。iframe 的加载和渲染阻塞了父页面的交互。

- 懒加载 iframe，仅在需要时加载 iframe，可以使用 Vue 的 v-if 或动态绑定 src 的方式
- 异步加载机制，在大部分场景中，可以通过设置占位符（如加载动画）来提升用户体验，避免长时间白屏。
- 优化 iframe 加载速度，使用懒加载、预加载、CDN 等优化技术，减少 iframe 加载时间。

### 样式和滚动条问题

iframe 独立的 CSS 环境可能导致样式问题，尤其是父页面需要控制 iframe 的样式时非常困难。此外，iframe 内部的滚动条可能会影响用户体验。iframe 内样式与父页面不一致。父页面滚动和 iframe 滚动冲突。

- 控制 iframe 的样式：通过注入 CSS。如果你能控制 iframe 加载的内容，可以在父页面通过 contentWindow.document 动态注入样式

```js
const iframe = document.getElementById("myIframe");
const style = document.createElement("style");
style.textContent = "body { margin: 0; overflow: hidden; }";
iframe.contentWindow.document.head.appendChild(style);
```

- 隐藏滚动条，为 iframe 添加样式，隐藏滚动条

```js
iframe {
  overflow: hidden;
  scrollbar-width: none; /* Firefox */
}
iframe::-webkit-scrollbar {
  display: none; /* Chrome, Safari */
}
```

- 同步滚动条，如果需要让父页面和 iframe 的滚动同步，可以监听 iframe 的滚动事件，并同步父页面的滚动：

```js
iframe.contentWindow.onscroll = () => {
  const scrollTop = iframe.contentWindow.scrollY;
  document.documentElement.scrollTop = scrollTop;
};
```

### 跨域限制问题

当 iframe 加载跨域资源时，JavaScript 不能直接访问 iframe 的内容。这是浏览器的同源策略所决定的，目的是为了安全性。父页面无法操作或获取 iframe 内的内容。无法控制 iframe 内的 DOM 或数据。

- 使用 postMessage 通信：跨域情况下，父页面与 iframe 可以使用 postMessage 的消息机制来通信（如前面提到的方案）。

- 后端代理实现同源：如果你有后端支持，可以通过后端代理 iframe 的内容，使其与父页面同源，从而绕过跨域限制。

- JSONP 或 CORS：如果是请求数据，可以尝试使用 JSONP 或配置服务器支持 CORS。

### SEO 和路由问题

iframe 内容对搜索引擎来说是不可见的，这会对 SEO 产生负面影响。此外，在 Vue 应用中，如果 iframe 是动态路由的一部分，可能会引发路由管理混乱。iframe 的内容不会被搜索引擎索引。Vue 的动态路由和 iframe 的加载冲突（如刷新时丢失状态）

- 避免用 iframe 承载重要内容：如果需要 SEO，尽量避免将核心内容放在 iframe 中，可以用 Vue 的组件化来代替。

- 使用 Vue 的路由守卫管理 iframe：如果 iframe 是动态路由的一部分，可以通过 Vue 的路由守卫动态设置 iframe 的内容：

```js
// router/index.js
const routes = [
  {
    path: '/iframe/:src',
    component: () => import('@/views/IframePage.vue')
  }
];

// IframePage.vue
<template>
  <iframe :src="iframeSrc" frameborder="0"></iframe>
</template>
<script>
export default {
  computed: {
    iframeSrc() {
      return this.$route.params.src;
    }
  }
};
</script>
```

### 安全问题（XSS 攻击）

如果 iframe 加载的是第三方页面，可能会引入潜在的安全风险，例如跨站脚本攻击（XSS）。加载的内容中可能存在恶意脚本。父页面受到安全隐患的影响。

- 设置 sandbox 属性：通过设置 iframe 的 sandbox 属性限制其行为：`<iframe src="https://example.com" sandbox="allow-scripts allow-same-origin"></iframe>`

- 内容安全策略（CSP）：在后端或 HTML 中设置 CSP，以限制 iframe 加载的资源：`<meta http-equiv="Content-Security-Policy" content="default-src 'self'; frame-src 'self' https://example.com;">`

## 正则表达式匹配路径

## React18 与 Vue3 组件通信

Vue 还有一种特殊的方式：attrs/useAttrs，attrs 是一个特殊的对象，在组件中，可以访问并使用未被显式声明为 props 的属性，是有状态的对象，它总是会随着组件自身的更新而更新，主要用于将父组件的非 props 特性传递给子组件，特别适用于创建包装组件或高阶组件。如果关闭了`export default defineComponent({inheritAttrs: false,}); // 关闭自动继承父属性`，那么需要通过`<button v-bind="$attrs" @click="$emit('click')">`v-bind 的形式显式绑定来自父组件的属性，比如：id、class 等。在组件中，默认情况下，attrs 会被自动绑定到组件的根元素。如果不想让它自动绑定，可以设置 `inheritAttrs: false`。这样，你就可以手动控制哪些属性和事件被传递。attrs 适合用于将父组件的多个属性转发给子组件的场景。如果你需要将组件的某些状态或数据与多个子组件共享，你可能更倾向于使用 Vue 3 的其他特性，如 provide/inject、Vuex 或 Composition API。虽然可以使用 attrs 来在某种程度上进行组件间的通信，但对于状态管理和数据流动，使用 props 和事件是更常见和推荐的方式。

### 全局的通信方法

1. React 中使用 Context 或者 Redux 等状态管理库
2. Vue3 中使用 Pinia 或者 Vuex 等状态管理库
3. 通过事件总线实现

### 父子组件通信

1. 在 React 中，父子组件通信是通过 props 实现的。父组件向子组件传递数据，子组件通过 props 接收，子组件通过 props 传入的回调函数来修改父组件的状态。
2. 在 Vue3 中，父子组件通信是通过 props 和 $emit 实现的。父组件向子组件传递数据，子组件通过 defineProps 接收。子组件向父组件传递数据通过 $emit 触发父组件中的函数实现。父组件`<Son @sendMessage="receiveMessage" />`并定义 receiveMessage 方法接收返回的参数，子组件`const emit = defineEmits(['sendMessage']);emit('sendMessage', '我是Son组件');`，可以声明 emit 的事件，以保留对事件的类型检查和编译时验证。
3. 在 Vue3 中，如何在父组件调用子组件时传递方法，并让父组件获取子组件内部的方法或属性？子组件需要明确地暴露这些方法和属性。这可以通过使用 defineExpose 来实现。随后，父组件可以通过 ref 或 useTemplateRef 来引用子组件实例，从而调用其暴露的方法或访问其属性。

### 兄弟组件通信

1. 通过将「共享的状态提升」到父组件来实现。父组件将该状态和修改状态的函数通过 props 传递给子组件。再借助 emit 进行通信。
2. 使用 EventBus：创建一个 EventBus 对象，用于在组件之间传递事件。在需要通信的组件中，使用 EventBus 发布事件，然后在另一个组件中监听该事件。

### 跨层级组件通信

1. 层层 props 传下去，麻烦，不好维护。
2. React 中，使用 Context：在需要通信的组件中，使用 Context.Provider 提供数据，然后在另一个组件中通过 Context.Consumer 订阅数据。
   - createContext 创建 context 对象，上下文 ctx 对象将包含你希望在组件树中共享的数据。
   - Provider 提供器，包裹需要跨层通信的组件。将数据通过 value 属性传递给 Provider，任何位于 Provider 内部的组件都可以访问到这些数据。
   - useContext 钩子来访问上下文中的数据。useContext 接受一个上下文对象（就是通过 createContext 创建的那个对象）作为参数，并返回该上下文的当前值。
3. Vue3 中，使用 provide/inject：在需要通信的组件中，使用 provide 提供数据`provide('msg', msg);`，然后在另一个组件中使用 inject 获取数据`const msg = inject('msg');`。

## 浏览器盒模型

盒模型（Box Model）是 CSS 布局的核心概念，定义了元素在页面中占据空间的方式。每个 HTML 元素都被视为一个矩形盒子，由 内容区域（content）、内边距（padding）、边框（border） 和 外边距（margin） 组成。

1. 标准盒模型（content-box）:默认情况下，浏览器使用 标准盒模型（`box-sizing: content-box`），`元素总宽度 = width + padding-left + padding-right + border-left + border-right`，外边距（margin） 不计算在总宽高内，但影响元素间距。
2. 怪异盒模型（border-box）：IE 早期版本使用怪异盒模型，现代浏览器可通过`box-sizing: border-box` 启用。`元素总宽度 = width（包含 padding 和 border）`，更直观的布局控制（如响应式设计）。避免因 padding 或 border 导致元素溢出容器。
3. 盒模型与布局技术：
   - Flexbox 与盒模型：Flex 容器的子元素默认 `box-sizing: content-box`。可通过 `align-self` 或 `margin: auto` 控制对齐。
   - Grid 与盒模型：Grid 单元格的尺寸计算受 box-sizing 影响。`gap` 属性替代 margin 避免折叠问题。
   - 绝对定位（position: absolute）：定位**元素的宽高默认基于父容器的 padding box（不含 margin）**。

## 手写 Promise.all

## js 隔离原理

JavaScript 隔离是指在同一个运行环境中安全地执行多个独立代码块，防止它们相互干扰或访问彼此的数据。

隔离的关键技术点：

- 作用域控制：通过函数/块级作用域限制变量访问

- 全局对象保护：防止修改或污染全局对象

- API 限制：禁用危险 API (如 eval、Function 构造函数)

- 通信机制：通过安全的消息传递进行交互

- 资源限制：限制内存、CPU 使用等

### 作用域隔离

1. 函数作用域：立即执行函数
2. 块级作用域 (ES6+)：{}

### 沙箱隔离 (Sandboxing)

1. 使用 iframe：`iframe.sandbox = 'allow-scripts'; // 限制能力`，通过`iframe.contentWindow`来控制 iframe
2. 使用 Proxy 实现沙箱：使用 Proxy 代理 window 对象，`(new Function('window', code))(proxy);`

### Web Workers 隔离

在 worker 子线程中执行，可以完全隔离主线程环境，通过 onmessage 和 postMessage 来通信

### 模块隔离 (ES Modules)

打包成不同的模块，通过`import/export`引用和导出

### 虚拟机隔离 (Node.js)

使用 vm/vm2 模块

### ShadowRealm 提案 (ES 未来特性)

```js
const realm = new ShadowRealm();
realm.evaluate(`var inner = 'shadow realm value'`);
const result = realm.evaluate(`inner`);
console.log(result); // "shadow realm value"
// 外部无法直接访问 inner
```

## CDN 缓存策略

CDN（Content Delivery Network，内容分发网络）的核心目标是通过边缘节点缓存加速内容分发，减少源站负载。合理的缓存策略能显著提升性能，同时避免内容更新延迟或缓存污染。

1. 缓存流程：用户请求 → CDN 边缘节点检查缓存：命中（HIT）：直接返回缓存内容。未命中（MISS）：回源获取资源并缓存（按策略）。缓存更新：通过过期时间（TTL）或主动刷新触发。
2. 缓存层级：边缘节点缓存：用户最近的 POP 节点。中间层缓存：区域级缓存（如大区中心节点）。源站缓存：最终回源时的缓存（如 Nginx、Cloudflare 的 Argo）。
3. 关键缓存策略：
   - 缓存时间控制（TTL），通过 HTTP 头部设置资源的存活时间。
     - `Cache-Control: max-age=3600`：资源在 CDN 和浏览器中缓存 1 小时。
     - `Cache-Control: s-maxage=86400`：仅 CDN 缓存 24 小时（覆盖 max-age）。
     - `Expires: Wed, 21 Oct 2025 07:28:00 GMT`：旧版绝对时间（优先级低于 Cache-Control）。
     - 静态资源（JS/CSS/图片）：设置较长时间。
     - 动态内容（API/HTML）：max-age=60（短 TTL）或 no-cache。
   - 缓存验证策略：确保内容新鲜性，避免过期数据
     - `Last-Modified + If-Modified-Since`：源站返回 `304 Not Modified` 若未修改。
     - `ETag + If-None-Match`：基于内容哈希的强校验（更精确）。
   - 缓存键（Cache Key）优化：CDN 通过 URL + 特定头部 生成缓存键，需避免冗余：
     - 忽略无关查询参数：`https://example.com/image.jpg?timestamp=123` → 忽略 `timestamp`
     - 区分设备类型：包含 `User-Agent` 或 `Vary: User-Agent`（谨慎使用，可能降低缓存命中率）。
     - 多语言/地区分离：`Vary: Accept-Language`。
   - 动态内容缓存：动态请求（如 API）也可有限缓存
     - 短 TTL 缓存：`Cache-Control: public, max-age=10`。
     - 按参数缓存：`GET /api/data?city=beijing` 和 `city=shanghai` 分别缓存。
     - 边缘计算：使用 CDN 的 Edge Functions（如 Cloudflare Workers）动态生成内容。
   - 主动缓存刷新：强制更新过期内容
     - URL 刷新：使特定 URL 缓存失效（如 https://example.com/style.css）。
     - 目录刷新：清除路径下所有缓存（如 /images/\*）。
     - 缓存标签（Cache Tags）：通过标签批量刷新（如 version=2）。
4. 高级策略
   - 分层缓存（Cache Tiering）
     - 边缘优先：优先从边缘节点获取，未命中时查询中间层。
     - 父节点回源：多个边缘节点共享同一上级缓存（减少源站压力）。
   - 热点缓存（Hot Content）
     - 预加载（Prefetch）：预测热门内容提前缓存。
     - 永久缓存（Pinning）：强制保留关键资源在边缘。
   - 实时日志与监控
   - 命中率监控：目标 > 90%（静态资源）或 > 50%（动态内容）。
   - 带宽节省：通过缓存减少回源流量。
5. 常见问题与解决方案：
   - 缓存穿透：大量请求绕过缓存直接回源（如恶意攻击）。
     - 设置合理的 Cache-Control。
     - 对缺失资源缓存空结果（Cache-Control: max-age=60）。
   - 缓存雪崩：同一时间大量缓存过期，导致源站瞬时压力。
     - 随机化 TTL（如 max-age=3600 + rand(600)）。
     - 使用 stale-while-revalidate 允许旧内容短期服务。
   - 版本控制：静态资源更新后浏览器仍用旧缓存。
     - 文件名哈希：/app.3a2b1c.js。
     - 查询参数：/app.js?v=2（需配置 CDN 忽略 v 参数）。

## XSS 和 CSRF

CSRF 原理和解决方案，参考[## CSRF 攻击](../WebSecurity/WebSecurity.md)，[## XSS 攻击](../WebSecurity/WebSecurity.md)。

## websocket 通信机制

WebSocket 是一种基于 TCP 的全双工通信协议，允许客户端和服务器在单个长连接上进行实时双向数据传输。与 HTTP 的“请求-响应”模式不同，WebSocket 在握手后保持连接开放，适合实时应用（如聊天、游戏、股票行情）。总结：双向通信，低延迟，协议开销低，节省带宽，能跨域，适用于实时交互场景。

通信流程：

1. 握手阶段（HTTP Upgrade）：WebSocket 通过 HTTP 协议发起握手，服务端响应`101 Switching Protocols Upgrade: websocket`升级为 WebSocket 连接
2. 数据传输阶段：握手成功后，连接升级为 WebSocket 协议，后续通信通过 二进制帧（Frame）传输，而非 HTTP 报文。

WebSocket 高级特性：

1. 子协议（Subprotocol）：握手时可协商子协议（如 `Sec-WebSocket-Protocol: chat, stock`），用于区分业务类型。
2. 扩展（Extensions）：支持压缩等扩展（如 permessage-deflate）：`Sec-WebSocket-Extensions: permessage-deflate`
3. 安全性：同源策略：WebSocket **不受同源限制**，但可通过 Origin 头验证。加密：`wss://` 使用 TLS 加密（类似 HTTPS）。

## websocket 消息质量保证

1. WebSocket 数据以帧为单位传输，包含 FIN、Opcode、Mask、Payload length、Payload data 等
2. 消息完整性：
   - 分片消息（Fragmentation）：大消息可拆分为多帧传输（FIN=0 表示还有后续帧，FIN=1 表示结束）。
   - 校验机制：TCP 层校验（保证数据不损坏）。应用层可通过消息序号或哈希校验（需自行实现）。
3. 心跳检测（Ping/Pong）：检测连接存活状态，避免因超时断开。服务器定期发送 Ping 帧（Opcode 0x9）。客户端回复 Pong 帧（Opcode 0xA）。
4. 错误处理与重连：关闭帧（Close Frame）：发送 Opcode 0x8 通知对方正常关闭。自动重连：客户端需监听 onclose 事件并重新建立连接（即自行实现）。

### 012 段消息是什么

消息分片。WebSocket 支持将一条逻辑消息拆分为多个帧传输（分片）。传输大文件或流式数据。避免单帧过大导致缓冲区溢出。

## 面向对象编程和面向过程编程的区别和理解

| 维度         | 面向过程编程（POP）         | 面向对象编程（OOP）                |
| ------------ | --------------------------- | ---------------------------------- |
| 核心思想     | 以“过程”（函数/步骤）为中心 | 以“对象”（数据与行为的封装）为中心 |
| 代码组织方式 | 线性流程，按步骤调用函数    | 通过类和对象组织代码，强调交互     |
| 数据与行为   | 数据与函数分离              | 数据与方法绑定在对象中             |
| 典型语言     | C、Pascal、早期 Fortran     | Java、C++、Python、C#              |

1. 面向过程编程（POP）：将问题分解为一系列步骤，通过函数依次调用解决问题。
   - 数据与函数分离：数据通过参数传递给函数。
   - 流程驱动：代码执行顺序明确，适合简单任务。
   - 低抽象层级：直接操作数据，缺乏封装。
2. 面向对象编程（OOP）：将问题抽象为对象，对象包含数据（属性）和行为（方法）。
   - 封装：隐藏内部细节，暴露接口（如类的 private/public）。
   - 继承：子类复用父类的属性和方法（如 class Dog extends Animal）。
   - 多态：同一接口不同实现（如方法重写、接口实现）。
   - 抽象：定义共性（如抽象类、接口）。

## 大数据渲染造成的页面卡顿怎么优化

1. 结合时间切片和虚拟滚动优化：列表渲染不会阻塞用户输入，滚动流畅。

```jsx
import { useDeferredValue } from "react";

function BigList({ items }) {
  const deferredItems = useDeferredValue(items);
  return (
    <div style={{ height: "500px", overflow: "auto" }}>
      {deferredItems.map((item) => (
        <div key={item.id}>{item.content}</div>
      ))}
    </div>
  );
}
```

2. 数据分片+RequestAnimationFrame
3. Web Worker 异步处理数据，postMessage 传给主线程渲染

## React 并发渲染

React 18 默认启用并发渲染，但需要通过 并发特性 API 显式使用。是 React18 的核心特性之一，通过时间切片和可中断渲染机制，将长时间的渲染任务拆分为小块，避免阻塞主线程，从而提高应用的响应性，减少页面卡顿，提高用户体验。

- 时间切片（Time Slicing）：将渲染工作分解为多个小任务（通常以 5ms 为单位），在浏览器的空闲时段（通过 requestIdleCallback 类似机制）执行，避免长时间占用主线程。
- 可中断渲染（Interruptible Rendering）：React 可以在执行渲染任务时，根据优先级中断低优先级的更新（如后台数据加载），优先处理高优先级的用户交互（如按钮点击）。

使用方法：

1. 使用 createRoot 和并发模式：确保使用 `ReactDOM.createRoot` 替代旧的 `ReactDOM.render`
2. 并发特性 API：
   - startTransition：标记非紧急更新，在不阻塞 UI 的情况下更新状态。useTransition hook 返回的 startTransition 函数允许将状态更新标记为 transition。`const [isPending, startTransition] = useTransition();`，startTransition 接收一个回调函数用于执行相应的状态更新等操作。
   - useDeferredValue：延迟派生值，延迟计算某些依赖状态的派生值（如防抖效果）。`const deferredData = useDeferredValue(data); // 延迟更新`，deferredData 会在空闲时更新，避免阻塞高优先级任务。
   - Suspense + 懒加载：拆分渲染优先级，结合 React.lazy 和 Suspense，延迟加载非关键组件。

```jsx
import { Suspense, lazy } from "react";
import { useDeferredValue } from "react";
import { useState, startTransition } from "react";

function SearchBox() {
  const [input, setInput] = useState("");
  const [results, setResults] = useState([]);

  const handleChange = (e) => {
    setInput(e.target.value); // 紧急更新：立即显示输入
    startTransition(() => {
      setResults(filterLargeData(e.target.value)); // 非紧急更新：可中断
    });
  };

  return (
    <>
      <input value={input} onChange={handleChange} />
      <ResultsList data={results} />
    </>
  );
}

function ResultsList({ data }) {
  const deferredData = useDeferredValue(data); // 延迟更新
  return (
    <ul>
      {deferredData.map((item) => (
        <li key={item.id}>{item.text}</li>
      ))}
    </ul>
  );
}

const HeavyComponent = lazy(() => import("./HeavyComponent"));

function App() {
  return (
    <Suspense fallback={<Spinner />}>
      <HeavyComponent /> {/* 渲染可中断 */}
    </Suspense>
  );
}
```

3. 时间切片的底层机制：React 18 通过 Fiber 架构 和 调度器（Scheduler） 实现时间切片
   - Fiber 节点的遍历：React 将组件树转换为 Fiber 链表，每个 Fiber 节点代表一个工作单元。渲染时按 Fiber 节点逐个处理，每完成一个单元检查剩余时间，若不足则暂停并让出主线程。
   - 调度器优先级：优先级类型：Immediate：用户交互（如点击）。Default：普通状态更新。Low：后台任务（如数据预加载）。调度逻辑：高优先级任务可打断低优先级任务的渲染。
4. 其他的优化性能的手段：React 18 自动批处理状态更新（包括异步操作）。避免不必要的渲染，使用 React.memo 或 useMemo/useCallback 减少子组件重复渲染等。

## 为什么要使用虚拟 DOM

为了解决直接操作真实 DOM 的性能瓶颈，同时平衡开发体验与渲染效率。虚拟 DOM 是一个轻量级的 JavaScript 对象，是对真实 DOM 的抽象。

1. 减少直接操作真实 DOM 的次数

   - 批量更新：将多次状态变化合并为一次虚拟 DOM 计算，最后统一更新真实 DOM。
   - 差异更新（Diffing）：通过对比新旧虚拟 DOM 的差异，只更新必要的部分（而非全量渲染）。

2. 跨平台能力

   - 虚拟 DOM 是 JavaScript 对象，可以渲染到不同平台（如 Web、Native、Canvas），而不仅限于浏览器 DOM。

3. 声明式编程模型
   - 开发者只需描述“UI 应该是什么样子”（如 JSX/Vue 模板），无需关心如何一步步更新 DOM。
   - 框架自动处理虚拟 DOM 到真实 DOM 的转换。

| 维度     | 虚拟 DOM 的作用                                     |
| -------- | --------------------------------------------------- |
| 性能     | 减少直接操作 DOM 的次数，通过 Diff 实现最小化更新。 |
| 开发体验 | 声明式编程，让开发者专注于状态而非 DOM 操作。       |
| 跨平台   | 同一套代码可渲染到 Web、Native 等不同环境。         |
| 可维护性 | 组件化 + 虚拟 DOM 使大型应用更易维护。              |

4. 缺点：虚拟 DOM 不是最快的，但是最平衡的。直接操作 DOM（如手动优化过的 Vanilla JS）可能比虚拟 DOM 更快。但虚拟 DOM 在 复杂应用 中提供了可预测的性能下限，避免了最差情况。虚拟 DOM 牺牲了少量性能（Diff 计算开销），换取了开发效率和可维护性。

5. 不适用于：

   - 超高频更新（如每秒 1000 次动画）：直接操作 DOM 或使用 Canvas 更合适。
   - 完全静态页面：虚拟 DOM 的 Diff 反而多余。

6. 现代框架的优化趋势
   1. React 的并发渲染（Concurrent Mode）：将 Diff 过程拆分为可中断的小任务，避免阻塞主线程（时间切片）。
   2. Vue 3 的编译时优化：静态提升（Hoist Static）：将静态节点编译为常量，避免重复创建。Patch Flags：在编译时标记动态节点类型，减少运行时 Diff 成本。
   3. 替代方案的出现：Svelte：编译时直接生成 DOM 操作代码，无需虚拟 DOM。SolidJS：通过细粒度响应式更新，跳过虚拟 DOM。

## Concurrent Mode

Concurrent Mode（并发模式） 是 React 推出的一种全新渲染模式，旨在提升大型复杂应用的响应速度和用户体验。它让 React 能够将渲染工作拆分成多个小任务，并根据优先级灵活地“暂停”、“中断”、“恢复”或“放弃”某些渲染任务，从而实现更流畅的界面更新。简单来说：并发模式让 React 不再“一口气做完所有事”，而是像操作系统调度任务一样，把渲染变得可中断、可分片，响应更及时。

传统同步模式的问题：

- React 默认是同步渲染：一旦开始更新，就会一直执行完所有计算和 DOM 更新，期间主线程被占用。
- 如果组件树庞大或有大量数据计算，页面就会卡顿甚至假死（如“白屏”）。
- 用户交互（如点击、输入）可能延迟响应。

并发模式的优势：

- 可中断：React 可以暂停当前渲染，优先处理用户交互等高优先级任务。
- 任务分片：长时间的渲染可以被切割成多段，逐步完成，避免主线程被长时间占用。
- 优先级调度：不同类型的更新有不同优先级，比如输入框输入比动画重要。
- 更流畅体验：实现“随时可响应”的 UI。

整个渲染过程分为两个阶段：render 阶段（调和/Reconciliation） 和 commit 阶段（提交）：

- render 阶段会生成 fiber 树（虚拟 DOM 树），这个阶段可以被中断（在并发模式下）。
- commit 阶段会将变更应用到真实 DOM，这一阶段不可中断。commit 阶段只有在整个 fiber 树调和完毕后才会进行。

Concurrent Mode 的底层依赖于 Fiber 架构：

- Fiber 节点表示每个组件单元，每次只处理一小部分 Fiber 树，可以随时暂停。
- 利用浏览器空闲时间（如 requestIdleCallback 或 Scheduler），在主线程空闲时继续未完成的任务。
- 支持异步渲染、优先级调度和批量更新。

主要特性：

1. 可中断/恢复/放弃渲染
   - 渲染过程中可以被打断，然后稍后恢复。
   - 如果出现新的高优任务，可以放弃当前低优先级渲染。
2. 自动批量更新：多个 setState 会自动合并为一次批量更新，提高性能。
3. Suspense 支持：Concurrent Mode 下 Suspense 更强大，可以等待异步数据加载。
4. startTransition API：可以手动标记哪些 setState 是低优先级（比如搜索过滤列表）。
5. useDeferredValue/useTransition Hooks：用于处理高低优先级状态分离，实现流畅体验。

实际应用场景举例：

1. 大型表格/列表滚动优化：渲染超大数据量时不会卡死页面，可随时响应用户滚动。
2. 输入框实时搜索：输入时立刻响应，但数据过滤属于低优先级，可以延后处理，不影响输入流畅性。
3. 图片懒加载/骨架屏：使用 Suspense 实现图片或内容加载中的占位效果。

### 如何开启并发模式

1. React 18：Concurrent Mode 已经集成到 createRoot API，无需特殊标签。
2. React 16.8/17 的 Concurrent Mode 是实验性质，需要引入实验版包，并用 `<ConcurrentMode>` 包裹根组件。
3. 老的 `ReactDOM.render` 不支持 concurrent。

```js
// react18
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

const root = createRoot(document.getElementById("root"));
root.render(<App />);

// react16.8/17
import React, { unstable_ConcurrentMode as ConcurrentMode } from "react";
import ReactDOM from "react-dom";
import App from "./App";

ReactDOM.render(
  <ConcurrentMode>
    <App />
  </ConcurrentMode>,
  document.getElementById("root")
);
```

## 有效括号匹配

栈，先入栈左侧，遇到右侧就从栈顶 pop 一个出来，如果不匹配就 false，否则继续 push 入栈，最后看栈是否清空。

## 判断 b 是否是 a 的子集

ab 有重复元素，要求 b 中相同元素出现的次数<=a 中的。假设 a、b 是数组。

1. 分别统计 a 和 b 中每个元素的出现次数（使用字典或哈希表）。检查 b 的所有元素是否都存在于 a 中，且 b 中每个元素的计数 ≤ a 中的计数。
2. 排序 a 和 b。使用双指针遍历 a 和 b，确保 b 的所有元素都能在 a 中找到，且 b 中相同元素的出现次数 ≤ a 中的出现次数。
3. 遍历 b 的每个元素。在 a 中查找该元素，并移除匹配的元素（避免重复计数）。如果 b 的某个元素不在 a 中，或 a 中该元素的剩余数量不足，返回 False。

```js
function isSubSet(a, b) {
  if (b?.length === 0) return true;
  if (a.length < b.length) return false;

  const count = {};
  for (const num of a) {
    count[num] = (count[num] || 0) + 1;
  }
  for (const num of b) {
    if (!count[num]) return false;
    count[num]--;
  }
  return true;
}

function isSubSet(a, b) {
  if (b?.length === 0) return true;
  if (a.length < b.length) return false;

  const sup = [...a].sort(); // 复制数组
  const sub = [...b].sort();
  let i = 0,
    j = 0;
  while (i < sup.length && j < sub.length) {
    if (sup[i] === sub[j]) {
      i++;
      j++;
    } else if (sup[i] < sub[j]) {
      i++;
    } else {
      return false;
    }
  }
  return j === sub.length; // 是否遍历完 b
}
```

## 302 怎么确定重定向路径

302 Found 状态码表示临时重定向，客户端需要根据响应头中的 Location 字段确定重定向路径。当服务器返回 302 状态码时，必须包含 Location 头部，指明重定向的目标 URL。客户端（浏览器或 HTTP 客户端库）会自动跳转到 Location 指定的 URL。如果服务器返回 302 但未提供 Location，客户端行为可能不一致（部分浏览器会报错）。Location 是相对路径时，相对于当前请求的域名。返回绝对路径的时候，则直接跳转。

1. 浏览器会自动处理 302 跳转，用户无感知（地址栏会更新为目标 URL）。
2. 命令行工具（cURL）：`curl -v https://old-url.com`
3. 使用 fetch 或 axios 等库时，默认会跟随重定向，需显式禁用以获取 302 响应：

```js
// 使用 fetch（禁止自动重定向）
fetch("https://old-url.com", {
  redirect: "manual", // 不自动跳转
}).then((response) => {
  if (response.status === 302) {
    const redirectUrl = response.headers.get("Location");
    console.log("重定向路径:", redirectUrl);
  }
});

// 使用 axios（需拦截响应）
axios
  .get("https://old-url.com", {
    maxRedirects: 0, // 禁止自动重定向
  })
  .catch((error) => {
    if (error.response.status === 302) {
      const redirectUrl = error.response.headers.location;
      console.log("重定向路径:", redirectUrl);
    }
  });
```

4. 302：临时重定向，搜索引擎不会更新索引。301：永久重定向，搜索引擎会将权重转移到新 URL。
5. 避免循环重定向（如 A → B → A），浏览器通常限制最大跳转次数（如 Chrome 限制 20 次）。

```bash
server {
    listen 80;
    server_name old-site.com;
    return 302 https://new-site.com$request_uri;
}
```

## 几种 worker 的对比

| 特性     | Web Worker                       | Service Worker         | Shared Worker                                                        |
| -------- | -------------------------------- | ---------------------- | -------------------------------------------------------------------- |
| 目的     | 处理后台任务，专注于防止 UI 阻塞 | 控制网络请求和离线功能 | 共享状态或数据，提供一个共享的上下文以便多个浏览器上下文之间的通信。 |
| 访问 DOM | 不可访问                         | 不可访问               | 不可访问                                                             |
| 共享性   | 不共享                           | 不共享                 | 共享多个上下文                                                       |
| 生命周期 | 由调用者管理                     | 有独立生命周期         | 由调用者管理                                                         |
| 通信方式 | postMessage                      | 事件驱动               | MessagePort                                                          |
| 使用场景 | CPU 密集型处理                   | 离线缓存、推送通知     | 多窗口/标签页共享数据                                                |

## 全排列

回溯算法模板，一种方式是递归，循环遍历各个数字字符，先存到 path 中，然后递归剩下的数字字符，递归结束后 pop 恢复现场，继续循环。终止条件是`path.length===nums.length`。

```js
function permute(nums) {
  if (nums?.length < 2) return nums;
  const res = [];
  function backtrack(start) {
    if (start === nums.length) {
      res.push(nums.slice());
      return;
    }

    for (let i = start; i < nums.length; i++) {
      [nums[i], nums[start]] = [nums[start], nums[i]];
      backtrack(start + 1);
      [nums[i], nums[start]] = [nums[start], nums[i]];
    }
  }

  backtrack(0);
  return res;
}
```

## 前端路由原理

1. hashchange 事件：hash 路由
2. popstate 事件：history 路由
3. history.pushState()
4. history.replaceState()

## Vue 动态加载组件

1. 使用异步组件：异步组件允许在需要时动态加载 Vue 组件，通常结合 import() 语法来实现。这样可以将组件分割到不同的文件中，只有在需要时才加载。动态的引入组件。配合`<component :is="currentComponent"></component>`实现。
2. 使用动态组件：Vue 提供了一种 component 组件，可以根据绑定的值动态切换组件，这对于动态加载组件也十分有用。提前注册组件，动态设置组件名。配合`<component :is="currentComponent"></component>`实现。
3. 使用 Vue Router 的路由懒加载：如果你使用 Vue Router 管理路由，也可以通过路由懒加载实现组件的动态加载。也是通过 import()动态引入组件。
4. 结合 Vuex 进行动态管理：如果需要根据某些条件从状态管理中动态加载组件，可以结合 Vuex 实现。在 commit 时动态 import 引入所需组件。
5. 插槽，传入要展示的组件，配合`<component :is="currentComponent"></component>`实现。
6. 频繁切换时借助 keep-alive 组件进行缓存

### is 的实现原理是什么？

`<component :is="currentComponent"></component>`

## Hash 路由与 History 路由的对比

| 特性       | Hash 路由                      | History 路由                                    |
| ---------- | ------------------------------ | ----------------------------------------------- |
| URL 格式   | http://example.com/#/page1     | http://example.com/page1                        |
| 兼容性     | 所有浏览器，包括旧版浏览器     | 现代浏览器，旧版浏览器可能不支持                |
| SEO 友好   | 不友好                         | 友好                                            |
| 用户体验   | URL 中有 # 符号，视觉上不美观  | 更干净的 URL，没有哈希符号                      |
| 刷新行为   | 刷新时会根据哈希重新渲染内容   | 刷新时需要服务器支持来处理 URL                  |
| 实现复杂性 | 实现简单，使用 hashchange 事件 | 需要管理历史记录、状态等                        |
| 原理       | hashchange 事件                | history.pushState/replaceState 和 popstate 事件 |

## history 路由的 Nginx 配置

假设你的应用构建后的文件存放在 `/usr/share/nginx/html` 目录中，并且你的 index.html 文件位于该目录下。可以参考以下配置：

```sh
server {
    listen 80;  # 监听端口
    server_name example.com;  # 你的域名或 IP

    location / {
        root /usr/share/nginx/html;  # 应用文件所在目录
        index index.html;  # 默认首页文件

        try_files $uri $uri/ /index.html;  # 尝试请求文件，如果文件不存在则返回 index.html
    }

    # 可选：配置 gzip 压缩
    gzip on;
    gzip_types text/plain application/javascript application/x-javascript text/css application/json;
    gzip_min_length 1000;

    # 可选：配置缓存
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;  # 缓存一年
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    # 可选：错误页面处理
    error_page 404 /index.html;  # 404 错误也返回 index.html
}
```

修改 Nginx 配置后检查并重启。

```bash
sudo nginx -t  # 测试配置是否正确
sudo systemctl reload nginx  # 重新加载 Nginx
```

## v-for 和 v-if 执行优先级

**不推荐在一元素上同时使用这两个指令 **

1. Vue2 中：当同时使用时，v-for 比 v-if 优先级更高。
2. Vue3 中：当同时使用时，v-if 比 v-for 优先级更高。

## 页面白屏检测

## ref 和 reactive 的区别

1. 实现原理
2. 使用方法

## props 数据流向

## 发布订阅模式和观察者模式的区别

## input 怎么确定 schema 结构

## websocket 在建立连接和断开的过程中分别经历了几次握手几次挥手？

### 建立连接

1. WebSocket 握手

- WebSocket 协议本身只需要一次 HTTP 握手，即客户端发起一个特殊的 HTTP 请求（带 Upgrade: websocket 头），服务器响应后升级协议，双方切换到 WebSocket 通信。
- 这个过程叫做“WebSocket 握手”。

2. 底层 TCP 握手

   - 在此之前，底层的 TCP 连接会先建立，这需要 TCP 三次握手。

3. 总结

   - WebSocket 层面：1 次握手（HTTP Upgrade）
   - TCP 层面：3 次握手

### 断开连接

1. WebSocket 挥手

   - WebSocket 协议本身没有专门的“挥手”机制，通常是通过 close 帧通知对方要关闭连接。
   - 客户端或服务端发送 close 帧，对方收到后也发送一个 close 帧作为响应，然后关闭底层 TCP。
   - 实际上这个过程类似于一次“挥手”，但并不是严格意义上的四次挥手。

2. 底层 TCP 挥手

   - 关闭 WebSocket 时，底层还是要走 TCP 四次挥手 来关闭连接。

3. 总结

   - WebSocket 层面：1 次 close 帧交互（可以理解为一次挥手）
   - TCP 层面：4 次挥手

## websocket 数据传输时粘包/拆包怎么处理

WebSocket 作为基于 TCP 的协议，理论上也会遇到“粘包/拆包”问题，但它的设计已经帮你解决了绝大多数场景下的数据边界问题。

- 粘包：多条消息在底层 TCP 层被合并成一块数据发送，接收端一次收到多条消息的数据。
- 拆包：一条完整消息被分成多次发送，接收端每次只收到部分数据，需要拼接还原。

### WebSocket 协议自带消息边界

- WebSocket 协议在应用层就定义了“帧（frame）”的概念，每一条消息都被封装成一个或多个帧。
- 每个帧都有明确的长度字段（payload length），所以无论底层 TCP 怎么分片或合并，WebSocket 实现会自动将数据组装为完整的消息。
- 你拿到的永远是完整的一条消息，不需要自己手动拆分或合并。

### WebSocket 库/浏览器 API 已经处理好

- 浏览器端的 onmessage 回调，收到就是一条完整的信息。
- Node.js、Java、Python 等后端 WebSocket 框架，也都是以“消息”为单位触发回调。

### 特殊情况：业务级粘包/拆包

虽然 WebSocket 协议本身已经解决了数据边界问题，但如果你在一条 WebSocket 消息里自定义了自己的协议格式，并且一次性发送多条业务数据，那么你还是需要在业务层做解析。

## JSON 和 Protobuf 的区别

| 对比项        | JSON                         | Protobuf                             |
| ------------- | ---------------------------- | ------------------------------------ |
| 数据格式      | 文本格式（UTF-8）            | 二进制格式                           |
| 可读性        | 易读易写，人类友好           | 不可读，机器友好                     |
| 序列化效率    | 较低                         | 非常高                               |
| 数据体积      | 较大                         | 非常小                               |
| 类型支持      | 动态类型，不支持严格类型检查 | 静态类型，支持严格类型检查           |
| 向前/向后兼容 | 差（字段变更易出错）         | 好，支持字段编号和默认值             |
| 跨语言支持    | 很好，几乎所有主流语言都支持 | 很好，但需先生成对应语言的代码       |
| Schema 定义   | 无 schema，可任意扩展        | 有 schema（.proto），强约束          |
| 扩展性        | 灵活，但不安全               | 支持添加新字段且兼容老版本           |
| 应用场景      | 配置文件、人机交互、Web API  | 微服务间通信、大数据传输、高性能场景 |

## nodejs 内存泄漏怎么解决

Node.js 内存泄漏是指程序在执行过程中不再使用的内存没有被及时释放，导致内存的逐渐增加，这可能会导致应用程序性能下降甚至崩溃。解决内存泄漏的问题需要从多个方面着手。

1. 常见的内存泄漏原因
   - 全局变量：意外地将变量声明为全局变量，导致其在整个应用生命周期中保持活跃。
   - 事件监听器：未注销的事件监听器会导致内存泄漏。
   - 闭包：闭包中引用了外部变量，但这些外部变量不再需要，从而无法被垃圾回收。
   - 长时间运行的定时器：使用 setInterval 或 setTimeout 却没有在适当的时候清除它们。
   - 缓存的引用：在数据缓存中存储大量对象，但没有适时清除。
2. 解决内存泄漏的方法
   - 使用堆分析工具：Node.js 内置的 V8 堆快照：可以使用 Chrome DevTools 的远程调试功能来分析 Node.js 应用的内存使用情况。Heapdump：可以在应用运行时生成堆快照，便于后续分析。在 Chrome DevTools 中打开该堆快照文件进行分析。
   - 定期清理不再使用的对象：确保及时清理不再使用的对象和数据。例如，使用 WeakMap 和 WeakSet 来创建不会阻止垃圾回收的引用。
   - 取消事件监听器：在不再需要时，及时取消事件监听器，特别是在使用 EventEmitter 时
   - 清理定时器和异步任务：确保使用 clearTimeout 和 clearInterval 清理不再需要的定时器。
   - 避免使用全局变量：尽量减少全局变量的使用，避免不必要的全局引用。可以使用模块导出和封装方法来管理应用状态。
   - 使用内存监控工具：PM2：一个进程管理工具，提供内存监控功能。Node Clinic：用于性能分析的工具，可以帮助识别内存泄漏。

## 多窗口之间怎么通信

参考[页面间通信](../JavaScript/FrontEnd2.md)

## 捕获和冒泡事件触发顺序

- 捕获阶段：事件从外层元素传播到目标元素。
- 目标阶段：目标元素的事件处理程序被调用。
- 冒泡阶段：事件从目标元素向外层元素传播。

默认情况下，addEventListener 的第三个参数为 false，表示使用冒泡阶段。如果将其设置为 true，则事件将在捕获阶段被处理。

1. 捕获阶段：当触发事件时，首先会从根节点向目标节点进行捕获。如果元素注册了在捕获阶段的事件处理器，则会依次触发的事件。
2. 目标阶段：事件到达目标节点，如果有相关的事件处理器，它们会被调用。
3. 冒泡阶段：当事件从目标节点向根节点冒泡时，各个元素注册在冒泡阶段的事件处理器会被调用。

## 数据大屏怎么实现响应式

1. 使用响应式框架：Bootstrap：提供了强大的栅格系统和组件，适合快速开发响应式布局。Tailwind CSS：采用实用程序优先的 CSS 方法，可以轻松创建响应式设计。Ant Design 或 Material UI：这两者都是基于 React 的 UI 组件库，具有响应式设计的理念。
2. 媒体查询：通过 CSS 媒体查询，可以为不同的屏幕尺寸应用不同的样式。
3. 使用 Flexbox 或 CSS Grid 布局可以更灵活地创建响应式设计。
4. 响应式图表：如果数据大屏中包含图表，确保使用支持响应式的图表库：Chart.js：可以自动适应容器大小。ECharts：提供了良好的响应式支持，可以通过配置自动调整图表大小。AntV：企业级数据可视化解决方案。
5. 动态调整布局：可以使用 JavaScript 监听窗口大小变化，动态调整布局，监听 resize 事件，做相应处理。

## 浏览器访问 url 过程

硬件加速方案，优缺点；DNS 解析过程、预解析、耗时指标

## 单点登录和 SSO 鉴权

授权协议

## nodejs 是单线程吗？怎么提高并发量

1. Node.js 是基于事件驱动的非阻塞 I/O 模型，虽然它本身是单线程的，但可以通过一些方式提高并发量和性能。
2. 单线程：Node.js 的主事件循环运行在单个线程上，所有 I/O 操作（如文件读取、网络请求等）都是异步的，使用事件和回调来处理。
3. 事件循环：Node.js 的事件循环机制能够处理大量的连接请求，而不需要为每个请求创建一个线程。它使用事件和回调机制来处理请求，使得在等待 I/O 的同时可以处理其他任务。

提高 Node.js 并发量的方法：

1. 使用 Cluster 模块：Node.js 的 Cluster 模块可以创建多个工作进程，每个进程都有自己的事件循环和内存空间。这允许你充分利用多核 CPU 的优势。

```js
// 主进程会为每个 CPU 核心创建一个工作进程，能够同时处理多个请求。
const cluster = require("cluster");
const http = require("http");
const numCPUs = require("os").cpus().length;

if (cluster.isMaster) {
  // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died`);
  });
} else {
  // Workers can share any TCP connection
  http
    .createServer((req, res) => {
      res.writeHead(200);
      res.end("Hello World\n");
    })
    .listen(8000);
}
```

2. 使用负载均衡器：在生产环境中，可以使用负载均衡器（如 NGINX 或 HAProxy）将请求分发到多个 Node.js 实例。这种方式能够进一步提高并发处理能力。
3. 异步 I/O 优化：确保使用 Node.js 提供的异步 API 来处理 I/O 操作，避免使用阻塞的代码。使用异步操作可以使事件循环继续处理其他请求。
4. 使用 Redis 进行消息队列：在某些情况下，使用 Redis 等消息队列来处理长时间运行的任务可以提高并发能力。通过将任务放入队列，可以让 Node.js 继续处理其他请求，而后台 worker 处理这些耗时任务。
5. 连接池：对于数据库等外部服务，使用连接池可以减少连接的创建和销毁的开销，提高并发性能。确保数据库连接的管理是高效的。
6. 使用 WebSocket 和长轮询：对于需要处理大量实时数据的应用，可以使用 WebSocket 或长轮询实现高效的实时通信，这样能够更好地处理高并发请求。
7. 性能监控与调优：使用性能监控工具（如 PM2、New Relic、DataDog 等）来监控应用性能，识别瓶颈并进行优化。

## 前端监控告警体系

性能监控的指标有哪些？页面加载的瓶颈和优化手段

## 在哪些情况下一个元素绑定的点击事件不会被触发？

1. 元素不可见或被遮挡：
   - CSS 隐藏：如果元素的 display 属性被设置为 none，则该元素不会在页面上展示，点击事件自然不会被触发。也不会被触发。
     ~~- 透明度：如果元素的 opacity 属性为 0，它仍然可以占据空间，虽然用户无法看到它，但仍会触发点击事件。~~
   - visibility：如果元素的 visibility 属性被设置为 hidden，它仍然占据空间，但用户无法看到它，点击事件自然不会被触发。
   - 脱离文档流：元素如果不在文档流中，且被其他元素遮挡（如使用 z-index 进行层叠），则无法点击该元素。
2. 事件被阻止
   - `event.preventDefault()`：如果在事件处理程序中调用了 `event.preventDefault()`，某些默认行为（如链接跳转）将被阻止，但这不会影响点击事件本身的触发。
   - `event.stopPropagation()`：如果在事件处理程序中调用了 `event.stopPropagation()`，那么事件可能不会向上传递，特别是在嵌套元素中，但这并不会阻止事件本身的触发。
3. 元素处于失去焦点状态
   - 表单元素：如果某些表单元素（如 button 或 input）在失去焦点时可能不响应点击事件，尤其是在某些浏览器中。
4. 错误的事件绑定
   - 使用了错误的选择器。
   - 在 DOM 元素未加载时绑定事件（如在 DOMContentLoaded 之前）。
5. 元素被禁用
   - disabled 属性：如果元素是一个表单控件（例如 `<button>` 或 `<input>`）并且设置了 disabled 属性，点击事件将不会被触发。
6. JavaScript 错误：在事件处理程序中，如果出现 JavaScript 错误，可能会导致后续代码（包括绑定的事件）不被执行。
7. 使用了 pointer-events CSS 属性：如果元素的 `pointer-events` CSS 属性被设置为 none，则该元素将不会响应任何鼠标事件，包括点击。
8. 移动设备的特殊情况：在某些移动设备上，可能只会响应触摸事件（如 touchstart 或 touchend），如果只写了 click 事件，可能会影响点击事件的触发。
9. 使用了框架或库中的事件处理机制：在使用某些 JavaScript 框架（如 React、Vue.js 等）时，事件的管理可能与原生 JavaScript 不同，需遵循框架的事件处理方式。
10. 动态内容
    - 内容动态生成：如果点击事件绑定在动态生成的元素上，确保在元素渲染后绑定事件或使用事件委托模式。
11. 事件委托问题
    - 未在父元素上绑定：如果使用事件委托，但父元素未绑定相应事件，子元素的点击事件将不会被触发。

## Vue3 系列

### 静态图片动态加载

Vite 打包时会自动进行依赖分析，导致有些图片会直接打包到静态资源中，而其他图片则需要通过动态导入的方式加载，因此需要使用动态导入的方式加载静态图片。

1. 通过标签引入静态图片：img、video、audio 等标签的 src 属性，通过动态导入的方式加载静态图片。
2. 通过 CSS 引入静态图片：在 CSS 文件中通过 background-image 属性引入静态图片。
3. 把图片放到 public 目录下，通过相对路径引入。打包时会自动将图片复制到 dist 目录下，但会丢失图片的 hash 值。
4. 通过`import('./assets/${img}.jpg').then(p=>path=p.default)`函数引入静态图片，通过 then()方法获取图片的 URL。但会产生很多 js 文件。而且要 path 中不能完全是变量，否则会导致路径解析错误。
5. 通过`new URL('./assets/${img}.jpg', import.meta.url)`，然后使用 url 对象来赋值。

### Vue3 setup 中如何获得组件实例

1. Vue3 的 setup 函数是在组件创建之前执行的，这时候组件实例还没有完全生成，所以在 setup 函数内部直接使用 this 是无效的，因为 this 指向的是 undefined 或者不是组件实例。使用 getCurrentInstance 函数，这是 Vue3 提供的一个 API，用于获取当前组件的实例。但是需要注意，getCurrentInstance 返回的是一个内部实例，并不是公共 API 的一部分，因此在使用时需要谨慎，避免依赖内部实现细节。-- 不推荐

```js
setup() {
  const instance = getCurrentInstance();
  // 通过 instance 访问组件上下文
  console.log(instance.proxy); // 等效于 Vue2 的 this
  console.log(instance.ctx);    // 上下文对象
  console.log(instance.parent); // 父组件实例
  console.log(instance.refs);   // 模板中的 ref 引用
  return {
    instance
  }
}
```

2. 如果需要获取组件实例，可以使用 ref 来获取。在 setup 函数中，使用 ref 来获取组件实例或者获取 DOM 元素，使用 ref 函数来创建一个响应式引用，然后在模板中绑定这个 ref，从而在 setup 函数中访问到对应的 DOM 元素或组件实例，然后就可以在模板中使用。在 onMounted 后使用确保组件已挂载。-- 推荐

## Vue 的 watch 有哪些配置项？和 computed 的区别？和 watchEffect 的区别？

1. Vue 的 watch 有哪些配置项？

   - immediate：当监听的值第一次被赋值时，会立即执行回调函数。
   - handler：当监听的值发生变化时，会执行的回调函数。接收 newval 和 oldval。
   - deep：当监听的对象是嵌套对象时，设置为 true 可以监听对象内部属性的变化。
   - flush：控制回调函数的执行时机，可选值为 'pre'、'post'、'sync'。

     - 默认值为 'pre'，即在微任务队列清空后执行。即 prop 更新完之后触发回调函数再更新 DOM（此时回调函数里不能通过 DOM 获取到更新后的 prop 的值）。
     - 设置为 'post' 会在宏任务队列清空后执行。则更新完 prop 之后再更新 DOM 然后再触发回调函数（此时回调函数里就能通过 DOM 获取到更新后的 prop 的值）。`watchPostEffect`
     - 设置为 'sync' 会在当前任务执行完毕后立即执行。则回调函数会同步执行，也就是在响应式数据发生变化时立即执行，会在 Vue 进行任何更新之前触发。`watchSyncEffect`，同步侦听器不会进行批处理，每当检测到响应式数据发生变化时就会触发。可以使用它来监视简单的布尔值，但应避免在可能多次同步修改的数据源 (如数组) 上使用。

   - onTrack / onTrigger：调试侦听器的依赖。
   - once：默认为 false，回调函数只会运行一次。侦听器将在回调函数首次运行后自动停止。

2. Vue 的 watch 和 computed 和 method 的区别

   - 计算属性 computed 在第一次计算完成后，会对结果进行缓存，后续再次调用时直接输出结果而不会重新计算。仅当依赖变化时再重新计算并缓存，计算量较大时使用计算属性会更高效。频繁使用时使用计算属性会更高效。
   - method 调用几次就会执行几遍，不会缓存结果，每次都会重新计算。
   - watch 用于监听数据的变化，当数据变化时，会执行回调函数，回调函数接收新值和旧值。

3. Vue 的 watch 和 watchEffect 的区别

   - watchEffect 直接接收一个回调函数，会自动追踪函数内部使用到的响应式数据变化，数据变化时重新执行该函数
   - watchEffect 的函数会立即执行一次，并在依赖的数据变化时再次执行
   - watchEffect 更适合简单的场景，不需要额外的配置，相当于默认开启了 deep 和 immediate 的 watch
   - watchEffect 也能接收第二个参数，用来配置 flush 和 onTrack / onTrigger，拿不到旧值
   - watch 显示的接收一个需要被监听的数据和回调函数，若监听的数据发生变化，重新执行该函数
   - watch 的回调函数只有在侦听的数据源发生变化时才会执行，不会立即执行
   - watch 可以更精细的控制监听行为，如 deep、immediate、flush 等，可以终止监听，可以拿到旧值
   - watch 第一个参数可以是一个数组，监听多个数据源，也可以是一个对象，对象中的 key 为数据源，value 为回调函数，还可以是一个函数（最终都会转成函数），如果这个函数返回的值不变，则回调函数也不会执行，即使在函数中依赖的响应式数据发生了变化。
   - 一个关键点是，侦听器必须用同步语句创建：如果用异步回调（比如 setTimeout）创建一个侦听器，那么它不会绑定到当前组件上，你必须手动停止它，以防内存泄漏。

   - 总结：它们之间的主要区别是追踪响应式依赖的方式：

     1. watch 只追踪明确侦听的数据源。它不会追踪任何在回调中访问到的东西。另外，仅在数据源确实改变时才会触发回调。watch 会避免在发生副作用时追踪依赖，因此，我们能更加精确地控制回调函数的触发时机。

     2. watchEffect，则会在副作用发生期间追踪依赖。它会在同步执行过程中，自动追踪所有能访问到的响应式属性。这更方便，而且代码往往更简洁，但有时其响应性依赖关系会不那么明确。

## Vue3 中的宏有哪些？

- defineProps: 声明 props
- defineEmits: 声明 emit
- defineModel: 用来声明一个双向绑定 prop
- defineExpose: 指定对外暴露组件的属性
- defineOptions：在 script setup 中提供组组件属性
- defineSlots： 声明 slots

## Vue3 声明一个响应式数据的方式？

- ref: 通过.value 访问及修改
- reactive: 直接访问、只能声明引用数据类型
- computed: 也是通过.value，声明需要 传 get、set
- toRef: 类似 ref 的用法，可以把响应式数据的属性变成 ref
- toRefs: 可以把响应式数据所有属性 转成一个个 ref
- shallRef: 浅层的 ref,第二层就不会触发响应式
- shallReactive: 浅层的 reactive,第二层就不会触发响应式
- customRef: 自定义 ref

## v-memo

缓存一个模板的子树。在元素和组件上都可以使用。为了实现缓存，该指令需要传入一个固定长度的依赖值数组进行比较。如果数组里的每个值都与最后一次的渲染相同，那么整个子树的更新将被跳过。仅用于性能至上场景中的微小优化，有助于渲染海量 v-for 列表 (长度超过 1000 的情况)。

一般与 v-for 配合使用，v-memo 的值是一个数组。当组件重新渲染，如果数组的值不改变的情况，该组件及子组件所有更新都将被跳过，只要 v-memo 绑定的数组的值没改变，即使子组件引用的响应数据变了，也不会更新。甚至虚拟 DOM 的 vnode 创建也将被跳过。直接重用缓存的子树副本。

## computed 的 getter 和 setter

1. getter：计算属性的 getter 是一个函数，当访问计算属性时，会执行这个 getter 函数，返回计算属性的值。
2. setter：计算属性的 setter 是一个函数，当修改计算属性的值时，会执行这个 setter 函数，传入新值和旧值。可以在这里修改计算属性的值，也可以在这里执行一些副作用操作。也就是说可以在 method 中直接对计算属性赋新值，就像处理普通的 data 一样，然后在 setter 中对新值进行处理。
3. 计算属性的 getter 和 setter 可以用来实现双向数据绑定，即当计算属性的值发生变化时，会自动更新依赖该计算属性的其他数据；当依赖该计算属性的其他数据发生变化时，会自动更新计算属性的值。

## provide 和 inject

1. provide 和 inject 是 Vue 中的两个 API，用于实现组件间的数据传递和依赖注入。
2. provide 是一个 provide 方法，用于提供当前组件的属性和方法，供其他组件使用。`provide('message', message);`或在应用顶层`app.provide(/* 注入名 */ 'message', /* 值 */ 'hello!')`
3. inject 是一个 inject 方法，用于注入当前组件的属性和方法，供其他组件使用。在组件中`const message = inject('message'[, defaultValue, true]);`，第二个参数表示默认值，可以是一个具体的值也可以是个函数，第三个参数表示默认值应该被当作一个工厂函数。在一些场景中，默认值可能需要通过调用一个函数或初始化一个类来取得。为了避免在用不到默认值的情况下进行不必要的计算或产生副作用，我们可以使用工厂函数来创建默认值
4. provide 和 inject 的作用是让组件之间可以相互传递数据，而不需要通过父组件传递到子组件，再由子组件传递到孙组件，这样会增加组件的层级，导致组件嵌套过深，维护起来非常麻烦。
5. provide 注入的值可以是任意类型，包括响应式的状态，比如一个 ref，那么此时 inject 接收到的会是该 ref 对象，而不会自动解包为其内部的值。这使得注入方组件能够通过 ref 对象保持了和供给方的响应性链接。这表明：provide+inject 注入的值可能是响应式的也可能是非响应式的。
6. 使用时，如果没有使用 `<script setup>`，`provide()/inject()` 都需要在 `setup()` 内同步调用。
7. 当提供 / 注入响应式的数据时，建议尽可能将任何对响应式状态的变更都保持在供给方组件中。这样可以确保所提供状态的声明和变更操作都内聚在同一个组件内，使其更容易维护。
8. 如果你想确保提供的数据不能被注入方的组件更改，你可以使用 `readonly()` 来包装提供的值。`provide('read-only-count', readonly(count))`。

## 对象的动态属性和静态属性

## 实现页面自动检测页面是否更新

1. 轮询
2. websocket
3. SSE
4. 可以约定设置一个特定的 js 文件放在 head 中，js 文件要打上指纹（hash）以便于对比版本，然后前端通过轮询的方式去请求这个 js 文件，如果文件的指纹发生变化，说明文件有更新，前端就可以重新加载这个 js 文件，从而实现页面的自动检测更新。

## forEach 原理

forEach 在循环开始之前，会先获取数组的初始长度并存下来，所以即使在 forEach 循环中增加数组的长度，循环的次数也不会受影响。但是如果减少了数组的长度，由于在取值时会判断当前属性是否存在于数组中（`if(k in o)...`），所以循环次数也会减少。不能通过 return、break、continue 来中断循环。

```js
Array.prototype.myForEach = function (callback, thisArg) {
  if (this === null || this === undefined) {
    throw new TypeError("Array.prototype.myForEach called on null or undefined");
  }
  let obj = this;
  let len = obj.length;
  if (typeof callback !== "function") {
    throw new TypeError("callback不是函数");
  }
  for (let i = 0; i < len; i++) {
    if (i in obj) {
      let val = obj[i];
      callback.call(thisArg, val, i, obj);
    }
  }
  return undefined;
};
```

## Promise

1. Promise 中的内部发生的错误在 try/catch 中无法捕获，需要在 Promise 的 catch 中捕获，或者需要 async/await 和 try/catch 配合使用才能捕获错误。或者通过 then 方法的第二个参数处理，且第二个参数处理之后，后续的 catch 就不会再捕获到错误，如果有 return，则后续 then 正常执行。
2. new Promise 时传入的函数中，如果先 resolve()然后又 reject()，则前者会生效，后者不生效。反之亦然。
3. try/catch 捕获的是 try 中报的错或者 throw 的 Error，并且如果在 Promise 的构造函数中 throw Error，则先捕获 Error，后捕获内部 error。

## async、await 的原理和优势

1. async/await 是基于 Promise 的语法糖，可以简化异步代码的编写，使得异步代码看起来更像同步代码。
2. async 用于声明一个异步函数，await 用于等待一个异步方法执行完成。在浏览器控制台环境中，目前这俩关键字是可以分开单独使用的。
3. 在普通函数前面加上 async 之后，这个函数会**返回一个 Promise 对象**，如果函数中本身就有 return 的内容，那么就相当于返回一个已经解决的 Promise 对象，如果函数中抛出错误，那么就相当于返回一个被拒绝的 Promise 对象。例：`return Promise.resolve(xxx)`，在后续处理的时候就需要在 then 中接收 resolve 的值，如果函数中抛出错误，那么就相当于返回一个被拒绝的 Promise 对象，需要在 catch 中接收 reject 的值。如果函数中本身没有 return 的内容，那么相当于`return Promise.resolve(undefined);`
4. 如果 resolved 成功了，则 await 可以接收到返回的值，如果是 rejected 失败了，则会抛出错误，需要在 catch 中捕获。

### 优势

1. 用同步代码的方式编码，简化异步编程的代码逻辑，消除回调地狱和层层嵌套判断等
2. 处理同步异步错误更加方便，便于 debug 定位错误的位置，如果使用 then 链式调用，就不容易发现是哪个 then 里面报的错，除非每个 then 后面都加一个 catch 单独处理，否则单凭 try/catch 很难直接捕获发生在 Promise 内部的错误。

## 生成器函数和迭代器对象

执行生成器函数可以获得一个迭代器对象。

### 生成器

即 Generator 函数： 用`function*`定义函数，可以暂停执行并保存其状态，然后在需要时恢复执行，生成器函数内部使用`yield`语句来产值，暂停执行并返回一个迭代器对象（值是 yield 后面的值）给调用者，通过迭代器对象的 next 方法可以控制生成器函数的执行。

```js
// 生成器函数
function* generatorDemo(){
  yield 1;
  yield 2;
  yield 3;
}
// 迭代器对象
// 调用生成器函数，返回迭代器对象
const iterator = generatorDemo();

console.log(iterator.next()); // {value: 1, done: false}
console.log(iterator.next()); // {value: 2, done: false}
console.log(iterator.next()); // {value: 3, done: false}
console.log(iterator.next()); // {value: undefined, done: true}

// 模拟异步函数
function* getUserInfo(){
  console.log("start getUserInfo");
  yield new Promise((resolve, reject) => {
    console.log("before setTimeout");
    setTimeout(() => {
      console.log("before resolve");
      resolve({id:1, name: "test"});
      console.log("after resolve");
    }, 3000)
    console.log("after setTimeout");
  });
  console.log("after yield");
}

console.log("start---");

let it = getUserInfo();

it.next().value.then(param=>console.log("get info ==> ", param));

console.log("finished");
// 输出如下：
start---
start getUserInfo
before setTimeout
after setTimeout
finished
// 过3秒之后再打印如下：
before resolve
after resolve
get info ==>  {id: 1, name: 'test'}
```

### 迭代器

是一种对象，提供了一种按顺序访问集合元素的方法。有两个核心方法：next()和 return()。next()方法返回一个包含 value 和 done 属性的对象，done 表示迭代是否完成，value 表示当前迭代的值。return()方法用于提前终止迭代。

## 异步编程的实现方式有哪些

1. 回调函数
2. Promise
3. async/await
4. 生成器函数和迭代器对象
5. 事件监听
6. 发布/订阅模式

## 惰性函数

1. 惰性函数（Lazy Function）是一种在程序中仅在需要时才执行的函数。这意味着该函数不会立即执行，而是返回一个值（通常是一个函数或一个计算结果）的引用，直到需要这个值时才进行计算。惰性函数的主要目的是优化性能，避免不必要的计算，特别是在处理大型数据集或复杂计算时。
2. 用于只需要执行一次的地方，后续可以直接用缓存结果或者初次执行完之后就修改这个函数。（跟上面不是同一个东西）

```js
// 定义一个惰性函数
function lazyValue(x) {
  return function () {
    console.log("计算中...");
    return x * 2; // 计算值
  };
}

// 使用惰性函数
const getValue = lazyValue(10);

// 此时并没有进行计算
console.log("函数已创建，但未计算值。");

// 现在需要计算值时，调用返回的函数
const result = getValue(); // 输出 '计算中...'，然后返回计算结果
console.log("计算结果:", result); // 输出: 计算结果: 20
```

## 箭头函数

0. js 中的作用域包括：全局作用域、函数作用域、块级作用域。
1. 箭头函数的作用域是在定义时确定的，基于词法作用域，不会捕获外部的 this 值，而是使用定义时的 this 值。这个 this 值在箭头函数内部是固定的，不会因为外部作用域的变化而改变。
2. 箭头函数没有自己的 arguments 对象，它会捕获其所在上下文的 arguments 对象。
3. 箭头函数没有自己的构造函数，不能用作构造函数。可以通过`Reflect.construct(Object, [], arrowFunc)`来判断是不是箭头函数--箭头函数没有 constructor，不能被 new。
4. 判断箭头函数的 this 时，可以观察箭头函数定义的位置以及有没有被函数包裹，如果被函数包裹，那么箭头函数的 this 就是包裹函数的 this，否则就是全局对象（在严格模式下是 undefined）。适用于通过`{name:()=>{...}}`这种对象形式定义的属性函数。
5. 箭头函数不能被用于构造函数，不能使用 new 关键字实例化。
6. 箭头函数不适用于需要使用 this 的场景，如构造函数、事件处理函数、原型链上的方法等。

## 内部方法`[[construct]]`

1. `[[construct]]`是 JS 引擎的一个内部方法，用于创建和初始化对象的实例。不能直接访问，它在 JavaScript 中用于实现构造函数，通过 new 关键字调用创建新对象。
2. 通过`Reflect.construct(Object, [], func)`是否报错，来判断一个函数是否有内部方法`[[construct]]`，如果没有`[[construct]]`则不能通过 new 来创建实例对象。
3. 如果通过 es5 的 function 的形式创建的实例对象的**方法**上有`[[construct]]`，可以继续`new obj.sayName()`来创建对象而不会报错。但是通过 es6 的 class 里面的原型方法上没有`[[construct]]`，不能 new。

```js
// es5
function Person5(name) {
  this.name = name;
}
Person.prototype.sayName = function () {
  console.log(this.name);
};

// es6
class Person6 {
  constructor(name) {
    this.name = name;
  }
  // 原型方法
  sayName() {
    console.log(this.name);
  }
}

let obj5 = new Person5("test5");
let obj6 = new Person6("test6");

// test
console.log(Reflect.construct(Object, [], obj5.sayName)); // 不报错==>true
console.log(Reflect.construct(Object, [], obj6.sayName)); // 报错==>false
```

## `++`

1. `++` 是一个前缀自增运算符，用于将变量的值增加 1，并返回增加后的值。
2. `++` 在数字前面，会先自增再返回增加后的值。
3. `++` 在数字后面，会先返回当前值，然后再自增。

## function 的 length 属性

1. `function` 的 `length` 属性表示函数的参数个数，不包括默认参数和剩余参数。
2. `function` 的 `length` 属性实际指的是函数的第一个有默认值的参数之前(左侧)的参数的个数。例`function(a,b,c=3,d,...rest){}`的参数的 length 就是 2。

## const 和 Object.freeze()

1. `Object.freeze()`只能冻结对象当前层级的属性，如果对象的属性也是一个对象，那么这个对象的属性不会被冻结，可以继续修改。
2. `const`只是内存地址不能改变，如果是对象的话，其属性的值是可以改变的。
3. 在 Vue 中，对于不需要实现响应式的对象或不会影响页面重新渲染的对象等，可以通过`Object.freeze()`冻结这个对象，可以提高性能，后续可以使用`Object.isFrozen()`来判断对象是否被冻结。
4. `Object.freeze()`冻结的对象，直接=赋值得到的新对象也是被冻结的，深拷贝的对象才是未被冻结的。

## 假值与真值

1. 假值：` false、null、undefined、0/-0/0n、NaN、""/''/``（空字符串）、document.all（有条件） `。
2. 除假值外的都是真值。

## Vue2 中的数组操作

1. 由于 `Object.defineProperty` 无法监听数组内容的变化，所以 Vue2 重写了一部分数组的方法来实现响应式：`push/pop/shift/unshift/splice/sort/reverse`，我们在 Vue 的数组中调用这几个方法时实际调用的是 Vue2 重写后的方法，而非原生的方法。另外 Vue2 也提供了`Vue.set(array, index, newValue)`、`Vue.delete()`这个方法来对数组进行操作，能够实现数组数据的响应式渲染。

2. 另外对于数组的操作还可以借助`v-if`的特性来实现页面的重新渲染，在操作数组前先把会影响到的数据对应的 dom 视图设置`v-if=false`，这样 dom 会从页面移除，然后修改数组，操作完后再设置`v-if=true`，这样可以实现 dom 视图的重新渲染。可以同时借助`$nextTick()`进行操作处理。

3. 还可以使用强制渲染：`vm.$forceUpdate()`。这个方法会强制组件重新渲染而不考虑数据是否更新，避开了正常的数据流更新的方法，违反了 Vue 响应式更新的规则，但是可以用于一些特殊场景，比如在某些异步操作中，需要强制组件重新渲染。

## Vue2 和 Vue3 的响应式实现的区别

1. vue2 的响应式是通过 `Object.defineProperty` 方法，劫持对象的 getter 和 setter，在 getter 中收集依赖，在 setter 中触发依赖，但是这种方式存在一些缺点：

- 由于是遍历递归监听属性，当属性过多或嵌套层级过深时会影响性能
- 无法监听对象新增的属性和删除属性，只能监听对象本身存在的属性，所以设计了`$set`和`$delete`
- 如果监听数组的话，无法监听数组元素的增减，只能监听通过下标可以访问到的数组中已有的属性，由于使用 `Object.defineProperty` 遍历监听数组原有元素过于消耗性能，vue 放弃使用 `Object.defineProperty` 监听数组，而采用了重写数组原型方法的方式来监听对数组数据的操作，并用`$set`和`splice` 方法来更新数组，`$set` 和 `splice` 会调用重写后的数组方法。

2. Proxy 对象：

- 用于创建一个对象的代理，主要用于改变对象的某些默认行为，Proxy 可以理解成，在目标对象之前架设一层“拦截”，外界对该对象的访问，都必须先通过这层拦截，因此提供了一种机制，可以对外界的访问进行过滤和改写。

3. 使用 Proxy 可以解决 Vue2 中的哪些问题，总结一下：

- Proxy 是对整个对象的代理，而 Object.defineProperty 只能代理某个属性。
- 对象上新增属性，Proxy 可以监听到，Object.defineProperty 不能。
- 数组新增修改，Proxy 可以监听到，Object.defineProperty 不能。
- 若对象内部属性要全部递归代理，Proxy 可以只在调用的时候递归，而 Object.definePropery 需要一次完成所有递归，Proxy 相对更灵活，提高性能。

## Reflect 的作用和意义

1. 规范语言内部方法的所属对象，不全都堆放在 Object 对象或 Function 等对象的原型上。
2. 修改某些 Object 方法的返回结果，让其变得更合理。
3. 让 Object 操作是命令式的，让他们都变成函数行为。
4. Reflect 对象的方法与 Proxy 对象的方法一一对应，只要是 Proxy 对象的方法，就能在 Reflect 对象上找到对应的方法。这就让 Proxy 对象可以方便地调用对应的 Reflect 方法，完成默认行为，作为修改行为的基础。也就是说，不管 Proxy 怎么修改默认行为，你总可以在 Reflect 上获取默认行为。

## 2025.1.20

### 小鹏

1. vue、react、angular 框架的响应式原理

   - Vue2：通过 Object.defineProperty() 方法对数据进行劫持，当数据发生变化时，会触发 setter 方法，通知依赖的视图更新。
   - Vue3：通过 Proxy 对象代理数据，当数据发生变化时，会触发 Proxy 的 set 方法，通知依赖的视图更新。
   - React：通过 Virtual DOM 和 Diff 算法，当数据发生变化时，会重新渲染 Virtual DOM，然后通过 Diff 算法对比新旧 Virtual DOM，找出差异，最后更新差异部分。
   - Angular：通过 Zone.js 拦截 http、setTimeout、用户交互事件等异步操作，当数据发生变化时，会触发 Angular 的变更检测机制-脏值检查，检测数据变化并更新视图。

2. react 中 hooks 不能放在 if 判断里的原因

   - React 依赖于 Hook 调用顺序来确定每个 Hook 的状态。只要 Hook 的调用顺序在多次渲染之间保持一致，React 就能正确地将内部 state 和对应的 Hook 进行关联。如果 Hooks 的调用顺序在不同的渲染中不一致，React 无法保证为正确的 Hook 分配正确的状态。这会导致状态错位，进而引发难以追踪的错误比如内存泄漏，或者组件的表现与预期不一致。
   - 通过在组件顶层调用 Hooks，React 可以在每次渲染中按照一致的顺序调用它们，确保状态管理和副作用处理的正确性和一致性。以便于对组件的行为进行预测和理解。这种设计模式也促进了代码的可读性和可维护性，React Hooks 是为了简化组件逻辑和提高代码可读性而设计的。
   - 从生命周期的角度来看，Hook 的生命周期与组件的生命周期是紧密相关的。如果将 Hook 放在 if/循环/嵌套函数中，可能会造成 Hook 的生命周期与组件生命周期不一致，也就是说 Hook 的执行依赖于函数组件的调用顺序和调用次数。在 if/循环/嵌套函数 中调用 Hook，可能会导致它们的调用顺序和次数不一致，从而引发一些奇怪的问题，比如状态不稳定、内存泄漏等。
   - 由于 React 的状态更新是异步的，只有当依赖项发生变化时，状态才会被更新。而放在条件或循环中的 Hook，其依赖项可能并不会随着条件的改变而改变，这就可能导致组件无法正确地重新渲染。
   - 使用 Hook 应该遵守两条规则：只在最顶层使用 Hook，不要在循环，条件或嵌套函数中调用 Hook。只在 React 函数中调用 Hook（比如 React 的函数组件或自定义 Hook 中），不要在普通的 JavaScript 函数中调用 Hook。

3. Object.defineProperty 和 Proxy 的区别以及 Proxy 的优势:

   - 前者代理对象上的属性，不能监听数组及对象深度变化，后者代理对象本身，可以深度监听数组对象变化，PS：Proxy 也不能自动递归代理嵌套对象。
   - 兼容性现代浏览器都支持，大部分场景下 Proxy 性能优于 Object.defineProperty，在大规模简单数据的场景下 Proxy 性能可能不如 Object.defineProperty。因为 Proxy 的代理操作会引入一定的性能开销，而 defineProperty 是直接修改对象的属性描述符，开销较小。但是这个性能差距在大多数场景下是可以忽略的，所以在需要实现更复杂的逻辑控制的情况下，推荐使用 Proxy。
   - Proxy 可以拦截并重写多种操作，如 get、set、deleteProperty 等；Object.defineProperty 只能拦截属性的读取和赋值操作。
   - Proxy 支持迭代器，可以使用 for...of、Array.from() 等进行迭代；Object.defineProperty 不支持迭代器，无法直接进行迭代操作
   - Proxy 可以通过添加自定义的 handler 方法进行扩展；Object.defineProperty 不支持扩展，只能使用内置的 get 和 set 方法拦截
   - Proxy 使用 new Proxy(target, handler) 创建代理对象；Object.defineProperty 直接在对象上使用 Object.defineProperty(obj, prop, descriptor)
   - Proxy 支持监听整个对象的变化，通过 get 和 set 方法拦截；Object.defineProperty 只能监听单个属性的变化，通过 get 和 set 方法拦截
   - Proxy 性能相对较低，因为每次操作都需要经过代理；Object.defineProperty 性能相对较高，因为直接在对象上进行操作
   - 通过索引去访问或修改已经存在的元素，Object.defineProperty 是可以拦截到的。如果是不存在的元素，或者是通过 push 等方法去修改数组，则无法拦截。vue2 在实现的时候，通过重写了数组原型上的七个方法（push、pop、shift、unshift、splice、sort、reverse）来解决

4. 看代码说输出，什么是微任务和宏任务，以及它们的执行顺序

   - 在创建 Promise 的时候，构造函数中的代码是同步执行的。这意味着在调用 new Promise() 时，传递给 Promise 的执行器函数（executor function）会立即执行。
   - Promise 的 then, catch, finally 方法会把它们的回调函数添加到微任务队列中。微任务是在当前事件循环的最后执行，优先级高于宏任务（如 setTimeout、setInterval）。

```js
const promise = new Promise((resolve, reject) => {
  console.log(1);
  setTimeout(() => {
    console.log("TimerStart");
    // Promise最初同步代码执行完毕后并未改变状态，仍是pending，直到resolve被调用，Promise状态变为resolved，此时会执行微任务队列中的回调函数，即then中的回调函数。
    resolve("success");
    console.log("TimerEnd");
  }, 0);

  console.log(2);
});

// promise.then 注册了一个回调函数，该回调函数会在 Promise 状态变为 resolved 后进入微任务队列。
promise.then((value) => {
  console.log(value);
});

console.log(4);

// 1 2 4 TimerStart TimerEnd success
```

4. 手写代码：扁平数组转成树

```js
// 如题：
// input:
// [
//   { id: 1, parentId: null },
//   { id: 2, parentId: null },
//   { id: 3, parentId: 1 },
//   { id: 4, parentId: 1 },
//   { id: 5, parentId: 3 },
// ]
// output:
// [{
//     id: 1,
//     parentId: null,
//     children: [
//       { id: 3, parentId: null, children: [{ id: 5, parentId: null, children: [] }] },
//       { id: 4, parentId: null, children: [] },
//     ],
//   },
//   { id: 2, parentId: null, children: [] })
// ];

const transform = (data) => {
  const tree = [];

  const map = new Map();

  for (let node of data) {
    // 在map中存储的是对象的引用，而不是对象的值，因此可以修改对象的属性。借助这个特性，我们在外部修改了map中的对象，也会影响到tree中的对象。所以最后从map中拿到的node也是被修改了之后的。这里是为了方便后续操作，将data中的对象转换成map中的对象。同时要注意map中set的是一个新的node，而不是直接set的data中的node，否则会污染data的原始数据。
    map.set(node.id, { ...node, children: [] });
  }

  for (let node of data) {
    const { id, parentId } = node;
    // 在map中存储的是对象的引用，而不是对象的值，因此可以修改对象的属性。借助这个特性，我们在外部修改了map中的对象，也会影响到tree中的对象。所以最后从map中拿到的node也是被修改了之后的。
    const treeNode = map.get(id);
    if (!parentId) {
      tree.push(treeNode);
    } else {
      const parentNode = map.get(parentId);
      if (parentNode?.children) {
        parentNode.children.push(treeNode);
      }
    }
  }

  return tree;
};

const nodes = [
  { id: 1, parentId: null },
  { id: 2, parentId: null },
  { id: 3, parentId: 1 },
  { id: 4, parentId: 1 },
  { id: 5, parentId: 3 },
  { id: 6, parentId: 3 },
  { id: 7, parentId: 4 },
];
transform(nodes);
console.log(JSON.stringify(transform(nodes), null, 2));
```

5. 前端技术选型怎么做的?

   - 项目需求分析：功能需求、性能需求、可扩展性
   - 技术栈评估：社区和生态系统、成熟度和稳定性、学习曲线
   - 团队能力和经验：现有技能、培训和招聘
   - 项目时间和预算：开发周期、成本
   - 未来发展和技术趋势：技术趋势、更新和支持
   - 实验和原型：原型验证、性能测试
   - 反馈和调整：用户反馈、持续监测

6. `Promise.then.then.catch`：如果第一个 then 报错了，第二个 then 会执行吗？catch 能捕获到异常吗？throw Error 和 reject 的区别?

   - 如果第一个 then 报错了，第二个 then 没有第二个参数的话，则不会执行！
   - resolve 执行之后是可以在后面继续 return value 或者执行其他代码的！
   - 如果多个 then 链式调用并在最后跟了一个 catch，那么任意一个 then 的报错都会被这个 catch 捕获到。catch 会捕获到所有 then 链中的错误，包括异步的错误。
   - 如果每个 then 后面都跟一个 catch，那么每个 catch 只会捕获到自己对应的 then 的错误，而不会捕获到其他 then 的错误。

7. `Promise.then.catch.then.catch`：如果第一个 then 报错了，第二个 then 会执行吗？两个 catch 都能捕获到异常吗？

   - 如果第一个 then 抛出错误:
     - 异常会被紧接着的第一个 catch 捕获。
     - 捕获异常后，链会继续向下执行，下一个 then 会执行。
     - 如果后续的 then 中不再抛出错误，那么第二个 catch 将不会被触发。
   - 第一个 catch 的行为决定了第二个 then 是否执行：
     - 如果 catch 返回一个值，第二个 then 会执行并接收此值。
     - 如果 catch 抛出错误，第二个 then 不会执行，而是跳到下一个 catch。
   - throw Error 和 reject 的区别：throw Error 是抛出一个同步的错误，而 reject 是抛出一个异步的错误，通常用于 Promise 中。
   - 拓展：
     - 错误传播：在 Promise 链中，如果在 .then 回调函数中抛出错误，这个错误会被传递到链中下一个 .catch 或者接下来链中的 .then 的第二个参数（如果提供了）中。
     - 跳过后续 .then：当错误发生时，Promise 链将跳过所有后续的 .then（前提是后面的 then 都没有定义 reject 函数，才会直到遇到 .catch 为止，否则会被定义了 reject 函数的 then 拦截到这个错误并处理而不会再被 catch 拦截一遍，之后的 then 正常执行），并直接进入 .catch。
     - .catch 捕获错误：.catch 会捕获链中上游任何一个 .then 抛出的错误或者 Promise 本身的 reject 状态。

```js
new Promise((resolve, reject) => {
  resolve("Initial Success");
  console.log("test1"); // 会最先被打印出来
})
  .then((data) => {
    console.log(data); // 输出: Initial Success
    throw new Error("Something went wrong in first then");
    console.log("test2"); // 不会打印
  })
  .then(
    (data) => {
      // 这个不会被执行，因为前一个 then 抛出了错误
      console.log("This will not be logged:", data);
      return "Success in second then";
    },
    (err) => {
      // 如果定义了reject函数，那么会执行这个函数，如果这个函数返回了值，那么这个值会被传递给下一个then的resolve函数。
      console.log("This is 2nd then reject err:", err);
      return Promise.resolve("from 2nd then reject");
    }
  )
  .then(
    (res) => {
      console.log("this is 3rd then resolve", res);
    },
    (err) => {
      console.log("this is 3rd then reject", err);
    }
  )
  .catch((error) => {
    // 这里会捕获到第一个 then 中抛出的错误
    console.error("Caught an error:", error.message); // 输出: Caught an error: Something went wrong in first then
  });

// 输出如下：
// Initial Success
// This is 2nd then reject err: Error: Something went wrong in first then at <anonymous>:6:11
// this is 3rd then resolve from 2nd then reject

new Promise((resolve, reject) => {
  resolve("Initial Success");
})
  .then((data) => {
    console.log(data); // 输出: Initial Success
    throw new Error("Something went wrong in first then");
  })
  .then((data) => {
    // 这个不会被执行，因为前一个 then 抛出了错误
    console.log("This will not be logged:", data);
    return "Success in second then";
  })
  .then(
    (res) => {
      console.log("this is 3rd then resolve", res);
    },
    (err) => {
      // 这里会执行！
      console.log("this is 3rd then reject", err);
    }
  )
  .catch((error) => {
    // 这里会捕获到第一个 then 中抛出的错误
    console.error("Caught an error:", error.message); // 输出: Caught an error: Something went wrong in first then
  });

// 输出如下：
// Initial Success
// this is 3rd then reject Error: Something went wrong in first then at <anonymous>:6:11
```

8. 有一个页面加载大量图片，怎么做性能优化？页面多图片加载优化？

   - 懒加载（Lazy Loading）：对于图片来说，可以使用原生的 `loading="lazy"` 属性，或使用懒加载库，如 lazysizes，来实现这一点。这样可以显著减少初始加载时间。
   - 使用响应式图片：根据设备的不同分辨率，提供不同大小的图片，以减少不必要的带宽消耗。可以使用 srcset 和 sizes 属性来实现。
   - 图像压缩与格式优化：压缩图片：使用工具（如 TinyPNG、ImageOptim 等）压缩图片文件。选择合适的格式：对于高质量的图像，使用 JPEG；对于透明背景，使用 PNG；使用 WebP 格式可以达到更好的压缩效果。
   - 使用内容分发网络（CDN）：通过 CDN 分发图片，减少服务器负载，并加快加载速度，因为 CDN 会选择离用户最近的服务器提供资源。
   - 利用浏览器同个域名最多建立 6 个 http 请求的特性，使用不同的 CDN 域名，可以提高并发请求数量。
   - HTTP2：多路复用，一个链接就可以并行请求多张图片，减少加载时间。
   - 预加载关键图像：对于首屏需要立即展示的图片，可以使用 `<link rel="preload">` 标签来提前加载，确保它们在页面加载时立即可见。
   - 精灵图（CSS Sprites）：将多个小图片合并成一张大图片，通过 CSS 显示不同的部分，减少 HTTP 请求数量。
   - 延迟加载非关键内容：对于不影响首屏显示的图片，如页面底部的图片，可以延迟加载。用户滚动到图片所在位置时再加载这些图片。
   - 使用 Intersection Observer：利用浏览器的 Intersection Observer API 可以高效地实现懒加载，监控图片何时进入视口，并在需要时加载它们。
   - 优化缓存策略：为图片设置合适的缓存头，确保用户在后续访问时可以直接从缓存中加载图片，而不是重新下载。`Cache-Control: max-age=31536000`。
   - 硬件加速：使用 CSS 的 `transform: translate3d(0, 0, 0);`、`opacity`、`will-change: transform, opacity;` 属性进行硬件加速，可以提高页面渲染性能。
   - 前端硬件加速的使用场景：CSS 动画、3D 加载、视频播放、WebGL 渲染、Canvas 绘图、SVG 动画等。使用 `<canvas>` 标签时，可以选择 2D 上下文或 WebGL 上下文。WebGL 是基于 GPU 的绘图 API，可以直接触发硬件加速。`const gl = canvas.getContext('webgl'); // 获取 WebGL 上下文`
   - Web 动画 API：硬件加速动画

   ```html
   <div id="box"></div>

   <script>
     const box = document.getElementById("box");
     box.animate([{ transform: "translateX(0)" }, { transform: "translateX(300px)" }], {
       duration: 1000,
       iterations: Infinity,
     });
   </script>
   ```

   - 使用 `<video>` 标签播放视频时，现代浏览器会自动利用 GPU 加速视频解码。HTML5 视频播放默认支持硬件加速，只需使用 `<video>` 标签即可。

9. 性能优化看哪些指标？

页面加载时间：

- Time to First Byte (TTFB): 从用户请求到接收到第一个字节所需的时间，反映了服务器的响应速度。
- First Contentful Paint (FCP): 页面上的第一个文本或图像内容绘制在屏幕上的时间。
- Largest Contentful Paint (LCP): 页面主内容加载完成的时间，反映了页面的可用性。
- TBT：
- TTI：首次可交互时间，反映用户与页面的交互响应速度。
- FP：页面首次绘制的时间，反映用户与页面的交互响应速度。
- FMP：
- DOMContentLoaded：DOM 加载完成时间，反映页面的加载速度。
- 首次可交互时间：用户与页面的交互响应速度。
- 首次可点击时间：用户与页面的交互响应速度。

10. CSS 两列布局：左侧固定右侧自适应：float、flex、grid、position 等等

```html
<div class="container">
  <div class="left">左侧</div>
  <div class="right">右侧</div>
</div>
```

```css
/* 1. float */
.container {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: yellowgreen;
}
.left {
  float: left;
  width: 200px;
  background: red;
}
.right {
  width: calc(100% - 200px);
  margin-left: 200px;
  background: grey;
}

/* 2. position */
.container {
  position: relative;
  width: 100vw;
  height: 100vh;
  background: yellowgreen;
}
.left {
  position: absolute;
  left: 0;
  top: 0;
  width: 200px;
  height: 100%;
  background: red;
}
.right {
  /* width: calc(100% - 200px); */
  margin-left: 200px;
  background: grey;
}

/* 3. flex */
.container {
  display: flex;
  width: 100vw;
  height: 100vh;
  background: yellowgreen;
}
.left {
  width: 200px; /* 左侧固定宽度 */
  background: red;
}
.right {
  flex: 1; /* 右侧自适应 */
  background: grey;
}

/* 4. grid */
.container {
  display: grid;
  grid-template-columns: 200px 1fr; /* 左侧固定宽度，右侧自适应 */
  width: 100vw;
  height: 100vh;
  background: yellowgreen;
}
.left {
  background: red;
}
.right {
  background: grey;
}

/* 5. table */
.container {
  display: table;
  width: 100%; /* 占满父级宽度 */
}
.left {
  display: table-cell;
  width: 200px; /* 左侧固定宽度 */
  background: red;
}
.right {
  display: table-cell;
  background: grey; /* 右侧自适应 */
}
```

11. `flex:1` 的含义及默认值：`flex-grow:1;flex-shrink:1;flex-basis:0%;`(Chrome)

    - 同理：`flex:0` ==> `flex-grow:0;flex-shrink:1;flex-basis:0%;`(Chrome)
    - 同理：`flex:auto` ==> `flex-grow:1;flex-shrink:1;flex-basis:auto;`(Chrome)

## 2025.3.5

### 药明笔试

1. 处理 tweet 时间事件
   - 没读懂题目
2. 数组中相同数字出现的最多的次数称为数组的度，要求找出满足和该数组的度相同的子数组的最小长度
   - 遍历找出数组的度，然后记录相应的数字第一次和最后一次出现的位置，计算出子数组的长度，找出最小的子数组长度
3. SQL：从部门表和职员表中找出薪资最高的职员并合并成一张新的表
   - `SELECT e.department_id AS Department, e.name AS Employee, e.salary AS Salary FROM employees e JOIN departments d ON e.department_id = d.department_id ORDER BY e.salary DESC LIMIT 1`
4. Shell：只输出一个文件的第十行的内容
   - 用 `sed` 命令：`sed -n '10p' filename`
   - 用 `awk` 命令：`awk 'NR==10' filename`
   - 用 `head` 和 `tail` 命令：`head -n 10 filename | tail -n 1`
   - 用 `cat` 和 `sed` 命令：`cat filename | sed -n '10p'`
   - 用 `cat` 和 `awk` 命令：`cat filename | awk 'NR==10'`
   - 用 `cat` 和 `head` 和 `tail` 命令：`cat filename | head -n 10 | tail -n 1`
   - 用 `cat` 和 `sed` 和 `awk` 命令：`cat filename | sed -n '10p' | awk '{print}'` 或 `cat filename | awk 'NR==10' | sed -n '1p'`

## 3.8

### 日本

1. 原型和原型链
2. new 一个对象的时候发生了什么，如果 return 了一些东西会发生什么？
   1. 创建一个新对象：当你使用 new 关键字时，会创建一个全新的对象。这个对象的原型会被设置为构造函数的原型对象（Constructor.prototype）。
   2. 执行构造函数：然后 JavaScript 会执行构造函数内的代码。构造函数中的 this 关键字将指向新创建的对象。在这个函数中，通常会初始化对象的属性和方法。
   3. 返回对象：
      - 如果构造函数没有显式返回值：JavaScript 默认会返回新创建的对象。
      - 如果构造函数显式返回一个对象：则会返回该对象，而不是默认返回的新对象。
      - 如果返回的是基本类型（如字符串、数字、布尔值等）或不返回任何东西：则无论如何，都会返回新创建的对象。
3. 原型链继承和构造函数继承的区别

   - 原型链继承是通过将子类的原型指向父类的实例来实现的。子类可以访问父类实例的属性和方法。
   - 构造函数继承是通过在子类构造函数内调用父类构造函数来实现的。这种方式可以将父类的属性复制到子类的实例中。

   | 特性         | 原型链继承                               | 构造函数继承                           |
   | ------------ | ---------------------------------------- | -------------------------------------- |
   | 属性继承     | 只继承父类的原型属性                     | 继承父类的实例属性                     |
   | 方法继承     | 通过原型共享方法，所有实例共享同一个方法 | 每个实例都有自己的方法副本             |
   | 构造函数参数 | 无法向父类构造函数传递参数               | 可以向父类构造函数传递参数             |
   | 多重继承     | 不支持多重继承                           | 也不支持多重继承                       |
   | 实例共享     | 所有子类实例共享父类的属性               | 每个子类实例都拥有自己的属性副本       |
   | 性能         | 更节省内存，但方法共享可能导致状态不一致 | 占用更多内存，但每个实例都有独立的状态 |

   - 寄生组合继承可以结合二者的优点：使用构造函数继承实例属性，同时使用原型链继承共享方法。在构造函数中调用父类构造函数来继承属性，并使用 `Object.create()` 来建立原型链。这样，结合两者的优点，就能更好地实现 JavaScript 中的继承。

4. setState 是同步的还是异步的，在 16 和 18 版本的区别

   - 一般来说是异步的，但实际上是由于 react 的批处理机制合并多次 setState 为一次更新导致的，在 setTimeout 中就是同步的，多次调用就会导致多次渲染（react16），在 react18 版本中做了修改，在 setTimeout 中多次调用也会合并成一次更新了。也可以使用`useTransition` Hook，用于处理并发状态更新。React 18 引入了并发渲染的能力，新的 startTransition API 允许开发者指定某些状态更新为“过渡”，从而改善用户体验。这个特性对 setState 的使用有直接影响。使用 startTransition 可以标记一些非紧急的更新，这样 React 就可以优先处理用户的输入，确保界面的响应性。通过这种方式，可以让 React 更好地管理状态更新的优先级，提高复杂应用的性能和响应性。

   ```js
   import { startTransition } from "react";

   startTransition(() => {
     setState({ count: count + 1 });
   });

   const [isPending, startTransition] = useTransition();

   const handleClick = () => {
     startTransition(() => {
       setState({ count: count + 1 });
     });
   };
   ```

   - 在 React 18 中，批处理的行为得到了进一步增强，支持在异步事件和 Promise 中自动批处理。这意味着即使是在异步操作中（比如在 setTimeout 或 Promise 的回调中），setState 的多次调用也可以被合并。这种增强使得在处理复杂状态更新时更加高效，减少了不必要的渲染。
   - 在 React 18 中，useState 允许接受一个函数作为初始值，这对某些性能敏感的情况特别有用，确保初始状态只计算一次：

   ```js
   const [state, setState] = useState(() => {
     const initialValue = computeInitialValue(); // 只在初始渲染时调用
     return initialValue;
   });
   ```

5. TS 泛型，是怎么做类型守卫的实现的？

   - 泛型是一种允许在定义函数、类或接口时不指定具体类型，而是在使用时再指定的技术。它可以提高代码的灵活性和可复用性。例如，定义一个接受任意类型的数组的函数。
   - 类型守卫是 TypeScript 中一种用于缩小变量类型范围的机制。它可以在运行时检查变量的类型，并且能够使 TypeScript 编译器更准确地推断变量的类型。
   - 在 TypeScript 中，泛型守卫（Generic Guards）是一种用于在泛型代码中进行类型检查的技术。泛型守卫可以帮助你在使用泛型时，精确地推断出变量的具体类型，从而确保在编写代码时能够获得更好的类型安全和更准确的类型推断。
   - 类型守卫是 TypeScript 中的一种机制，用于**在运行时检查某个变量的类型**，从而使 TypeScript 能够推断出该变量的具体类型。类型守卫的常见形式包括：
     - typeof 检查：用于检查基本数据类型。
     - instanceof 检查：用于检查对象的类型。
     - 用户自定义类型守卫：通过返回类型为 arg is Type 的函数来实现。
     - 使用 in 进行属性检查：in 操作符可以用于检查对象中是否存在某个属性，从而推断对象的类型。
   - 在 TypeScript 中，主要的概念是 类型守卫（Type Guards）。而 泛型守卫 并不是一个正式的术语，但可以理解为在泛型上下文中使用类型守卫来进行类型判断和推断的技术。因此，实际上 TypeScript 只有类型守卫这一种机制，而泛型守卫是特指使用泛型时的类型守卫。

   ```js
   // typeof
   function log(value: string | number) {
     if (typeof value === "string") {
       console.log(value.toUpperCase()); // value 是 string
     } else {
       console.log(value.toFixed(2)); // value 是 number
     }
   }
   // instanceof
   class Dog {
     bark() {
       console.log("Woof!");
     }
   }

   class Cat {
     meow() {
       console.log("Meow!");
     }
   }

   function handlePet(pet: Dog | Cat) {
     if (pet instanceof Dog) {
       pet.bark(); // pet 是 Dog
     } else {
       pet.meow(); // pet 是 Cat
     }
   }
   // 自定义类型守卫
    interface Dog {
      bark: () => void;
    }

    interface Cat {
        meow: () => void;
    }

    function isDog(pet: Dog | Cat): pet is Dog {
        return (pet as Dog).bark !== undefined;
    }

    function handlePet(pet: Dog | Cat) {
        if (isDog(pet)) {
            pet.bark(); // pet 是 Dog
        } else {
            pet.meow(); // pet 是 Cat
        }
    }
    // 泛型结合类型守卫
    function isArray<T>(arg: T): arg is T[] {
        return Array.isArray(arg);
    }

    function processValue<T>(value: T) {
        if (isArray(value)) {
            console.log(`Array with length: ${value.length}`); // value 是 T[]
        } else {
            console.log(`Single value: ${value}`); // value 是 T
        }
    }

    processValue([1, 2, 3]); // 输出: Array with length: 3
    processValue(10); // 输出: Single value: 10
   ```

6. 看代码说输出：var 和 let 的区别，宏任务微任务，TS 的 interface 和 type 的区别
7. 用没用过自定义 hooks
8. 项目中怎么做的权限控制

### ebay 外包

```js
// 请实现一个异步任务调度器，可以控制同时运行的异步任务数量。
// 要求
// * 构造一个 Scheduler 类，并实现 add 方法添加异步任务，每个任务返回一个 Promise。
// * Scheduler 每次只能执行两个异步任务，当一个任务完成后，下一个任务才能开始执行。
// * add 方法应返回一个 Promise，任务完成后该 Promise 将被 resolve

class Scheduler {
  constructor() {
    this.tasks = [];
    this.count = 2;
    this.taskNum = 0;
  }

  add(task) {
    this.tasks.push(task);

    const start = () => {
      return new Promise(async (resolve) => {
        if (!this.tasks.length) return;
        if (this.taskNum >= this.count) return;

        const task = this.tasks.shift();
        try {
          this.taskNum++;
          await task();
          this.taskNum--;
          resolve();
        } catch (e) {
          console.log(e);
        } finally {
          start();
        }
      });
    };

    start();
  }
}

const timeout = (time) => new Promise((resolve) => setTimeout(resolve, time));
const scheduler = new Scheduler();
const addTask = (time, name) => {
  scheduler.add(() => timeout(time).then(() => console.log(name)));
};

addTask(1000, "A"); // Output A after 1s
addTask(500, "B"); // Output B after 0.5s
addTask(300, "C"); // After task A or B is completed, output C after 0.3s
addTask(400, "D"); // After task C is completed, output after 0.4s
```

## 4.1

### 数禾科技

1. let、const 与 var 的区别

   - `var`：函数作用域或全局作用域，声明的变量会被提升到函数的顶部并初始化为 undefined，不存在暂时性死区。使用 `var` 声明的变量可以被重新声明或覆盖。全局作用域的 `var` 变量会成为全局对象的属性。
   - `let/const`：块级作用域，声明的变量会被提升，但不会被初始化。由于暂时性死区，在声明之前访问变量会报错`ReferenceError`。全局作用域的 `let/const` 变量不会成为全局对象的属性。
   - `let` 声明的变量可以被重新赋值，而 `const` 声明的变量不能被重新赋值（对于基本类型）。

2. 函数中使用未声明的变量会报错：`ReferenceError`。非严格模式下，在（立即执行）函数中直接给未声明的变量赋值会创建一个全局变量，访问时报错`ReferenceError`，即不使用 var、let、const 声明。严格模式下`use strict;`访问和赋值时都会报错`ReferenceError`。
3. 闭包的定义和作用，常见的闭包应用场景。
   - 闭包：函数和对其周围状态（词法环境）的引用捆绑在一起形成的一个组合。即使函数在其词法作用域之外执行，闭包仍然可以访问这些变量。闭包是指函数能够记住并访问他的词法作用域，即使这个函数在词法作用域之外执行。
   - 主要用途：数据隐藏，通过闭包创建私有变量，外部无法直接访问；实现模块和封装，闭包可以模拟 ES6 中的模块，实现代码封装。
   - react 中的事件的箭头函数，科里化，防抖节流函数，umd 模块，HOC 等
4. `position:absoulte;`在什么情况下才会生效？具体表现是什么？相对谁来定位的？
   - 元素设置了 `position: absolute`（或 `position: fixed`）。且存在一个`非 static` 定位的祖先元素（即祖先元素设置了 `position: relative / absolute / fixed / sticky`）。如果没有这样的祖先元素，则相对于 `<html>`（或 `<body>`） 进行定位。
   - 相对于最近的非 static 定位的祖先元素根据 top、left、bottom、right 来定位，如果没有符合条件的祖先元素，则相对于 `<html>`（或 `<body>`） 进行定位。
   - 脱离文档流，不再占据原来的空间，其他元素会忽略它的存在；如果没有设置 top、left、bottom、right 这些值，元素会保持在原来的位置（但依然脱离文档流）；默认宽度由内容撑开，可以设置 width: 100% 来占满父容器的宽度；可以使用 z-index 控制堆叠顺序。
   - absolute 的定位基准是`父级的内容区（content） + padding（不包括 margin 和 border）`。
5. `position:fixed`是相对于视口 viewport 定位的，为啥有人说是相对于图层定位的？
   - CSS 规范明确规定，fixed 元素是相对于 浏览器视口（viewport） 定位的，与文档流无关。
   - 滚动页面时，fixed 元素会固定在屏幕同一位置。
   - 不受父级元素影响（即使父级有 transform、filter 等属性，也不会改变其定位基准，除非触发层叠上下文的影响）。
   - 与绝对定位的工作方式完全相同，只有一个主要区别：绝对定位将元素固定在相对于其位置最近的祖先。如果没有，则为初始包含它的块。
   - 某些 CSS 属性会创建新的定位上下文：如果祖先元素设置了 `transform、filter、will-change` 等属性，可能会意外改变 fixed 的定位基准（表现类似 absolute）。本质：这是浏览器的一个历史行为，而非 CSS 规范要求。现代浏览器已部分修复此问题。
   - 浏览器渲染机制中的“图层”：fixed 元素会被浏览器提升到一个独立的合成层（Compositing Layer），与普通文档流分离。
6. 硬件加速：常见的：`transform: translateZ(0); opacity: 0.99; will-change: transform; filter; clip-path; backface-visibility; perspective`等。
7. 如何校验一段 JSON 是否符合低代码平台的规范？

```js
// 如下，我们规定 JSON 数据必须符合以下规范：
// 1. input-text和button-submit 只能包含在form元素或者form的后代元素
// 2. form元素可以包含在其他form元素的后代元素中，但不能被input-text、text、button-submit等包含
const data = [
  {
    type: "form",
    children: [
      {
        type: "input-text",
      },
      {
        type: "div",
        children: [
          {
            type: "text",
          },
          {
            type: "button-submit",
          },
        ],
      },
    ],
  },
  {
    type: "input-text",
  },
];

function validateData(data) {
  const validTypes = new Set(["form", "input-text", "text", "button-submit", "div"]);

  function isValidElement(element, insideForm) {
    // 检查元素类型是否合法
    if (!validTypes.has(element.type)) {
      return false;
    }

    // 处理form元素
    if (element.type === "form") {
      // form不能被input-text、text、button-submit等包含
      if (insideForm) {
        return false;
      }
      // 进入form内部，继续检查其子元素
      let valid = true;
      if (element.children) {
        for (const child of element.children) {
          valid = valid && isValidElement(child, true); // 进入form内部，insideForm设为true
        }
      }
      return valid;
    }

    // 如果是input-text、text、button-submit
    if (["input-text", "text", "button-submit"].includes(element.type)) {
      // 只能在form内部或form的后代元素中
      return insideForm;
    }

    // 对于div元素，直接返回true，继续检查它的子元素
    if (element.type === "div") {
      let valid = true;
      if (element.children) {
        for (const child of element.children) {
          valid = valid && isValidElement(child, insideForm); // 继续保持insideForm
        }
      }
      return valid;
    }

    // 对于其他元素类型，默认返回false
    return false;
  }

  // 检查每个顶层元素
  for (const element of data) {
    if (!isValidElement(element, false)) {
      return false; // 如果任何元素不合法，返回false
    }
  }

  return true; // 所有元素都合法，返回true
}

// 测试示例
const data = [
  {
    type: "form",
    children: [
      {
        type: "input-text",
      },
      {
        type: "div",
        children: [
          {
            type: "text",
          },
          {
            type: "button-submit",
          },
        ],
      },
    ],
  },
  {
    type: "input-text",
  },
];

console.log(validateData(data)); // 输出：false
```

8. React.memo 特性和使用场景。

### 严格模式非严格模式的区别和注意事项

1. 全局严格模式：在脚本或函数的最顶部添加 `"use strict";` 即可启用严格模式。
2. 函数级严格模式：`function strictFunction() {"use strict";// 该函数以严格模式运行}`
3. 变量声明：非严格模式：未使用 var、let 或 const 声明的变量会被隐式创建为全局变量。严格模式：未声明的变量赋值会抛出 ReferenceError。
4. 删除操作：非严格模式：允许删除变量、函数或函数参数（尽管无效）。严格模式：删除变量、函数或函数参数会抛出 SyntaxError。
5. 重复属性名：非严格模式：允许对象字面量中出现重复的属性名。严格模式：对象字面量中重复的属性名会抛出 SyntaxError。
6. 函数参数重复：非严格模式：允许函数参数重复。严格模式：函数参数重复会抛出 SyntaxError。
7. this 的值：非严格模式：在全局函数中，this 指向全局对象（浏览器中为 window）。严格模式：在全局函数中，this 为 undefined。
8. eval 的行为：非严格模式：eval 可以在当前作用域中创建变量。严格模式：eval 不会在外部作用域中创建变量，变量仅存在于 eval 内部。
9. arguments 对象：非严格模式：修改函数参数会同步修改 arguments 对象。严格模式：修改函数参数不会影响 arguments 对象。
10. 八进制字面量：非严格模式：允许使用八进制字面量（以 0 开头的数字）。严格模式：使用八进制字面量会抛出 SyntaxError。

### JS 中的类型

1. 原始类型：undefined、null、boolean、number、bigint、string、symbol。
2. 对象类型：Object、Array、Function、Date、RegExp、Map、Set、Promise、Error、JSON、Math 等。
3. typeof：检测原始类型和 function。
4. instanceof：检测对象类型。
