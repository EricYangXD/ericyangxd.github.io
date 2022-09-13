---
title: Webpack知识点
author: EricYangXD
date: "2022-02-10"
---

## Webpack5

Webpack 是目前最热门的前端工程化「模块打包工具」，它设计的初衷是「解决前端模块化问题」，让我们实现如何「高效的地管理和维护项目中的每一个资源」，目前最新版本 Webpack5，功能也变得越来越强大，但它依旧不忘初心，始终没有改变它是一个前端打包工具的初衷，它所做的事情就是：「分析项目结构，找到并加载所依赖的资源模块，把一些不被浏览器支持的特性（如 Sass，TypeScript，ES6+、JSX 等）转换和打包成浏览器兼容的格式来使用」。

### 资源模块

资源模块(asset module) 是一种模块类型，它允许在 js 代码中引入其它资源文件（字体，图片、样式等），以前只能通过 loader 加载器来实现，而 Webpack5 中通过 asset module 轻松实现。

Webpack5 实现了 4 种新的模块类型，通过 Rule 的 type 属性设置：

1. asset/resource  输出一个单独的文件并导出 URL。之前通过使用  file-loader  实现。
2. asset/inline  导出一个资源的 data URI。之前通过使用  url-loader  实现。
3. asset/source  导出资源的源代码。之前通过使用  raw-loader  实现。
4. asset  在导出一个 dataURI 和发送一个单独的文件之间自动选择。之前通过使用  url-loader，并且配置资源体积限制实现。

- 如果设置成 asset/inline，则会把图片对应的 dataURI（base64 编码）写入到打包后的 js 文件中，这样的好处是减少页面的 http 请求数量，加快页面渲染速度。
- 如果设置成 asset，则会根据图片的大小在 asset/inline 和 asset/resource 中自动选择
- 默认大于 8KB 导出单独文件，小于等于 8KB 导出 dataURI（可通过 Rule 的 parser.dataUrlCondition.maxSize 去设置，单位是:Byte 字节）

### loader 和 plugin

Loader 是用来解决资源文件的加载和编译问题，它只在模块加载环节工作。

而 Plugin 就是用来处理 loader 工作以外的自动化工作：用来增加 Webpack 在项目自动化构建方面的能力，能作用于 Webpack 工作流程的方方面面，正是有了 Plugin，让 Webpack 几乎无所不能。

### 插件 (Plugin)

- 自动生成所需的 html 文件
- 实现打包前清除 dist 输出目录的内容
- 拷贝不需要打包的资源文件到输出目录
- 压缩 webpack 打包后的输出文件
- 自动化部署

1. `html-webpack-plugin`：生成 html 文件并自动引入打包后的 js 文件。要生成多少个 html 文件就 new 多少个 Plugin。
2. `clean-webpack-plugin`：实现在打包前先清除之前生成的文件。webpack 5.20.0 以上版本只需要设置 output.clean 为 true 就行。
3. `copy-webpack-plugin`：在实际开发中还有很多不需要经过 webpack 构建的文件（如：favicon.ico、robots.txt 等），这些文件最终都需要部署到服务器，所以也需要放到最终的输出目录，可以通过该插件来实现复制，避免手动操作。

- Q:webpack 和 webpack 插件似乎“知道”应该生成哪些文件?
- A:答案是，webpack 通过 manifest，可以追踪所有模块到输出 bundle 之间的映射。通过 `WebpackManifestPlugin` 插件，可以将 manifest 数据提取为一个 json 文件以供使用。

### 加载器（Loader）

webpack 使用加载器的顺序是从后往前调用。

1. `css-loader`：处理项目中的样式文件，`css-loader`默认支持`*.module.css`格式的样式文件实现模块化，也就是说如果你的文件采用该命名方式，哪不配置`modules:true`，也能实现 css 模块化。
2. `style-loader`：把 css 代码写入页面 style 标签。
3. `css模块（css module）`：`css-loader`默认支持`*.module.css`格式的样式文件实现模块化。
4. `postcss-loader`：配合 `autoprefixer` 与 `browserslist` 自动添加浏览器内核前缀，从而实现样式兼容写法。
   - 先安装加载器与依赖:`npm install postcss-loader autoprefixer`
   - 配置 browserslist（可在`package.json`或`.browserslistrc`中配置）:`{"browserslist": ["last 2 versions","> 1%","not IE 11"]}`
   - webpack 配置:`options.postcssOptions.plugins=['autoprefixer']`
   - 然后正常编写样式代码即可，打包时会自动加上前缀
5. `sass-loader`：sass 加载器，该加载器依赖 sass 模块，所以需要一并安装：`npm install sass-loader sass`，并对`.scss`文件使用该 loader 即可。
6. `babel-loader`：使用 Babel 对 ES6+的新特性的代码进行转换，一般转换成 ES5 代码。先要安装 `babel-loader`，它需要依赖`@babel/core`：`npm install babel-loader @babel/core @babel/preset-env`。`@babel/preset-env`是用来解决浏览器兼容问题的预设，能根据当前的运行环境，自动确定你需要的 plugins 和 polyfills，强力推荐。对 js 文件设置`use:{loader:'babel-loader',options:{presets:['@babel/preset-env']}}`即可。

## 详解 webpack 中的 hash、chunkhash、contenthash 区别

> hash 一般是结合 CDN 缓存来使用，通过 webpack 构建之后，生成对应文件名自动带上对应的 MD5 值。如果文件内容改变的话，那么对应文件哈希值也会改变，对应的 HTML 引用的 URL 地址也会改变，触发 CDN 服务器从源服务器上拉取对应数据，进而更新本地缓存。但是在实际使用的时候，这几种 hash 计算还是有一定区别。

