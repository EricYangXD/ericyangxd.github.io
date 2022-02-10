---
title: 微前端
author: EricYangXD
date: "2022-02-10"
---

## qiankun

qiankun 是一个基于 single-spa 的微前端实现库，旨在帮助大家能更简单、无痛的构建一个生产可用微前端架构系统。

微前端的概念借鉴自后端的微服务，主要是为了解决大型工程在变更、维护、扩展等方面的困难而提出的。目前主流的微前端方案包括以下几个：

-   iframe
-   基座模式，主要基于路由分发，qiankun 和 single-spa 就是基于这种模式
-   组合式集成，即单独构建组件，按需加载，类似 npm 包的形式
-   EMP，主要基于 Webpack5 Module Federation
-   Web Components

> 严格来讲，这些方案都不算是完整的微前端解决方案，它们只是用于解决微前端中运行时容器的相关问题。
