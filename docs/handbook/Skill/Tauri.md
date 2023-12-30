---
title: Tauri
author: EricYangXD
date: "2023-12-27"
meta:
  - name: keywords
    content: Tauri
---

## Tauri 笔记

1. [Tauri](https://github.com/tauri-apps/tauri) 是一个为所有主要桌面平台构建极小、极快二进制文件的框架。开发人员可以集成任何可编译为 HTML、JS 和 CSS 的前端框架来构建用户界面。应用程序的后端是一个 Rust 源码的二进制文件，带有前端可与之交互的 API。

2. Tauri 由一个可搭配任何前端来构建桌面应用的框架和 Rust 核心构成。 每个应用均由两个部分组成：

   - 创建窗口并向其提供原生功能支持的 Rust 二进制文件
   - 由您选择的前端框架，用于编写窗口内的用户界面

## 安装

1. 基于 Rust，先安装 Rust，然后可以使用`create-tauri-app`来创建项目即可

```bash
# bash
sh <(curl https://create.tauri.app/sh)

# PowerShell
irm https://create.tauri.app/ps | iex

# Cargo
cargo install create-tauri-app --locked
cargo create-tauri-app

# npm
npm create tauri-app@latest

# yarn
yarn create tauri-app

# pnpm
pnpm create tauri-app
```

2. 启动项目：`npm run tauri dev`
3.