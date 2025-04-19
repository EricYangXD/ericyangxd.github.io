---
title: Webpack Plugins & Loaders
author: EricYangXD
date: "2021-12-29"
---

- 用法基本都一样：

```js
module.exports = {
  mode: "development",
  devtool: "eval-cheap-module-source-map",
  entry: {
    // 多入口
    main: path.join(process.cwd(), "src/app"),
    app: path.join(process.cwd(), "apps/app"),
  },
  output: {
    pathinfo: false,
    path: path.join(process.cwd(), "build"),
    filename: "static/js/[name].bundle.js",
    chunkFilename: "static/js/[name].chunk.js",
    publicPath: "/",
  },
  resolve: {
    symlinks: false,
    alias: {
      // 配置路径别名
      api: joinRootPath("src/api"),
      utils: joinRootPath("src/utils"),
      "@": joinRootPath("src"),
    },
    modules: ["node_modules", "src", "framework/src", "apps"],
    extensions: [".js", ".jsx", ".ts", ".tsx"],
    mainFields: ["browser", "module", "main"],
  },
  optimization: {
    // 开发环境开启tree-shaking 三选一
    usedExports: true, // true: 开发环境开启tree-shaking - 1
    minimize: false, // true: 开发环境开启tree-shaking - 2  告知 webpack 使用 TerserPlugin 或其它在 optimization.minimizer定义的插件压缩 bundle。
    minimizer: [
      new TerserPlugin({
        parallel: true,
        terserOptions: {
          // https://github.com/webpack-contrib/terser-webpack-plugin#terseroptions
        },
      }),
      // 函数形式
      (compiler) => {
        const TerserPlugin = require("terser-webpack-plugin");
        new TerserPlugin({
          /* 你的配置 */
        }).apply(compiler);
      },
    ], // 开发环境开启tree-shaking - 3
    moduleIds: "deterministic", // 告知 webpack 当选择模块 id 时需要使用哪种算法。deterministic-被哈希转化成的小位数值模块名。natural-按使用顺序的数字 id。named-对调试更友好的可读的 id。size-专注于让初始下载包大小更小的数字 id。
    chunkIds: "deterministic", // 类似moduleIds，告知 webpack 当选择模块 id 时需要使用哪种算法。多了一项：'total-size'-专注于让总下载包大小更小的数字 id。
    sideEffects: true, // 告知 webpack 去辨识 package.json 中的副作用标记或规则（默认值为 true，所以这一步也可以不设置）
    splitChunks: {
      chunks: "all",
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendors",
          chunks: "all",
        },
      },
    },
  },
  module: {
    // loaders
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: "ts-loader",
            options: {
              transpileOnly: true,
            },
          },
        ],
      },
      // ...
      {
        test: /\.(js|ts)x?$/,
        include: [path.resolve("src"), path.resolve("framework"), path.resolve("apps")],
        use: {
          loader: require.resolve("babel-loader"),
          options: {
            cacheDirectory: true,
          },
        },
      },
      {
        test: /\.css$/,
        use: [require.resolve("style-loader"), require.resolve("css-loader")],
      },
      {
        test: /\.less$/,
        use: [
          require.resolve("style-loader"),
          require.resolve("css-loader"),
          {
            loader: require.resolve("less-loader"),
            options: {
              modifyVars: theme,
              javascriptEnabled: true,
            },
          },
        ],
      },
      {
        test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/, /\.mov$/, /\.mp4$/],
        use: {
          loader: require.resolve("url-loader"),
          options: {
            limit: 10 * 1024,
            name: "static/images/[name].[hash:8].[ext]",
          },
        },
      },
      {
        test: [/\.mov$/, /\.mp4$/],
        use: {
          loader: require.resolve("file-loader"),
          options: {
            name: "static/videos/[name].[hash:8].[ext]",
          },
        },
      },
      {
        test: /\.(eot|otf|ttf|woff|woff2)$/,
        use: {
          loader: "file-loader",
          options: {
            name: "static/fonts/[name].[hash:8].[ext]",
          },
        },
      },
      {
        test: /\.svg$/,
        use: {
          loader: require.resolve("file-loader"),
          options: {
            name: "static/svgs/[name].[hash:8].[ext]",
          },
        },
      },
      // 更多loader
    ],
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      // 有几个入口就配几遍
      inject: true,
      chunks: ["main"], // 配置打包后的chunk名
      favicon: path.join(process.cwd(), "public/favicon.png"), // 配置浏览器图标
      template: joinRootPath("src/index.development.html"), // 配置index.html
      filename: "main.html",
      scriptLoading: "blocking", // 脚本加载方式
      // 对于不参与打包的第三方模块通过CDN在html中引入
      cdn: {
        js: [
          "https://code.jquery.com/jquery-3.6.0.min.js",
          "https://unpkg.com/react/umd/react.production.min.js",
          "https://unpkg.com/react-dom/umd/react-dom.production.min.js",
        ],
      },
    }),
    // 这个也可以，对于不参与打包的第三方模块通过CDN在html中引入
    new HtmlWebpackTagsPlugin({
      tags: [
        "https://code.jquery.com/jquery-3.6.0.min.js",
        "https://unpkg.com/react/umd/react.production.min.js",
        "https://unpkg.com/react-dom/umd/react-dom.production.min.js",
      ],
      append: true, // 将标签添加到末尾
    }),
    new HtmlWebpackPlugin({
      // 有几个入口就配几遍
      inject: true,
      chunks: ["app"], // 配置打包后的chunk名
      favicon: path.join(process.cwd(), "public/favicon.png"), // 配置浏览器图标
      template: joinRootPath("src/index.development.html"), // 配置index.html
      filename: "app.html",
    }),
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: JSON.stringify("development"),
      },
    }),
    new webpack.DllReferencePlugin({
      context: process.cwd(),
      manifest: require.resolve(path.join(process.cwd(), "node_modules/robor-vender-dll/manifest.json")),
    }),
    new MomentLocalesPlugin({
      localesToKeep: ["es-us", "zh-cn"],
    }),
    new ForkTsCheckerWebpackPlugin({
      async: true,
      reportFiles: ["src/**/*.{ts,tsx}"],
    }),
    new BundleAnalyzerPlugin(),
    // new ProgressBarPlugin(),
    new WebpackBar({
      // profile: true,
      name: require(path.join(process.cwd(), "package.json")).name || "client",
    }),
  ],
  // 配置 externals
  externals: {
    // { 'moduleName': 'globalVariable' }
    // 例如：将 jQuery 和 React 从打包中排除，使用 CDN
    jquery: "jQuery",
    react: "React",
    vue: "Vue",
    "react-dom": "ReactDOM",
  },
};
```

