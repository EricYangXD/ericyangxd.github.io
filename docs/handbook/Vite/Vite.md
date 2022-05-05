---
title: Vite相关知识点
author: EricYangXD
date: "2022-01-06"
---

## 组成

主要由两部分组成：

1. 一个开发服务器，它基于 原生 ES Module 提供了 丰富的内建功能，如速度快到惊人的 模块热更新（HMR）。
2. 一套构建指令，它使用 Rollup 打包代码，并且它是预配置的，可输出用于生产环境的高度优化过的静态资源。
3. 即开发的时候用 esbuild，生产打包用 rollup

## 原理

> 以下引用自[Vite 官方中文文档](https://cn.vitejs.dev/guide/why.html#slow-server-start)

-   Vite 通过在一开始将应用中的模块区分为 「依赖」 和 「源码」 两类，改进了开发服务器启动时间。
-   依赖 大多为在开发时不会变动的纯 JavaScript。Vite 将会使用 esbuild 预构建依赖。
-   源码 通常包含一些并非直接是 JavaScript 的文件，需要转换（例如 JSX，CSS 或者 Vue/Svelte 组件），时常会被编辑。同时，并不是所有的源码都需要同时被加载（例如基于路由拆分的代码模块）。
-   Vite 以 原生 ESM 方式提供源码。这实际上是让浏览器接管了打包程序的部分工作：Vite 只需要在浏览器请求源码时进行转换并按需提供源码。根据情景动态导入代码，即只在当前屏幕上实际使用时才会被处理。

-   ![Vite原理图](https://cn.vitejs.dev/assets/esm.3070012d.png "Vite原理图")

0. esbuild 构建之后，会对「依赖包」的请求设置强缓存`cache-control:max-age=31536000,immutable;`
1. 在启动的时候，vite 并不会打包源码，而是在浏览器请求路由时才会进行打包，而且也仅仅打包当前路由的源码。这相当于让浏览器掌握了打包的控制权，从而将`Bundle based dev server`(如 webpack)一次性打包全部源码的操作改为了多次，启动速度无疑会快非常多。
2. 在访问时转换的速度也不会慢下来，因为每次转换的源码只有在当前路由下的，并且「源码模块」还会设置协商缓存，当模块没有改变时，浏览器的请求会返回 304 Not Modified。

## 优势

### Vite 天然支持引入.ts、.jsx、.css 等文件

1. Vite 使用 esbuild 将 ts 转译为 js，约是 tsc 速度的 20-30 倍，同时 HMR 更新反映到浏览器的时间小于 50ms
2. .jsx 和.tsx 文件同样开箱即用。JSX 的转译同样是通过 esbuild，默认为 react16 风格
3. 导入.css 文件将会把内容插入到`<style>`标签中，同时也带有 HMR 支持。同时支持.scss/.sass/.less/.stylus 等格式文件。

### 方便

1. 开箱即用，对比 webpack，少了很多 plugin 和 loader 配置。
2. 对于库开发者，也可以通过简单的配置即可打包输出多种格式的包。
3. 开发和生产共享了 rollup 的插件接口，大部分 rollup 插件可以在 vite 上使用。
4. 类型化配置，配置文件可以使用 ts，具有配置类型提示。

### WebAssembly

预编译的.wasm 文件可以直接被导入——默认导出一个函数，返回值为所导出的 wasm 实例对象的 Promise。

### 构建优化——异步 chunk 加载优化

无优化时，当异步 chunkA 被导入时，浏览器将必须先请求和解析 A，然后才能弄清楚它也需要公用 chunkC，这会导致额外的网络请求开销；

优化后，Vite 使用一个预加载步骤自动重写代码，来分割动态导入调用，以实现当 A 被请求时，C 也将被同时请求；

Vite 的优化会跟踪所有的直接导入，无论导入的深度如何，都能够完全消除不必要的往返。

### 支持 SSR

## defineConfig 配置

-   optimizeDeps.exclude: 在预构建中强制排除的依赖项。(mark as external)

## 迁移到 Vite

### 新项目

使用 Vite 提供的模板工具：@vitejs/create-app

### 老项目

1. webpack 项目：wp2vite，保留原来的 webpack 配置，把 vite 的配置注入到项目中以支持 vite
