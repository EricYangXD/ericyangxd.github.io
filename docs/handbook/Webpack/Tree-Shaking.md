---
title: Tree Shaking
author: EricYangXD
date: "2022-02-08"
---

## 定义

利用 ES Module 可以进行静态分析的特点来检测模块内容的导出、导入以及被使用的情况，保留 Live Code。

Rollup 对 Tree-shaking 的定义已经不仅仅是 ES Module 相关，此外它还支持了 DCE -- 消除不会被执行和没有副作用（Side Effect） 的 Dead Code，即 DCE 过程。

## 使用

1. 使用>= ES2015 模块语法（即 import 和 export）
2. 确保没有编译器将 ES2015 模块语法转换为 CommonJS 的（这是现在常用的@babel/preset-env 的默认行为）
3. 在项目的 package.json 文件中，添加"sideEffects"："false"属性
4. 使用 mode 为"production"的配置项以启用更多优化项，包括压缩代码与 tree shaking