### hash

hash 是跟整个项目的构建相关，同一次构建过程中生成的哈希都是一样的，只要项目里有文件更改，整个项目构建的 hash 值都会更改，并且全部文件都共用相同的 hash 值。

### chunkhash

根据入口文件进行依赖文件解析、构建对应的 chunk，生成多个 bundle，把公共依赖库和我们的代码文件分开，但是如果某个文件变了，那么引用它的文件也会跟着改变。

采用 hash 计算的话，每一次构建后生成的哈希值都不一样，即使文件内容压根没有改变。这样子是没办法实现缓存效果，我们需要换另一种哈希值计算方式，即 chunkhash。

chunkhash 和 hash 不一样，它根据不同的入口文件(Entry)进行依赖文件解析、构建对应的 chunk，生成对应的哈希值。我们在生产环境里把一些公共库和程序入口文件区分开，单独打包构建，接着我们采用 chunkhash 的方式生成哈希值，那么只要我们不改动公共库的代码，就可以保证其哈希值不会受影响。

### contenthash

文件内容不改变，contenthash 就不变。

在 chunkhash 的例子，我们可以看到由于 index.css 被 index.js 引用了，所以共用相同的 chunkhash 值。但是这样子有个问题，如果 index.js 更改了代码，css 文件就算内容没有任何改变，由于是该模块发生了改变，导致 css 文件会重复构建。

这个时候，我们可以使用 extra-text-webpack-plugin 里的 contenthash 值，保证即使 css 文件所处的模块里就算其他文件内容改变，只要 css 文件内容不变，那么不会重复构建。

一般用于 CDN。

```js
// 示例
const MiniCssExtractPlugin = require("mini-css-extract-plugin"); // 新增

module.exports = {
	mode: "production",
	entry: {
		index: "./src/index.js",
		chunk1: "./src/chunk1.js",
	},
	output: {
		filename: "[name].[chunkhash].js",
	},
	module: {
		// 新增
		rules: [
			{
				test: /\.css$/,
				use: [MiniCssExtractPlugin.loader, "css-loader"], // 单个loader时可以直接 -> loader:'css-loader'
				// use: ['style-loader', "css-loader"], // 先使用css-loader，再使用style-loader
				// 更多配置的时候使用对象的形式，简单配置的直接使用字符串即可
				// use: [
				// 	"style-loader",
				// 	{
				// 		loader: "css-loader",
				// 		options: {
				// 			modules: true,
				// 		},
				// 	},
				// ],
			},
			{
				test: /\.png$/,
				use: ["url-loader"], // webpack4
				// webpack5
				// type:'asset/resource', // 取代url-loader
				// generator: {
				// 	 filename: "img/[name]-[hash][ext]",// 设置输出的文件名和保存的路径
				// },
			},
		],
	},
	plugins: [
		// 新增
		// 提取css插件
		new MiniCssExtractPlugin({
			// Options similar to the same options in webpackOptions.output
			// both options are optional
			filename: "[name].[contenthash].css",
		}),
	],
};
```

### 总结

hash 所有文件哈希值相同； chunkhash 根据不同的入口文件(Entry)进行依赖文件解析、构建对应的 chunk，生成对应的哈希值； contenthash 计算与文件内容本身相关，主要用在 css 抽取 css 文件时。

1. **不管是在 chunkhash 还是 contenthash，修改 css 都会引发 js 和 css 的改变；**
2. **在 chunkhash 时，由于 js 和 css 的 chunkhash 是一样的，所以修改了 js，会导致整个 chunk 的 chunkhash 改变，它们俩是同一个 chunkhash，肯定就都变了；而在 contenthash 时，js 修改不会影响 css 的改变。**

## Hot Module Replacement(HMR)--热模块替换

见名思意，即无需刷新在内存环境中即可替换掉过旧模块。与 Live Reload 相对应。在 webpack 的运行时中 `__webpack__modules__` 用以维护所有的模块。

而热模块替换的原理，即通过 chunk 的方式加载最新的 modules，找到 `__webpack__modules__` 中对应的模块逐一替换，并删除其上下缓存。

1. `webpack-dev-server` 将打包输出 bundle 使用内存型文件系统控制，而非真实的文件系统。此时使用的是 memfs (opens new window)模拟 node.js fs API;
2. 每当文件发生变更时，webpack 将会重新编译，`webpack-dev-server` 将会监控到此时文件变更事件，并找到其对应的 module。此时使用的是 chokidar (opens new window)监控文件变更;
3. `webpack-dev-server` 将会把变更模块通知到浏览器端，此时使用 websocket 与浏览器进行交流。此时使用的是 ws(opens new window);
4. 浏览器根据 websocket 接收到 hash，并通过 hash 以 JSONP 的方式请求更新模块的 chunk;
5. 浏览器加载 chunk，并使用新的模块对旧模块进行热替换，并删除其缓存;

## 如何提升 webpack 构建资源的速度

### 更快的 loader: swc

在 webpack 中耗时最久的当属负责 AST 转换的 loader。当 loader 进行编译时的 AST 操作均为 CPU 密集型任务，使用 Javascript 性能低下，此时可采用高性能语言 rust 编写的 swc。

```js
module: {
	rules: [
		{
			test: /\.m?js$/,
			exclude: /(node_modules)/,
			use: {
				loader: "swc-loader",
			},
		},
	];
}
```