## TypeScript

### ForkTsCheckerWebpackPlugin

- 这个插件会在另外一个进程中做相关的类型检查。

## webpack 自带

### webpack.HotModuleReplacementPlugin

### webpack.DefinePlugin

- 该插件将"production"替换到 `process.env.NODE_ENV`。
- UglifyJS 会移除掉所有的 if 分支，因为`"production" !== "production"`永远返回 false。

### webpack.DllReferencePlugin

## webpack 三方

### html-webpack-plugin

- 作用：作用是当使用 webpack 打包时，创建一个 html 文件，并把 webpack 打包后的静态文件自动插入到这个 html 文件当中。html-webpack-plugin 默认将会在 output.path 的目录下创建一个 index.html 文件， 并在这个文件中插入一个 script 标签，标签的 src 为 output.filename。(将打包后的 js 资源注入 html 中)。

- 注入的原理为当打包器已生成 entryPoint 文件资源后，获得其文件名及 publicPath，并将其注入到 html 中

```js
class HtmlWebpackPlugin {
  constructor(options) {
    this.options = options || {};
  }

  apply(compiler) {
    const webpack = compiler.webpack;

    compiler.hooks.thisCompilation.tap("HtmlWebpackPlugin", (compilation) => {
      // compilation 是 webpack 中最重要的对象，文档见 [compilation-object](https://webpack.js.org/api/compilation-object/#compilation-object-methods)

      compilation.hooks.processAssets.tapAsync(
        {
          name: "HtmlWebpackPlugin",

          // processAssets 处理资源的时机，此阶段为资源已优化后，更多阶段见文档
          // https://webpack.js.org/api/compilation-hooks/#list-of-asset-processing-stages
          stage: webpack.Compilation.PROCESS_ASSETS_STAGE_OPTIMIZE_INLINE,
        },
        (compilationAssets, callback) => {
          // compilationAssets 将得到所有生成的资源，如各个 chunk.js、各个 image、css

          // 获取 webpac.output.publicPath 选项，(PS: publicPath 选项有可能是通过函数设置)
          const publicPath = getPublicPath(compilation);

          // 本示例仅仅考虑单个 entryPoint 的情况
          // compilation.entrypoints 可获取入口文件信息
          const entryNames = Array.from(compilation.entrypoints.keys());

          // entryPoint.getFiles() 将获取到该入口的所有资源，并能够保证加载顺序！！！如 runtime-chunk -> main-chunk
          const assets = entryNames.map((entryName) => compilation.entrypoints.get(entryName).getFiles()).flat();
          const scripts = assets.map((src) => publicPath + src);
          const content = html({
            title: this.options.title || "Demo",
            scripts,
          });

          // emitAsset 用以生成资源文件，也是最重要的一步
          compilation.emitAsset("index.html", new webpack.sources.RawSource(content));
          callback();
        }
      );
    });
  }
}
```

