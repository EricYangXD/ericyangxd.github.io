---
title: Vite相关知识点
author: EricYangXD
date: "2022-01-06"
---

## 原理

> 以下引用自[Vite 官方中文文档](https://cn.vitejs.dev/guide/why.html#slow-server-start)

-   Vite 通过在一开始将应用中的模块区分为 依赖 和 源码 两类，改进了开发服务器启动时间。
-   依赖 大多为在开发时不会变动的纯 JavaScript。Vite 将会使用 esbuild 预构建依赖。
-   源码 通常包含一些并非直接是 JavaScript 的文件，需要转换（例如 JSX，CSS 或者 Vue/Svelte 组件），时常会被编辑。同时，并不是所有的源码都需要同时被加载（例如基于路由拆分的代码模块）。
-   Vite 以 原生 ESM 方式提供源码。这实际上是让浏览器接管了打包程序的部分工作：Vite 只需要在浏览器请求源码时进行转换并按需提供源码。根据情景动态导入代码，即只在当前屏幕上实际使用时才会被处理。

-   ![Vite原理图](https://cn.vitejs.dev/assets/esm.3070012d.png "Vite原理图")

## defineConfig 配置

-   optimizeDeps.exclude: 在预构建中强制排除的依赖项。(mark as external)