### 持久化缓存: cache

1. webpack5 内置了关于缓存的插件，可通过以下配置开启。它将 Module、Chunk、ModuleChunk 等信息序列化到磁盘中，二次构建避免重复编译计算，编译速度得到很大提升。

2. 如对一个 JS 文件配置了 eslint、typescript、babel 等 loader，他将有可能执行五次编译，被五次解析为 AST：

- acorn: 用以依赖分析，解析为 acorn 的 AST
- eslint-parser: 用以 lint，解析为 espree 的 AST
- typescript: 用以 ts，解析为 typescript 的 AST
- babel: 用以转化为低版本，解析为 @babel/parser 的 AST
- terser: 用以压缩混淆，解析为 acorn 的 AST

而当开启了持久化缓存功能，最耗时的 AST 解析将能够从磁盘的缓存中获取，再次编译时无需再次进行解析 AST。

```js
{
	cache: {
		type: "filesystem";
	}
}
```

3. 在 webpack4 中，可使用 cache-loader 仅仅对 loader 进行缓存。需要注意的是该 loader 目前已是 @depcrated 状态。

```js
module.exports = {
	module: {
		rules: [
			{
				test: /\.ext$/,
				use: ["cache-loader", ...loaders],
				include: path.resolve("src"),
			},
		],
	},
};
```

### 多进程: thread-loader

1. thread-loader 为官方推荐的开启多进程的 loader，可对 babel 解析 AST 时开启多线程处理，提升编译的性能。
2. 把这个 loader 放置在其他 loader 之前，放置在这个 loader 之后的 loader 就会在一个单独的 worker 池(worker pool)中运行。
3. 每个 worker 都是一个单独的有 600ms 限制的 node.js 进程。同时跨进程的数据交换也会被限制。
4. 可以在 options 中配置 workers：即产生的 worker 的数量，默认是 cpu 的核心数；workerParallelJobs：一个 worker 进程中并行执行工作的数量，默认为 20；poolTimeout：闲置时定时删除 worker 进程，默认为 500ms；等参数。

```js
module.exports = {
	module: {
		rules: [
			{
				test: /\.js$/,
				use: [
					{
						loader: "thread-loader",
						options: {
							workers: 10,
						},
					},
					"babel-loader",
				],
			},
		],
	},
};
```

2. 在 webpack4 中，可使用 happypack plugin，但需要注意的是 happypack 已经久不维护了。

## 如何分析前端打包体积

在 webpack 中，可以使用 webpack-bundle-analyzer (opens new window)分析打包后体积分析。

其原理是根据 webpack 打包后的 Stats (opens new window)数据进行分析，在 webpack compiler 的 done hook (opens new window)进行处理。

```js
compiler.hooks.done.tapAsync("webpack-bundle-analyzer", (stats) => {});
```

在查看页面中，有三个体积选项：

- stat: 每个模块的原始体积
- parsed: 每个模块经 webpack 打包处理之后的体积，比如 terser 等做了压缩，便会体现在上边
- gzip: 经 gzip 压缩后的体积

```js
// ANALYZE=true npm run build 设置环境变量
const webpack = require("webpack");
const BundleAnalyzerPlugin =
	require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

function f1() {
	return webpack({
		entry: "./index.js",
		mode: "none",
		plugins: [process.env.ANALYZE && new BundleAnalyzerPlugin()],
	});
}

f1().run((err, stat) => {});
```

## 如何正确地进行分包

### 为什么需要分包？

1. 一行代码将导致整个 bundle.js 的缓存失效
2. 一个页面仅仅需要 bundle.js 中 1/N 的代码，剩下代码属于其它页面，完全没有必要加载

### 如何更好的分包？

#### 打包工具运行时

webpack(或其他构建工具) 运行时代码不容易变更，需要单独抽离出来，比如 webpack.runtime.js。由于其体积小，必要时可注入 index.html 中，减少 HTTP 请求数，优化关键请求路径

#### 前端框架运行时

React(Vue) 运行时代码不容易变更，且每个组件都会依赖它，可单独抽离出来 framework.runtime.js。请且注意，务必将 React 及其所有依赖(react-dom/object-assign)共同抽离出来，否则有可能造成性能损耗。(因 webpack 依赖其 object-assign，而 object-assign 将被打入共同依赖 vendor.chunk.js，因此此时它必回加载，但是该页面并不依赖任何第三方库，完全没有必要全部加载 vendor.chunk.js)

#### 高频库

一个模块被 N(2 个以上) 个 Chunk 引用，可称为公共模块，可把公共模块给抽离出来，形成 vendor.js。

1. 问：那如果一个模块被用了多次 (2 次以上)，但是该模块体积过大(1MB)，每个页面都会加载它(但是无必要，因为不是每个页面都依赖它)，导致性能变差，此时如何分包？

- 答：如果一个模块虽是公共模块，但是该模块体积过大，可直接 import() 引入，异步加载，单独分包，比如 echarts 等

2. 问：如果公共模块数量多，导致 vendor.js 体积过大(1MB)，每个页面都会加载它，导致性能变差，此时如何分包

答：有以下两个思路

- 思路一: 可对 vendor.js 改变策略，比如被引用了十次以上，被当做公共模块抽离成 verdor-A.js，五次的抽离为 vendor-B.js，两次的抽离为 vendor-C.js
- 思路二: 控制 vendor.js 的体积，当大于 100KB 时，再次进行分包，多分几个 vendor-XXX.js，但每个 vendor.js 都不超过 100KB

