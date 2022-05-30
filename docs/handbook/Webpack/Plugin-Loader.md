---
title: Webpack Plugins & Loaders
author: EricYangXD
date: "2021-12-29"
---

-   用法基本都一样：

```js
module.exports = {
  mode: 'development',
  devtool: 'cheap-module-eval-source-map',
  entry: { // 多入口
    main: path.join(process.cwd(), 'src/app'),
    app: path.join(process.cwd(), 'apps/app'),
  },
  output: {
    pathinfo: false,
    path: path.join(process.cwd(), 'build'),
    filename: 'static/js/[name].bundle.js',
    chunkFilename: 'static/js/[name].chunk.js',
    publicPath: '/',
  },
  resolve: {
    symlinks: false,
    alias: { // 配置路径别名
      api: joinRootPath('src/api'),
      utils: joinRootPath('src/utils'),
      '@': joinRootPath('src'),
    },
    modules: ['node_modules', 'src', 'framework/src', 'apps'],
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
    mainFields: ['browser', 'module', 'main'],
  },
  optimization: {
    minimize: false,
    moduleIds: 'deterministic', // 确定的
  },
  module: { // loaders
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true
            }
          }
        ]
      },
      ...
      {
        test: /\.(js|ts)x?$/,
        include: [path.resolve('src'), path.resolve('framework'), path.resolve('apps')],
        use: {
          loader: require.resolve('babel-loader'),
          options: {
            cacheDirectory: true,
          },
        },
      },
      {
        test: /\.css$/,
        use: [require.resolve('style-loader'), require.resolve('css-loader')],
      },
      {
        test: /\.less$/,
        use: [
          require.resolve('style-loader'),
          require.resolve('css-loader'),
          {
            loader: require.resolve('less-loader'),
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
          loader: require.resolve('url-loader'),
          options: {
            limit: 10 * 1024,
            name: 'static/images/[name].[hash:8].[ext]',
          },
        },
      },
      {
        test: [/\.mov$/, /\.mp4$/],
        use: {
          loader: require.resolve('file-loader'),
          options: {
            name: 'static/videos/[name].[hash:8].[ext]',
          },
        },
      },
      {
        test: /\.(eot|otf|ttf|woff|woff2)$/,
        use: {
          loader: 'file-loader',
          options: {
            name: 'static/fonts/[name].[hash:8].[ext]',
          },
        },
      },
      {
        test: /\.svg$/,
        use: {
          loader: require.resolve('file-loader'),
          options: {
            name: 'static/svgs/[name].[hash:8].[ext]',
          },
        },
      },
      // 更多loader
    ],
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({ // 有几个入口就pei'ji'bian
      inject: true,
      chunks: ['main'], // 配置打包后的chunk名
      favicon: path.join(process.cwd(), 'public/favicon.png'), // 配置浏览器图标
      template: joinRootPath('src/index.development.html'), // 配置index.html
      filename: 'index.html',
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('development'),
      },
    }),
    new webpack.DllReferencePlugin({
      context: process.cwd(),
      manifest: require.resolve(
        path.join(process.cwd(), 'node_modules/robor-vender-dll/manifest.json')
      ),
    }),
    new MomentLocalesPlugin({
      localesToKeep: ['es-us', 'zh-cn'],
    }),
    new ForkTsCheckerWebpackPlugin({
      async: true,
      reportFiles: ['src/**/*.{ts,tsx}'],
    }),
    new BundleAnalyzerPlugin(),
    // new ProgressBarPlugin(),
    new WebpackBar({
      // profile: true,
      name: require(path.join(process.cwd(), 'package.json')).name || 'client',
    }),
  }
```

## TypeScript

### ForkTsCheckerWebpackPlugin

-   这个插件会在另外一个进程中做相关的类型检查。

## webpack 自带

### webpack.HotModuleReplacementPlugin

### webpack.DefinePlugin

### webpack.DllReferencePlugin

## webpack 三方

### html-webpack-plugin

作用：将打包后的 js 资源注入 html 中。而注入的原理为当打包器已生成 entryPoint 文件资源后，获得其文件名及 publicPath，并将其注入到 html 中

```js
class HtmlWebpackPlugin {
	constructor(options) {
		this.options = options || {};
	}

	apply(compiler) {
		const webpack = compiler.webpack;

		compiler.hooks.thisCompilation.tap(
			"HtmlWebpackPlugin",
			(compilation) => {
				// compilation 是 webpack 中最重要的对象，文档见 [compilation-object](https://webpack.js.org/api/compilation-object/#compilation-object-methods)

				compilation.hooks.processAssets.tapAsync(
					{
						name: "HtmlWebpackPlugin",

						// processAssets 处理资源的时机，此阶段为资源已优化后，更多阶段见文档
						// https://webpack.js.org/api/compilation-hooks/#list-of-asset-processing-stages
						stage: webpack.Compilation
							.PROCESS_ASSETS_STAGE_OPTIMIZE_INLINE,
					},
					(compilationAssets, callback) => {
						// compilationAssets 将得到所有生成的资源，如各个 chunk.js、各个 image、css

						// 获取 webpac.output.publicPath 选项，(PS: publicPath 选项有可能是通过函数设置)
						const publicPath = getPublicPath(compilation);

						// 本示例仅仅考虑单个 entryPoint 的情况
						// compilation.entrypoints 可获取入口文件信息
						const entryNames = Array.from(
							compilation.entrypoints.keys()
						);

						// entryPoint.getFiles() 将获取到该入口的所有资源，并能够保证加载顺序！！！如 runtime-chunk -> main-chunk
						const assets = entryNames
							.map((entryName) =>
								compilation.entrypoints
									.get(entryName)
									.getFiles()
							)
							.flat();
						const scripts = assets.map((src) => publicPath + src);
						const content = html({
							title: this.options.title || "Demo",
							scripts,
						});

						// emitAsset 用以生成资源文件，也是最重要的一步
						compilation.emitAsset(
							"index.html",
							new webpack.sources.RawSource(content)
						);
						callback();
					}
				);
			}
		);
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

### require('webpack-bundle-analyzer').BundleAnalyzerPlugin

### copy-webpack-plugin

### ssh-webpack-plugin

### script-ext-html-webpack-plugin

### offline-plugin

### compression-webpack-plugin

### terser-webpack-plugin

### autodll-webpack-plugin

### mini-css-extract-plugin

将 CSS 单独抽离出来，以便单独加载 CSS 资源。

## webpack5

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
			compilation.hooks.htmlWebpackPluginAfterHtmlProcessing.tapPromise(
				"CustomHtmlPlugin",
				(data) => {
					let html = data.html;
					return new Promise((resolve) => {
						Object.keys(replacements).forEach((key) => {
							// key = key.replace(/\s*/g, '');
							let value = replacements[key];
							if (typeof value !== "string") {
								value = JSON.stringify(value);
							}
							html = html.replace(
								new RegExp("{{" + key + "}}", "g"),
								value
							);
						});
						data.html = html;
						resolve(data);
					});
				}
			);
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

-   更多插件参考[https://webpack.js.org/awesome-webpack/](https://webpack.js.org/awesome-webpack/)

## Babel

### babel.config.js 与 babelrc.js 的区别

1. babelrc 只会影响本项目中的代码
2. babel.config.js 会影响整个项目中的代码，包含 node_modules 中的代码
3. 推荐使用 babel.config.js

### @babel/preset-env

转换 ES6 语法成 ES5 的语法。

```js
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