### webpack-bundle-analyzer

### progress-bar-webpack-plugin

### webpackbar

### speed-measure-webpack-plugin

### moment-locales-webpack-plugin

### @vue/preload-webpack-plugin

### vue-lazy-compile-webpack-plugin

### hard-source-webpack-plugin

为打包后的模块提供缓存，且缓存到本地硬盘上。默认的缓存路径是：`node_modules/.cache/hard-source`。

### require('webpack-bundle-analyzer').BundleAnalyzerPlugin

### copy-webpack-plugin

### ssh-webpack-plugin

### script-ext-html-webpack-plugin

### offline-plugin

### compression-webpack-plugin

### terser-webpack-plugin

### autodll-webpack-plugin

### mini-css-extract-plugin

将 CSS 单独抽离出来，以便单独加载 CSS 资源。在 Webpack 工作流中，首先利用 MiniCssExtractPlugin 将所有 CSS 文件抽离成独立文件，然后借助下述提到的任何一个压缩工具对其进行进一步优化；与此同时，可以运行 PurifyCSS 或 UnCSS 来进行代码剪枝，确保只保留真正需要的样式规则。

### optimize-css-assets-webpack-plugin

CSS 代码压缩，该插件可以在生产模式下自动压缩 CSS 文件，并且兼容其他类型的资源优化插件。安装后，只需将其添加到 Webpack 配置中的 optimization.minimizer 数组即可启用压缩功能。

### css-minimizer-webpack-plugin

CSS 代码压缩，随着 Webpack 5 的到来，推荐使用`css-minimizer-webpack-plugin`来替代旧版本中的`optimize-css-assets-webpack-plugin`进行 CSS 压缩。此插件同样依赖于 cssnano 作为其内部引擎之一，提供了更好的性能和更丰富的特性集。

### CssNano

CSS 代码压缩，一个基于 PostCSS 的 CSS 优化工具，它能够在保持 CSS 代码语义不变的情况下，执行一系列优化操作，如删除多余的空白符及注释、简化选择器等，以确保最终生成的 CSS 文件尽可能小。此外，CssNano  还支持多种配置选项，允许开发者根据项目需求调整优化级别。

### PurifyCSS 

CSS 代码剪枝，是一款专门用来清除未使用 CSS 代码的工具。它可以分析 HTML 文档并与之关联的 CSS 文件对比，识别出哪些样式规则实际上并未被应用，进而将这些冗余部分从最终输出中剔除。这种方式不仅有助于减小文件体积，还能改善浏览器渲染效率。

### UnCSS

也是一个能够检测并移除网页中未引用 CSS 规则的工具。

## webpack5

### 使用 webpack 配置进行项目的打包优化

#### 1. 提取公共代码

提取公共代码一般用于多入口的情况，为防止重复打包而进行的优化操作，好处是可以减少文件体积，加快打包和启动速度。

1. 配置 optimization.splitChunks.cacheGroups 实现提取公共代码；
2. 利用 externals 提取第三方库。准确来说应是该通过 externals 配置告诉 webpack 哪些第三方库不需要打包到 bundle 中，实际开发中有一些第三方库（如 jQuery）,如果我们在项目中使用以下代码引入，打包时 jQuery 就会被打包到最终的 bundle 中。但有时我们更希望使用 CDN 来引入 jQuery，webpack 给我们提供的 externals 可以轻松实现，步骤如下：
   - 在 html 文件中引入 cdn 库链接
   - webpack 配置：`module.exports.externals.jquery='jQuery';`
   - 然后正常引入使用 jQuery 即可
3. 提取 css 公共代码。`css-loader`与`style-loader`只是把 css 样式写入到 html 页面的 style 标签内，如果是 SPA 单页面应用，这没什么问题，但如果是多页面应用，则会在每个页面中都写入这样 css 样式，那我们能不能把这些相同的部分提取出来，然后使用 link 去引入页面呢？答案是肯定的，只需要使用`mini-css-extract-plugin`插件就可以实现。`MiniCssExtractPlugin.loader`放在`css-loader`的左边，替换`style-loader`。

#### 2. 压缩代码

实现删除多余的代码、注释、简化代码的写法等⽅式。