#### 使用 webpack 分包

- 在 webpack 中可以使用 SplitChunksPlugin (opens new window)进行分包，它需要满足三个条件:

1. minChunks: 一个模块是否最少被 minChunks 个 chunk 所引用
2. maxInitialRequests/maxAsyncRequests: 最多只能有 maxInitialRequests/maxAsyncRequests 个 chunk 需要同时加载 (如一个 Chunk 依赖 VendorChunk 才可正常工作，此时同时加载 chunk 数为 2)
3. minSize/maxSize: chunk 的体积必须介于 (minSize, maxSize) 之间

- 以下是 next.js 的默认配置，可视作最佳实践: 源码位置: [next/build/webpack-config.ts](https://github.com/vercel/next.js/blob/v12.0.5-canary.10/packages/next/build/webpack-config.ts#L728)

```js
{
  // Keep main and _app chunks unsplitted in webpack 5
  // as we don't need a separate vendor chunk from that
  // and all other chunk depend on them so there is no
  // duplication that need to be pulled out.
  chunks: (chunk) =>
    !/^(polyfills|main|pages\/_app)$/.test(chunk.name) &&
    !MIDDLEWARE_ROUTE.test(chunk.name),
  cacheGroups: {
    framework: {
      chunks: (chunk: webpack.compilation.Chunk) =>
        !chunk.name?.match(MIDDLEWARE_ROUTE),
      name: 'framework',
      test(module) {
        const resource =
          module.nameForCondition && module.nameForCondition()
        if (!resource) {
          return false
        }
        return topLevelFrameworkPaths.some((packagePath) =>
          resource.startsWith(packagePath)
        )
      },
      priority: 40,
      // Don't let webpack eliminate this chunk (prevents this chunk from
      // becoming a part of the commons chunk)
      enforce: true,
    },
    lib: {
      test(module: {
        size: Function
        nameForCondition: Function
      }): boolean {
        return (
          module.size() > 160000 &&
          /node_modules[/\\]/.test(module.nameForCondition() || '')
        )
      },
      name(module: {
        type: string
        libIdent?: Function
        updateHash: (hash: crypto.Hash) => void
      }): string {
        const hash = crypto.createHash('sha1')
        if (isModuleCSS(module)) {
          module.updateHash(hash)
        } else {
          if (!module.libIdent) {
            throw new Error(
              `Encountered unknown module type: ${module.type}. Please open an issue.`
            )
          }

          hash.update(module.libIdent({ context: dir }))
        }

        return hash.digest('hex').substring(0, 8)
      },
      priority: 30,
      minChunks: 1,
      reuseExistingChunk: true,
    },
    commons: {
      name: 'commons',
      minChunks: totalPages,
      priority: 20,
    },
    middleware: {
      chunks: (chunk: webpack.compilation.Chunk) =>
        chunk.name?.match(MIDDLEWARE_ROUTE),
      filename: 'server/middleware-chunks/[name].js',
      minChunks: 2,
      enforce: true,
    },
  },
  maxInitialRequests: 25,
  minSize: 20000,
}
```

## JS 代码压缩 minify 的原理是什么

通过 AST 分析，根据选项配置一些策略，来生成一棵更小体积的 AST 并生成代码。

目前前端工程化中使用 terser 和 swc 进行 JS 代码压缩，他们拥有相同的 API。

常见用以压缩 AST 的几种方案如下:

### 去除多余字符: 空格，换行及注释

一般来说中文会占用更大的空间。多行代码压缩到一行时要注意行尾分号。

### 压缩变量名：变量名，函数名及属性名

缩短变量的命名也需要 AST 支持，不至于在作用域中造成命名冲突。

### 解析程序逻辑：合并声明以及布尔值简化

### 解析程序逻辑: 编译预计算

在编译期进行计算，减少运行时的计算量。

## 15 个 Webpack 优化点

### 构建时间的优化

#### thread-loader

多进程打包，可以大大提高构建的速度，使用方法是将 thread-loader 放在比较费时间的 loader 之前，比如 babel-loader，数组中右侧的 loader 先执行。

#### cache-loader

缓存资源，提高二次构建的速度，使用方法是将 cache-loader 放在比较费时间的 loader 之前，比如 babel-loader，同上。

#### 开启热更新

在 plugins 中增加 webpack 提供的热更新插件`new webpack.HotModuleReplacementPlugin()`，并配置`devServer.hot=true`。

#### 合理设置 exclude & include

```js
{
  //....
  test: /\.js$/,
  //使用include来指定编译文件夹
  include: path.resolve(__dirname, '../src'),
  //使用exclude排除指定文件夹
  exclude: /node_modules/,
  use: [
    'babel-loader'
  ]
},
```

#### 构建区分环境

1. 开发环境：去除代码压缩、gzip、体积分析等优化的配置，大大提高构建速度
2. 生产环境：需要代码压缩、gzip、体积分析等优化的配置，大大降低最终项目打包体积

#### 提升 webpack 版本

### 打包体积优化

主要是打包后项目整体体积的优化，有利于项目上线后的页面加载速度提升

#### CSS 代码压缩

CSS 代码压缩使用`css-minimizer-webpack-plugin`，效果包括压缩、去重

#### JS 代码压缩

- JS 代码压缩使用`terser-webpack-plugin`或者 uglify，实现打包后 JS 代码的压缩；

```js
const TerserPlugin = require('terser-webpack-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')

  optimization: {
    minimizer: [
      new CssMinimizerPlugin(), // 去重压缩css
      new TerserPlugin({ // 压缩JS代码
        terserOptions: {
          compress: {
            drop_console: true, // 去除console
          },
        },
      }), // 压缩JavaScript
    ],
  }
```

#### tree-shaking

tree-shaking 简单说作用就是：只打包用到的代码，没用到的代码不打包，而 webpack5 默认开启 tree-shaking，当打包的 mode 为 production 时，自动开启 tree-shaking 进行优化。

#### source-map 类型

- source-map 的作用是：方便你报错的时候能定位到错误代码的位置。它的体积不容小觑，所以对于不同环境设置不同的类型是很有必要的。

- 使用 `SourceMapDevToolPlugin` 进行更细粒度的配置。查看 `source-map-loader` 来处理已有的 source map。
- 配置 devtool 来控制 source map。

1. 开发环境: `devtool: 'eval-cheap-module-source-map'`, 开发环境的时候我们需要能精准定位错误代码的位置
2. 生产环境: `devtool: 'nosources-source-map'`, 生产环境，我们想开启 source-map，但是又不想体积太大，那么可以换一种类型
3. 验证 devtool 名称时，我们期望使用某种模式，注意不要混淆 devtool 字符串的顺序，模式是：`[inline-|hidden-|eval-][nosources-][cheap-[module-]]source-map`

```js
module.exports = [
	"(none)", // 生产包不配置devtool时，不生成 source map。性能最佳。build和rebuild速度都是最快的。具有最高性能的生产构建的推荐选择。缺点就是生产出了问题没法直接定位调试。
	"eval", // 具有最高性能的开发构建的推荐选择。
	"eval-cheap-source-map", // 开发构建的权衡选择。
	"eval-cheap-module-source-map", // 开发构建的权衡选择。
	"eval-source-map", // 使用高质量 SourceMap 进行开发构建的推荐选择。
	"source-map", // 具有高质量 SourceMap 的生产构建的推荐选择。
	"cheap-source-map", // 没有列映射(column mapping)的 source map，忽略 loader source map。
	"cheap-module-source-map", // 没有列映射(column mapping)的 source map，将 loader source map 简化为每行一个映射(mapping)。
	"inline-cheap-source-map", // 类似 cheap-source-map，但是 source map 转换为 DataUrl 后添加到 bundle 中。
	"inline-cheap-module-source-map", // 类似 cheap-module-source-map，但是 source map 转换为 DataUrl 添加到 bundle 中。
	"inline-source-map", // 发布单个文件时的可能选择
	"hidden-source-map", // 没有参考。仅将 SourceMap 用于错误报告目的时的可能选择。用于错误上报。
	"nosources-source-map", // 不包括源代码
];
```

#### 打包体积分析

使用`webpack-bundle-analyzer`插件可以审查打包后的体积分布，进而进行相应的体积优化

#### 打包速度分析

使用`speed-measure-webpack-plugin`插件可以审查打包后的体积分布，进而进行相应的体积优化

### 用户体验优化

#### 模块懒加载

如果不进行模块懒加载的话，最后整个项目代码都会被打包到一个 js 文件里，单个 js 文件体积非常大，那么当用户网页请求的时候，首屏加载时间会比较长，使用模块懒加载之后，大 js 文件会分成多个小 js 文件，网页加载时会按需加载，大大提升首屏加载速度。在配置路由时使用 lazy 动态 import 页面组件。

#### Gzip

Gzip 的内核是 Deflate，目前我们压缩文件用得最多的就是 Gzip。

使用`compression-webpack-plugin`，开启 Gzip 后，大大提高用户的页面加载速度，因为 gzip 的体积比原文件小很多，当然也需要后端的配合。

- Gzip 是高效的，压缩后通常能帮我们减少响应 70% 左右的大小
- Gzip 并不保证针对每一个文件的压缩都会使其变小
- Gzip 压缩背后的原理，是在一个文本文件中找出一些重复出现的字符串、临时替换它们，从而使整个文件变小。根据这个原理，文件中代码的重复率越高，那么压缩的效率就越高，使用 Gzip 的收益也就越大。反之亦然。

1. 一般来说，Gzip 压缩是服务器的活。本质可以理解为我们以服务器压缩的时间开销和 CPU 开销（以及浏览器解析压缩文件的开销）为代价，省下了一些传输过程中的时间开销。
2. 服务器的 CPU 性能不是无限的，如果存在大量的压缩需求，服务器也扛不住的。服务器一旦因此慢下来了，用户还是要等。Webpack 中 Gzip 压缩操作的存在，事实上就是为了在构建过程中去做一部分服务器的工作，为服务器分压。
3.

```js
plugins: [
	// ...
	// gzip
	new CompressionPlugin({
		algorithm: "gzip",
		threshold: 10240,
		minRatio: 0.8,
	}),
];
```

```zsh
# 开启和关闭gzip模式
gzip on;
# gizp压缩起点，文件大于1k才进行压缩
gzip_min_length 1k;
# 设置压缩所需要的缓冲区大小，以4k为单位，如果文件为7k则申请2*4k的缓冲区
gzip_buffers 4 16k;
# 设置gzip压缩针对的HTTP协议版本
gzip_http_version 1.0;
# gzip 压缩级别，1-9，数字越大压缩的越好，也越占用CPU时间
gzip_comp_level 2;
# 进行压缩的文件类型
gzip_types text/plain application/javascript text/css application/xml;
# 是否在http header中添加Vary: Accept-Encoding，建议开启
gzip_vary on;
```

#### 小图片转 base64

对于一些小图片，可以转 base64，这样可以减少用户的 http 网络请求次数，提高用户的体验。webpack5 中`url-loader`已被废弃，改用`asset-module`

```js
{
   test: /\.(png|jpe?g|gif|svg|webp)$/,
   type: 'asset',
   parser: {
     // 转base64的条件
     dataUrlCondition: {
        maxSize: 25 * 1024, // 25kb
     }
   },
   generator: {
     // 打包到 image 文件下
    filename: 'images/[contenthash][ext][query]',
   },
},
```

#### 合理配置 hash

我们要保证，改过的文件需要更新 hash 值，而没改过的文件依然保持原本的 hash 值，这样才能保证在上线后，浏览器访问时没有改变的文件会命中缓存，从而达到性能优化的目的。

```js
 output: {
    path: path.resolve(__dirname, '../dist'),
    // 给js文件加上 contenthash
    filename: 'js/chunk-[contenthash].js',
    clean: true,
  },
```

#### 首屏优化之 CDN 加速

通过把类似 echart、element-ui、lodash 等第三方依赖库单独提取出，从而减小打包的体积大小，通过 chainWebpack 中配置 externals 属性后的依赖插件不会被打包进 chunk 。而使用 CDN 加速、缓存也能加快访问速度。

1. 在 index.html 中手动引入 cdn 链接。并修改 webpack 配置，不再把 cdn 引入的依赖打包进 chunk。

```js
const IS_PRO = process.env.NODE_ENV === "production";
module.exports = {
	//... 其他基本配置
	chainWebpack: (config) => {
		if (IS_PRO) {
			config.externals({ echarts: "echarts" });
		}
	},
};
```

2. 通过 html-webpack-plugin 将 cdn 注入到 index.html 之中。需要修改 webpack 配置。

```js
const cdn = {
	css: [],
	js: ["https://cdn.jsdelivr.net/npm/echarts@4.8.0/dist/echarts.min.js"],
};
// 通过 html-webpack-plugin 将 cdn 注入到 index.html 之中
config.plugin("html").tap((args) => {
	args[0].cdn = cdn;
	return args;
});
```

#### 首屏优化之代码分割-splitChunks 拆包优化

1. Bundle Splitting: 这个过程提供了一种优化构建的方法，允许 webpack 为单个应用程序生成多个 bundle 文件。因此，可以将每个 bundle 文件与影响其他文件的更改进行分离，从而减少重新发布并由此被客户端重新下载的代码量，并且运用浏览器「缓存」。
   - 拆分的越小，文件越多，可能会有更多 Webpack 的辅助代码，也会带来更少的合并压缩。但是，通过数据分析，文件拆分越多，性能会更好。
2. Code Splitting: 代码分离指将代码分成不同的包/块，然后可以「按需加载」，而不是加载包含所有内容的单个包。一般配合路由懒加载。通过 Webpack4 的 import()语法。

- webpack 默认配置下会把所有的依赖和插件都打包到 vendors.js 中，有些可能是 app.js 。所以，对于大量引入第三方依赖的项目，这个文件会非常的大。而对于在特定页面中才会使用的插件也会造成性能浪费。这时拆分和异步就显得尤为重要了。
- 包的大小本地打包完成时可以看到，若想更仔细的分析可以通过插件 `webpack-bundle-analyzer`；

```js
splitChunks: {
  chunks: "async",// 哪些chunks需要进行优化，async-按需引入的模块将会被用于优化，initial-被直接引入的模块将会被用于优化，all-全部都会被用于优化。
  minSize: 30000,// 打包优化完生成的新chunk大小要> 30000字节，否则不生成新chunk。
  minChunks: 1,// 共享该module的最小chunk数
  maxAsyncRequests: 5,// 最多有N个异步加载请求该module
  maxInitialRequests: 3,// 一个入口文件可以并行加载的最大文件数量
  automaticNameDelimiter: '~',// 名字中间的间隔符
  name: true,// chunk的名字，true-自动生成，false-由 id 决定，string-缓存组最终会打包成一个 chunk，名称就是该 string。
  cacheGroups:{// 要切割成的每一个新chunk就是一个cache group。
    styles: {
      name: 'style',
      test: m => m.constructor.name === 'CssModule',// 用来决定提取哪些module，可以接受字符串，正则表达式，或者函数，函数的一个参数为module，第二个参数为引用这个module的chunk(数组)。
      chunks: 'all',
      enforce: true,
      priority: 40,
    },
    emcommon: {
      name: 'emcommon',
      test: module => {
          const regs = [/@ant-design/, /@em/, /@bytedesign/];
          return regs.some(reg => reg.test(module.context));
      },
      chunks: 'all',
      enforce: true,
      priority: 30,// 优先级一样的话，size大的优先被选择。
    },
    byteedu: {
      name: 'byteedu',
      test: module => {
        const regs = [
            /@ax/,
            /@bridge/,
            /axios/,
            /lodash/,
            /@byted-edu/,
            /codemirror/,
            /@syl-editor/,
            /prosemirror/,
        ];
        return regs.some(reg => reg.test(module.context));
      },
      chunks: 'all',
      enforce: true,
      priority: 20,
    },
    default: {
      minChunks: 2,
      priority: 1,
      chunks: 'all',
      reuseExistingChunk: true,// 当module未变时，是否可以使用之前的chunk。
    },
  },
};
```

## webpack 构建流程

1. 通过 yargs 解析 config 和 shell 的配置项
2. webpack 初始化过程，首先会根据第一步的 options 生成 compiler 对象，然后初始化 webpack 的内置插件及 options 配置
3. run 代表编译的开始，会构建 compilation 对象，用于存储这一次编译过程的所有数据
4. make 执行真正的编译构建过程，从入口文件开始，构建模块，直到所有模块创建结束
5. seal 生成 chunks，对 chunks 进行一系列的优化操作，并生成要输出的代码
6. seal 结束后，Compilation 实例的所有工作到此也全部结束，意味着一次构建过程已经结束

Webpack 插件统一以 apply 方法为入口，然后注册优化事件，apply 方法接收一个参数，该参数是 webpack 初始化过程中生成的 compiler 对象的引用，从而可以在回调函数中访问到 compiler 对象。

```js
apply(compiler) {
  //Compiler 对象包含了 Webpack 环境的所有配置信息，包含options、loaders、plugins等信息。这个对象在 Webpack 启动时被实例化，它是全局唯一的，可以简单地将它理解为 Webpack 实例。
  compiler.hooks.thisCompilation.tap("SplitChunksPlugin", compilation => {
  //Compilation 对象包含了当前的模块资源、编译生成资源、变化的文件等。当 Webpack 以开发模式运行时，每当检测到一个文件变化，一次新的 Compilation 将被创建。Compilation 对象也提供了很多事件回调供插件做扩展。通过 Compilation 也能读取到 Compiler 对象。
    let alreadyOptimized = false;
    //当编译开始接受新模块时触发
    compilation.hooks.unseal.tap("SplitChunksPlugin", () => {
      alreadyOptimized = false;
    });
    //在块优化阶段的开始时调用。插件可以利用此钩子来执行块优化。
    compilation.hooks.optimizeChunksAdvanced.tap(
      "SplitChunksPlugin",
      chunks => {
          //核心代码
      }
    );
  });
}
```

## 开发工具

在每次编译代码时，手动运行 `npm run build` 会显得很麻烦。webpack 提供几种可选方式，帮助你在代码发生变化后自动编译代码：

1. `webpack's Watch Mode`
2. `webpack-dev-server`
3. `webpack-dev-middleware`

多数场景中，你可能需要使用 `webpack-dev-server`。

### 使用 watch mode(观察模式)

可以指示 webpack "watch" 依赖图中所有文件的更改。如果其中一个文件被更新，代码将被重新编译，所以你不必再去手动运行整个构建。唯一的缺点是，为了看到修改后的实际效果，你需要手动刷新浏览器。

```json
{
	"scripts": {
		"test": "echo \"Error: no test specified\" && exit 1",
		"watch": "webpack --watch",
		"build": "webpack"
	}
}
```

### webpack-dev-server

通过**devServer**能在本地开发环境创建一个服务器，该服务器基于**express**，它能实现当项目中的代码发生改变的时，除了打包编译外，还可以帮助我们自动刷新浏览器从而实现实时展示效果。

1. 安装：`npm install webpack-dev-server`
2. 安装后只需要在 webpack.config.js 配置文件中设置 devSever 属性即可，可以设置成一个空对象，因为 devServer 能实现零配置启动。
3. 零配置启动服务器，默认端口为 8080：`npx webpack-dev-server`或`npx webpack server`
4. 服务器启动后，devServer 会监听着项目文件的变化，当文件有修改时自动重新打包编译，并采用 HMR 热替换或自动刷新浏览器方式更新页面效果。但与 watch 模式不同，webpack 为了让效率更快，这些打包操作并没生成具体的文件到磁盘中，而是在内存中完成的，所以我们并不会在实际的目录中看到打包后的文件效果。
5. 配置参数
   - static：指定静态资源目录（默认是 public 文件夹） 一般用来存放一些不经过 webpack 打包的静态资源文件（如：favicon.ico）
   - port: 指定服务器端口（默认：8080）
   - hot: 是热模块替换启用（默认：true）
   - open: 是否自动打开浏览器（默认：false）
   - historyApiFallback: 是否支持 history 路由（默认：false），可以设置访问页不存在时的默认跳转路径。
   - host：默认情况下，只有本机才能访问 devServer 服务器，通过设置 host 为 0.0.0.0 让局域网其它设备也能访问
   - compress: 启动 gzip 服务器压缩
   - proxy: 服务器代理（一般用于解决 ajax 跨域问题），基于 http-proxy-middleware 的代理服务器
   - 默认情况下，代理时会保留主机头的来源（请求头中的 Origin 字段为`http://localhost:8090`），有的接口服务器可能会对 Origin 字符进行限制，我们可以将 changeOrigin 设置为 true 以覆盖此行为，设置后 Origin 字段就被覆盖为`http://127.0.0.1:8081`。

- `webpack-dev-server` 在编译之后不会写入到任何输出文件。而是将 bundle 文件保留在内存中，然后将它们 serve 到 server 中，就好像它们是挂载在 server 根路径上的真实文件一样。如果你的页面希望在其他不同路径中找到 bundle 文件，则可以通过 dev server 配置中的 devMiddleware.publicPath 选项进行修改。
- `webpack-dev-server` 会从 `output.path` 中定义的目录中的 bundle 文件提供服务，即文件将可以通过 `http://[devServer.host]:[devServer.port]/[output.publicPath]/[output.filename]` 进行访问。

```js
// webpack.config.js
module.exports = {
	mode: "development",
	entry: {
		index: "./src/index.js",
		print: "./src/print.js",
		index: {
			import: "./src/index.js",
			dependOn: "shared", // 配置 dependOn option 选项，这样可以在多个 chunk 之间共享模块
		},
		another: {
			import: "./src/another-module.js",
			dependOn: "shared",
		},
		shared: "lodash",
	},
	plugins: [
		new HtmlWebpackPlugin({
			title: "Development",
		}),
	],
	output: {
		filename: "[name].bundle.js",
		path: path.resolve(__dirname, "dist"),
		clean: true, // 在每次构建前清理 /dist 文件夹，这样只会生成用到的文件。
	},
	devtool: "inline-source-map",
	//...
	devServer: {
		// 4.x版本写法
		contentBase: path.resolve("./public"),
		// 5.x版本写法
		static: path.resolve("./public"),
		port: 8090,
		hot: true,
		open: true,
		// historyApiFallback: true,
		historyApiFallback: {
			rewrites: "./404.html",
		},
		host: "0.0.0.0",
		compress: true,
		proxy: {
			"/api/search": {
				target: "http://127.0.0.1:8081", // target表示代理的服务器url
				pathRewrite: {
					// pathRewrite表示路径重写，key表示一个正则，value表示别名
					"^/api": "/api", // 即用 '/api'表示'http://localhost:8081/api'
				},
				changeOrigin: true,
			},
		},
	},
	optimization: {
		runtimeChunk: "single", // 单个 HTML 页面有多个入口时，可以防止webpack在运行时创建同一模块的两个实例，同时减少为给定页面加载模块所需的 HTTP 请求数。
		splitChunks: {
			chunks: "all", // 将公共的依赖模块提取到已有的入口 chunk 中，或者提取到一个新生成的 chunk。
			// 将第三方库(library)（例如 lodash 或 react）提取到单独的 vendor chunk 文件中，是比较推荐的做法，这是因为，它们很少像本地的源代码那样频繁修改。因此通过实现以上步骤，利用 client 的长效缓存机制，命中缓存来消除请求，并减少向 server 获取资源，同时还能保证 client 代码和 server 代码版本一致。
			cacheGroups: {
				vendor: {
					test: /[\\/]node_modules[\\/]/,
					name: "vendors",
					chunks: "all",
				},
			},
		},
	},
};
```

### 使用 webpack-dev-middleware

`webpack-dev-middleware` 是一个封装器(wrapper)，它可以把 webpack 处理过的文件发送到一个 server。`webpack-dev-server` 在内部使用了它，然而它也可以作为一个单独的 package 来使用，以便根据需求进行更多自定义设置。

需要调整 webpack 配置文件，配置`output.publicPath='/'`，在 server 脚本使用 publicPath，以确保文件资源能够正确地 serve 在 `http://localhost:3000` 下。然后在根目录添加 server.js 文件，然后添加一个 npm script，以使我们更方便地运行 server：`"server": "node server.js"`。

```js
const express = require("express");
const webpack = require("webpack");
const webpackDevMiddleware = require("webpack-dev-middleware");

const app = express();
const config = require("./webpack.config.js");
const compiler = webpack(config);

// 告知 express 使用 webpack-dev-middleware，
// 以及将 webpack.config.js 配置文件作为基础配置。
app.use(
	webpackDevMiddleware(compiler, {
		publicPath: config.output.publicPath,
	})
);

// 将文件 serve 到 port 3000。
app.listen(3000, function () {
	console.log("Example app listening on port 3000!\n");
});
```

## 多页应用和单页应用

1. 多页 MPA：指一个应用中有多个页面，页面跳转时是整页刷新。在多页面应用程序中，server 会拉取一个新的 HTML 文档给你的客户端。页面重新加载此新文档，并且资源被重新下载。由于入口起点数量的增多，多页应用能够复用多个入口起点之间的大量代码/模块（需要自行配置：例如使用 `optimization.splitChunks` 为页面间共享的应用程序代码创建 bundle）。
2. 所谓基于 webpack 实现多页面应用，简单来将就是基于多个 entry，将 js 代码分为多个 entry 入口文件。

```js
module.exports = {
	// 1.此时仅仅是根据这三条配置打成了三个chunk包：pageOne.js/pageTwo.js/pageThree.js
	entry: {
		pageOne: "./src/pageOne/index.js",
		pageTwo: "./src/pageTwo/index.js",
		pageThree: "./src/pageThree/index.js",
	},
	// 2.还要配合htmlWebpackPlugin，把上面的三个chunk分别生成到对应的html文件里，才算是实现多入口。要生成几个html就调几遍。
	// 缺点是：如果只改动了其中一个chunk，其他chunk也要重新打包。
	plugins: [
		new htmlWebpackPlugin({
			filename: "pageOne.html",
			chunks: ["pageOne"],
			template: path.resolve(__dirname, "../public/index.html"),
		}),
		new htmlWebpackPlugin({
			filename: "pageTwo.html",
			chunks: ["pageTwo"],
			template: path.resolve(__dirname, "../public/index.html"),
		}),
		new htmlWebpackPlugin({
			filename: "pageThree.html",
			chunks: ["pageThree"],
			template: path.resolve(__dirname, "../public/index.html"),
		}),
	],
};
```

3. 单页 SPA：指只有一个主页面的应用，浏览器一开始要加载所有必须的 html, js, css。所有的页面内容都包含在这个所谓的主页面中。但在写的时候，还是会分开写（页面片段），然后在交互的时候由路由程序动态载入，单页面的页面跳转，仅刷新局部资源。
