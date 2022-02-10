---
title: Webpack知识点
author: EricYangXD
date: "2022-02-10"
---

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
				use: [MiniCssExtractPlugin.loader, "css-loader"],
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