1. 压缩 JS。Webpack 默认在生产环境下（`mode:'production'`）自动进行代码压缩，内部用的是`terser-webpack-plugin`插件。
2. 压缩 css。要压缩 css，前提是先提取 css 到独立文件中（前面讲过），然后通过`css-minimizer-webpack-plugin`插件实现压缩 CSS，该插件基于`cssnano`实现 css 代码的压缩优化。注意该插件不是写在 plugins 中，而是写在优化配置`optimization.minimizer`中，且 mode 必须为 production。

#### 3. Tree Shaking

1. Tree Shaking 也叫摇树优化，是一种通过移除冗余代码，来优化打包体积的手段，它并不是 webpack 中的某个配置选项，而是一组功能搭配使用后的效果，基于 ESModules 模块化（即只有 ESModules 的模块化代码才能使 Tree Shaking 生效），在 `production` 生产环境下默认开启。
2. 对于依赖库，尽量使用 es 版本，如 lodash-es...方便做 tree-shaking。
3. 不开启`production`模式的情况下一步步实现 tree-shaking：
   1. `usedExports`: 只导出被使用的成员。`optimization.usedExports=true`
   2. `minimize`: 压缩后删除不被使用的代码。`optimization.minimize=true`
   3. `concatenateModules`: 尽可能合并每一个模块到一个函数中。正常的打包效果是每个模块代码都放在一个单独的函数中，如果引入的模块很多就会出现很多函数，这样会影响执行效率和打包后的文件体积大小，可以通`concatenateModules:true`把多个模块的代码合并到一个函数中。
   4. `sideEffects`: 指定副作用代码。Tree Shaking 会自动删除模块中一些没有被引用的代码，但这个行为在某些场景下可能会出现问题，比如`extend.global.js`模块代码如下:

```js
// extend.global.js
// 实现首字母大写
String.prototype.capitalize = function () {
  return this.split(/\s+/)
    .map(function (item) {
      return item[0].toUpperCase() + item.slice(1);
    })
    .join(" ");
};

// index.js
import "./extend.global.js";
"hello boy".capitalize(); // Hello Boy
```

Webpack4 默认把所有的代码看作副作用代码，所以会把所有的代码都打包到最终结果中，当然这样的后果是会把一些多余的代码也打包进来导致文件过大。而 Webpack5 默认开启 Tree Shaking，前面已经说到了，Tree Shaking 功能会自动删除无引用的代码，上面的代码没有任何导出和使用，所以 Webpack5 不会把 extend.global.js 中的代码打包进来，结果会导致找不到 capitalize()方法而报错，sideEffect 就是用来解决此类问题的，用法分两步，代码如下：

- 1. `optimization.sideEffects`设置为 true：告知 webpack 去辨识 package.json 中的副作用标记或规则（默认值为 true，所以这一步也可以不设置）；
- 2. package.json 添加 sideEffects 属性，可以为以下值：
  - 1. true: 告诉 webpack 所有的模块都是副作用模块
       > 如设置为 true，上面的 extend.global.js 会被打包到最终结果
  - 2. false: 告诉 webpack 所有的模块都没有副作用
       > 如设置为 false，上面的 extend.global.js 不会被打包到最终结果，代码就会报错
  - 3. Array: 手动指定副作用文件
       > 使用 true 或 false 会走向两个极端，不一定适合真实的开发场景，可以设置数组来指定副作用文件，代码如下：

```js
{
  sideEffects: ["*.css", "*.global.js"];
}
```

配置后，webpack 打包时遇到 css 文件或以 global.js 结尾的文件时会自动打包到最终结果。

#### 4. Code Splitting 代码分割

把项目中的资源模块按照我们设定的规则打包到不同的文件中，代码分割后可以降低应用启动成本，提高响应速度。

1. 配置多入口，输出多个打包文件。
   - 解决重复打包问题。使用 dependOn 和 splitChunks 两种方法解决重复打包问题：
   1. dependOn: 通过修改 entry 入口配置实现，利用 dependOn 的提取公共的 lodash。每个入口配置里加上`dependOn:'common自定义公共模块名称'`。
   2. Webpack 内置功能 splitChunks（推荐）。`optimization.splitChunks.chunks='all'`。initial: 初始块，async: 按需加载块(默认)，all: 全部块。
   3. 注意：不管使用哪种方式，如果是多页面应用，为防止 html 文件重复引入，都需要在 html-webpack-plugin 插件中配置 chunks 选项。
2. ESModules 动态导入（Dynamic Imports）。使用 ECMAScript2019（ES10）推出的 import()动态引入模块，返回 Promise 对象。

