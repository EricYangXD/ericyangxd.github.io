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

### moment-locales-webpack-plugin

### script-ext-html-webpack-plugin

### offline-plugin

### compression-webpack-plugin

### terser-webpack-plugin

## webpack5

### 提高打包速度

-   持久化缓存: cache

1. webpack5 内置了关于缓存的插件，可通过以下配置开启。它将 Module、Chunk、ModuleChunk 等信息序列化到磁盘中，二次构建避免重复编译计算，编译速度得到很大提升。

2. 如对一个 JS 文件配置了 eslint、typescript、babel 等 loader，他将有可能执行五次编译，被五次解析为 AST

acorn: 用以依赖分析，解析为 acorn 的 AST
eslint-parser: 用以 lint，解析为 espree 的 AST
typescript: 用以 ts，解析为 typescript 的 AST
babel: 用以转化为低版本，解析为 @babel/parser 的 AST
terser: 用以压缩混淆，解析为 acorn 的 AST

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

-   多进程: thread-loader

1. thread-loader 为官方推荐的开启多进程的 loader，可对 babel 解析 AST 时开启多线程处理，提升编译的性能。

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
