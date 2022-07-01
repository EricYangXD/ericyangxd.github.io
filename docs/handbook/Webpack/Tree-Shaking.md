---
title: Tree Shaking
author: EricYangXD
date: "2022-02-08"
---

## Tree Shaking 定义

- 利用 ES Module 可以进行静态分析的特点来检测模块内容的导出、导入以及被使用的情况，保留 Live Code。
- Rollup 对 Tree-shaking 的定义已经不仅仅是 ES Module 相关，此外它还支持了 DCE -- 消除不会被执行和没有副作用（Side Effect） 的 Dead Code，即 DCE 过程。
- Tree Shaking 指基于 ES Module 进行静态分析，通过 AST 将用不到的函数进行移除，从而减小打包体积。

### 原理

- ESM 要求所有的导入导出语句只能出现在模块顶层，且导入导出的模块名必须为字符串常量，所以，ESM 下模块之间的依赖关系是高度确定的，与运行状态无关，编译工具只需要对 ESM 模块做静态分析，就可以从代码字面量中推断出哪些模块值未曾被其它模块使用，这是实现 Tree Shaking 技术的必要条件。
- webpack5 已经自带了这个功能了，当打包环境为 production 时，默认开启 tree-shaking 功能。

### 在 Webpack 中实现 Tree Shaking 的原理

Webpack 中，Tree-shaking 的实现一是「先标记出模块导出值中哪些没有被用过」，二是「使用 Terser、UglifyJS 等 DCE 工具删掉这些没被用到的导出语句」。标记过程大致可划分为三个步骤：

1. Make 阶段，收集模块导出变量并记录到模块依赖关系图 ModuleGraph 变量中
2. Seal 阶段，遍历 ModuleGraph 标记模块导出变量有没有被使用
3. 生成产物时，若变量没有被其它模块使用则删除对应的导出语句

## 使用

1. 使用>= ES2015 模块语法（即 import 和 export）
2. 确保没有编译器将 ES2015 模块语法转换为 CommonJS 的（这是现在常用的@babel/preset-env 的默认行为）
3. 在项目的 package.json 文件中，添加"sideEffects"："false"属性
4. 使用 mode 为"production"的配置项以启用更多优化项，包括压缩代码与 tree shaking

### 在 Webpack 中启动 Tree Shaking

在 Webpack 中，启动 Tree Shaking 功能必须同时满足三个条件：

1. 使用 ESM 规范编写模块代码
2. 配置 optimization.usedExports 为 true，启动标记功能
3. 启动代码优化功能，可以通过如下方式实现：

   - 配置 mode = production
   - 配置 optimization.minimize = true
   - 提供 optimization.minimizer 数组

## tips

1. 当使用语法 import \* 时，Tree Shaking 依然生效。
2. Tree Shaking 甚至可对 JSON 进行优化。原理是因为 JSON 格式简单，通过 AST 容易预测结果，不像 JS 对象有复杂的类型与副作用。
3. 为了减小生产环境体积，我们可以使用一些支持 ES 的 package，比如使用 lodash-es 替代 lodash。
4. 我们可以在 [npm.devtool.tech](//npm.devtool.tech) (opens new window)中查看某个库是否支持 Tree Shaking。