- 注意：用 import()动态引入的模块跟通过 import ... from ...静态引入的模块不同处在于模块不会直接写在 html 文件中，而是在打开页面时才引入，配合用户的行为（如点击等操作）就已经能实现懒加载功能了。
- 生成的公共模块文件名很长（随着模块的增多会更长），我们可以使用 webpack 的魔法注释 来解决这个问题：`import(/*webpackChunkName:'common'*/'lodash').then(({default:_})=>{})`。

3. PS: 利用 Webpack 的魔法注释还能实现预加载功能，只需要添加 webpackPrefetch:true 即可：
   - 懒加载：进入页面时不加载，使用到某个模块的时候才加载的方式。
   - 预加载：进入页面时先加载，使用时直接调用的方式。
   - Webpack 的预加载是在页面其它内容全部加载完成后才加载需要的模块，所以不会影响页面的加载速度。

## 手写简单 webpack 插件

### 修改打包时的 HTML 的插件

```js
// 打包时，把HTML中的config修改为对应环境的json。
class CustomHtmlPlugin {
  constructor(options = {}) {
    this.options = options;
  }

  apply(compiler) {
    const replacements = this.options.replacements || {};
    compiler.hooks.compilation.tap("CustomHtmlPlugin", (compilation) => {
      compilation.hooks.htmlWebpackPluginAfterHtmlProcessing.tapPromise("CustomHtmlPlugin", (data) => {
        let html = data.html;
        return new Promise((resolve) => {
          Object.keys(replacements).forEach((key) => {
            // key = key.replace(/\s*/g, '');
            let value = replacements[key];
            if (typeof value !== "string") {
              value = JSON.stringify(value);
            }
            html = html.replace(new RegExp("{{" + key + "}}", "g"), value);
          });
          data.html = html;
          resolve(data);
        });
      });
    });
  }
}

module.exports = CustomHtmlPlugin;
```

## Plugin Table

| Name                                | Description                                                |
| :---------------------------------- | :--------------------------------------------------------- |
| AggressiveSplittingPlugin           | 将原来的 chunk 分成更小的 chunk                            |
| BabelMinifyWebpackPlugin            | 使用 babel-minify 进行压缩                                 |
| BannerPlugin                        | 在每个生成的 chunk 顶部添加 banner                         |
| CommonsChunkPlugin                  | 提取 chunks 之间共享的通用模块                             |
| CompressionWebpackPlugin            | 预先准备的资源压缩版本，使用 Content-Encoding 提供访问服务 |
| ContextReplacementPlugin            | 重写 require 表达式的推断上下文                            |
| CopyWebpackPlugin                   | 将单个文件或整个目录复制到构建目录                         |
| DefinePlugin                        | 允许在编译时(compile time)配置的全局常量                   |
| DllPlugin                           | 为了极大减少构建时间，进行分离打包                         |
| EnvironmentPlugin                   | DefinePlugin 中 process.env 键的简写方式。                 |
| ExtractTextWebpackPlugin            | 从 bundle 中提取文本（CSS）到单独的文件                    |
| HotModuleReplacementPlugin          | 启用模块热替换(Enable Hot Module Replacement - HMR)        |
| HtmlWebpackPlugin                   | 简单创建 HTML 文件，用于服务器访问                         |
| I18nWebpackPlugin                   | 为 bundle 增加国际化支持                                   |
| IgnorePlugin                        | 从 bundle 中排除某些模块                                   |
| LimitChunkCountPlugin               | 设置 chunk 的最小/最大限制，以微调和控制 chunk             |
| LoaderOptionsPlugin                 | 用于从 webpack 1 迁移到 webpack 2                          |
| MinChunkSizePlugin                  | 确保 chunk 大小超过指定限制                                |
| NoEmitOnErrorsPlugin                | 在输出阶段时，遇到编译错误跳过                             |
| NormalModuleReplacementPlugin       | 替换与正则表达式匹配的资源                                 |
| NpmInstallWebpackPlugin             | 在开发时自动安装缺少的依赖                                 |
| ProvidePlugin                       | 不必通过 import/require 使用模块                           |
| SourceMapDevToolPlugin              | 对 source map 进行更细粒度的控制                           |
| EvalSourceMapDevToolPlugin          | 对 eval source map 进行更细粒度的控制                      |
| UglifyjsWebpackPlugin               | 可以控制项目中 UglifyJS 的版本                             |
| ZopfliWebpackPlugin                 | 通过 node-zopfli 将资源预先压缩的版本                      |
| webpack-deadcode-plugin             | 移除项目中的无效引用文件和导出                             |
| webpack-remove-serviceworker-plugin | 移除项目中的 service worker                                |

- 更多插件参考[https://webpack.js.org/awesome-webpack/](https://webpack.js.org/awesome-webpack/)

## Babel

1. Babel 是一个 JavaScript 编译器。
2. Babel 是一个工具链，主要用于将采用 ECMAScript 2015+ 语法编写的代码转换为向后兼容的 JavaScript 语法，以便能够运行在当前和旧版本的浏览器或其他环境中。
   - 语法转换
   - 通过 Polyfill 方式在目标环境中添加缺失的特性 （通过引入第三方 polyfill 模块，例如 `core-js`）
   - 源码转换（codemods）
3. Babel 不做类型检查，你仍然需要安装 Flow 或 TypeScript 来执行类型检查的工作。

### 在项目中使用 babel

[参考](https://mp.weixin.qq.com/s/qCJXhfd5ZBkpqV4bs_nY6w)

1. 安装：`npm install --save-dev @babel/core @babel/cli @babel/preset-env`
   - Babel 的核心功能包含在 `@babel/core` 模块中。
   - `@babel/cli` 是一个能够从终端（命令行）使用的工具。
   -
2. 在项目的根目录下创建一个命名为 `babel.config.json` 的配置文件:(如果你使用的是 Babel 的旧版本，则文件名为 `babel.config.js`):

```json
{
  "presets": [
    // runs from right to left
    [
      "@babel/preset-env",
      {
        "useBuiltIns": "usage", // transform new features & apis
        "corejs": {
          "version": 3,
          "proposals": true // stage polyfill
        },
        "loose": true,
        "targets": {
          // "ie": "11",
          // "edge": "17",
          // "firefox": "60",
          "chrome": "61"
          // "safari": "11.1",
          // "node": "12.19",
          // "> 0.25%, not dead",
        }
      }
    ],
    "@babel/preset-typescript"
  ],
  "plugins": [
    // runs from left to right
    [
      "@babel/plugin-transform-runtime",
      {
        "corejs": 2
      }
    ]
    // "@babel/plugin-proposal-class-properties"
    // "@babel/plugin-proposal-object-rest-spread"

    // npm install --save-dev @babel/plugin-transform-runtime
    // @babel/runtime 是要安装到生产依赖的，因为新特性的编译需要从这个包里引用 polyfill
    // 不错，它就是一个封装了 corejs 的 polyfill 包
    // npm install --save @babel/runtime
    // 引入的 polyfill 不再是全局范围内的了，而是模块作用域范围内的；
    // 通过引用的方式，既解决了全局变量污染的问题，又减小了编译后包的体积。
  ]
}
```

```js
const presets = [
	[
		"@babel/preset-env",
		{
			targets: {
        "ie": "11",
				edge: "17",
				firefox: "60",
				chrome: "67",
				safari: "11.1",
        node: "12.19",
        "> 0.25%, not dead",
			},
			useBuiltIns: "usage", // 只引入用到的/需要的polyfill
			corejs: "3.6.4",
		},
	],
];
module.exports = { presets };
```

3. 运行此命令将 src 目录下的所有代码编译到 lib 目录：

```shell
./node_modules/.bin/babel src --out-dir lib
```

这将解析 src 目录下的所有 JavaScript 文件，并应用我们所指定的代码转换功能，然后把每个文件输出到 lib 目录下。由于我们还没有指定任何代码转换功能，所以输出的代码将与输入的代码相同（不保留原代码格式）。我们可以将我们所需要的代码转换功能作为参数传递进去。

可以通过 `--help` 参数来查看命令行工具所能接受的所有参数列表。但是现在对我们来说最重要的是 `--plugins` 和 `--presets` 这两个参数。

你可以利用 `npm@5.2.0` 所自带的 npm 包运行器将 `./node_modules/.bin/babel` 命令缩短为 `npx babel`。

4. 需要使用相应的插件，来对代码进行转换，例如将代码中的所有箭头函数（arrow functions）都转换为 ES5 兼容的函数表达式：

```shell
npm install --save-dev @babel/plugin-transform-arrow-functions

./node_modules/.bin/babel src --out-dir lib --plugins=@babel/plugin-transform-arrow-functions
```

5. 我们不需要一个接一个地添加所有需要的插件，我们可以使用一个 "preset" （即一组预先设定的插件）。就像插件一样，你也可以根据自己所需要的插件组合创建一个自己的 preset 并将其分享出去。对于当前的用例而言，我们可以使用一个名称为 `env` 的 preset，即`@babel/preset-env`。

```shell
npm install --save-dev @babel/preset-env

./node_modules/.bin/babel src --out-dir lib --presets=@babel/env
```

如果不进行任何配置，上述 preset 所包含的插件将支持所有最新的 JavaScript （ES2015、ES2016 等）特性。但是 preset 也是支持参数的。

**我们来看看另一种传递参数的方法：配置文件，而不是通过终端控制台同时传递 cli 和 preset 的参数。**

根据你的需要，可以通过几种不同的方式来使用配置文件。

6. 如上第 2 步中所示，首先创建一个名为 babel.config.json 的文件（需要 v7.8.0 或更高版本），并包含 presets 字段及相应配置。此时，名为 `env` 的 preset 只会为目标浏览器中没有的功能加载转换插件。

7. 从 `Babel 7.4.0` 版本开始，这个软件包`@babel/polyfill`已经不建议使用了，建议直接包含 `core-js/stable` （用于模拟 ECMAScript 的功能）。

`@babel/polyfill` 模块包含 `core-js` 和一个自定义的 `regenerator runtime` 来模拟完整的 ES2015+ 环境。`npm install --save @babel/polyfill`，这个 lib 包含所有 js 的新特性，所以如果你确切知道你需要的是哪个特性，那么可以直接从`core-js`中引入，或者使用插件`babel-plugin-transform-runtime`。

8. 如果我们不使用将 "useBuiltIns" 参数设置为 "usage" （默认值是 "false"）的 env 预设的话，那么我们必须在所有代码之前利用 require 加载一次完整的 polyfill。比如可以在`main.js`中引入`import "core-js/stable";`（适用于`Babel 7.4.0` 版本以后）。

9. 总结：我们使用 `@babel/cli` 从终端运行 Babel，利用 `@babel/polyfill` 来模拟所有新的 JavaScript 功能，而 `env` preset 只对我们所使用的并且目标浏览器中缺失的功能进行代码转换和加载 polyfill。

10. 配置插件和预设时最好写全名称：加上`preset- or plugin-`。

11. 官方提供的预设，我们已经针对常用环境编写了一些预设（preset）：

    - @babel/preset-env for compiling ES2015+ syntax
    - @babel/preset-typescript for TypeScript
    - @babel/preset-react for React
    - @babel/preset-flow for Flow

12. 如需创建一个自己的预设（无论是为了本地使用还是发布到 npm），需要导出（export）一个配置对象。也可以是返回一个插件数组。preset 可以包含其他的 preset，以及带有参数的插件。Preset 是逆序排列的（从后往前执行）。

```javascript
// 1.
module.exports = function () {
	return {
		plugins: ["pluginA", "pluginB", "pluginC"],
	};
};
// 2.
module.exports = () => ({
	presets: [require("@babel/preset-env")],
	plugins: [
		[require("@babel/plugin-proposal-class-properties"), { loose: true }],
		require("@babel/plugin-proposal-object-rest-spread"),
	],
});
// 3. 如果不指定参数，下面这几种形式都是一样的：
{
  "presets": [
    "presetA", // bare string
    ["presetA"], // wrapped in array
    ["presetA", {}] // 2nd argument is an empty options object
  ]
}
// 4. 要指定参数，请传递一个以参数名作为键（key）的对象。
{
  "presets": [
    [
      "@babel/preset-env",
      {
        "loose": true,
        "modules": false
      }
    ]
  ]
}
```

13. 插件顺序：如果两个转换插件都将处理“程序（Program）”的某个代码片段，则将根据转换插件或 preset 的排列顺序依次执行。
    - 插件在 Presets 前运行。
    - 插件顺序从前往后排列。
    - Preset 顺序是颠倒的（从后往前）。
    - 插件参数同 preset 设置的形式一样，也是那三种形式：`{"plugins": ["pluginA", ["pluginB"], ["pluginC", {}]]}`。

### babel.config.js 与 babelrc.js 的区别

1. babelrc 只会影响本项目中的代码
2. babel.config.js 会影响整个项目中的代码，包含 node_modules 中的代码
3. 推荐使用 babel.config.js

### @babel/preset-env

转换 ES6 语法成 ES5 的语法。

```js
// babelrc.js
module.exports = {
  presets: [
    [
      "@babel/env",
      {
        useBuiltIns: "entry", // "usage" | "entry" | false, defaults to false.
        targets: {
          chrome: "58",
          ie: "11",
        },
        bugfixes: false,
        spec: false,
        loose: false,
        debug: false,
        include: [],
        exclude: [],
        modules: "auto", // "amd" | "umd" | "systemjs" | "commonjs" | "cjs" | "auto" | false,defaults to "auto".
      },
    ],
  ],
  plugins: [],
};
```

### @babel/preset-typescript

`npm install --save-dev @babel/preset-typescript`

## Loader

### css-loader

css-loader 的原理就是 postcss，借用 postcss-value-parser 解析 CSS 为 AST，并将 CSS 中的 url() 与 @import 解析为模块。

### style-loader

style-loader 用以将 CSS 注入到 DOM 中，原理为使用 DOM API 手动构建 style 标签，并将 CSS 内容注入到 style 中。

```js
module.exports = function (source) {
  return `
    function injectCss(css) {
      const style = document.createElement('style');
      // 把css当成文本节点插入到style标签里
      style.appendChild(document.createTextNode(css));
      document.head.appendChild(style);
    }

    injectCss(\`${source}\`);
  `;
};
```

### sass-loader

处理.scss 文件

### less-loader

处理.less 文件

### stylus-loader

处理.styl 文件

### ts-loader

处理.ts、.tsx 文件。这是用于 webpack 的 TypeScript 加载器，将 TypeScript 编译成 JavaScript。

ts-loader 在内部是调用了 TypeScript 的官方编译器 -- tsc。所以，ts-loader 和 tsc 是共享 tsconfig.json。

有两种类型的 Options：TypeScript options（也称为 “编译器 options” ）和 loader options。TypeScript options 应该通过 tsconfig.json 文件设置。loader options 可以通过 webpack 配置中的 options 属性指定：配合`fork-ts-checker-webpack-plugin`可以补全类型检查的功能。

```js
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
module.exports = {
  ...
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true // 只做语言转换，而不做类型检查
            }
          }
        ]
      }
    ],
    plugins:[
    ...
    new ForkTsCheckerWebpackPlugin()
  ]
  }
}
```

如何选择 TypeScript 编译工具:

1. 如果没有使用 Babel，首选 TypeScript 自带编译器（配合 `ts-loader` 使用）
2. 如果项目中有 Babel，安装 `@babel/preset-typescript`，配合 tsc 做类型检查。
3. 两种编译器不要混用。

### awesome-typescript-loader

处理.ts、.tsx 文件，已废弃（推荐直接使用 babel 或者 ts-loader），但是在很多 Angular 历史项目中都有用到。主要是为了加快项目中的编译速度。

- 与 ts-loader 的主要区别：
  1.  更适合与 Babel 集成，使用 Babel 的转义和缓存。
  2.  不需要安装独立的插件，就可以把类型检查放在独立进程中。

#### 错误提示不显示具体位置的处理

- 对于某些版本，打包时只提示有 error 但是不显示具体 error 内容，需要手动修改 node_modules 中的代码，步骤如下：

  1. go to `node_modules/awesome-typescript-loader/dist/instance.js`
  2. find statement: `console.error(colors.red("\n[" + instanceName + "] Checking finished with " + diags.length + " errors"));`，找到类似的这句，可能不同版本略有不同。(可以搜`chalk_1.default.red`试试先)
  3. Add right below it (inside the same 'if'):在与上面这句相同的 if 判断里加上下面这句：

```js
// diags.map( function (diag) {
//      console.error(colors.red(diag.pretty));
// });
diags.map(function (diag) {
  console.error(chalk_1.default.red(diag.pretty)); // 这个打印的方法'chalk_1.default.red'看具体的上下文，根据版本会有所不同
});
```

- [check here for info](https://github.com/s-panferov/awesome-typescript-loader/issues/347#issuecomment-315677010)

### url-loader

对资源文件进行优化的加载器，可以解决图片等资源文件的引用路径问题，并可以根据 limit 设置把小图片一 dataURI 的方式保存，依赖`file-loader`

### thread-loader

多进程打包，某个任务消耗时间较长会卡顿，多进程可以同一时间干多件事，效率更高。属于打包优化。

1. `thread-loader`会对其后面的 loader（比如`babel-loader`）开启多进程打包。
2. 进程启动大概为 600ms，进程通信也有开销。(启动的开销比较昂贵，不要滥用)。
3. 只有工作消耗时间比较长，才需要多进程打包。
4. `thread-loader`必须最后执行，再次说明 **loader 是从下往上，从右往左的执行顺序**，所以想要使用`thread-loader`优化某项的打包速度，必须放在其后执行。
5. 当项目较小时，使用多进程打包反而造成打包时间延长，因为进程之间通信产生的开销比多进程能够节约的时间更长。

### vue-loader

加载并编译.vue 单文件组件
