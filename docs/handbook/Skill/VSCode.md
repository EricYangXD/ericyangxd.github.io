---
title: VSCode 使用记录
author: EricYangXD
date: "2022-07-13"
meta:
  - name: keywords
    content: vscode
---

## VSCode 安装 code 命令

使用 `command + shift + p` (注意 window 下使用 `ctrl + shift + p` ) 然后搜索 code，选择 `install 'code' command in path`。

## 去除 VScode 编写 markdown 时的警告

`command + ,`打开设置，搜索「markdown」，找到*markdownlint*，一般是「语言名称+lint」的形式，点击「Markdownlint：Config」，在 settings.json 中编辑规则即可。比如`"markdownlint.config": {"MD001": false,"MD010": false}`。

## vuepress 运行 blog

1. `node -v: v16.15.0`
2. `vuepress -v: vuepress/1.9.7 darwin-x64 node-v16.15.0`
3. `vue --version: @vue/cli 4.5.8`

## 插件

1. PicGo：结合 GitHub+jsdelivr（免费 CDN）配置图床。[参考这篇](https://zhuanlan.zhihu.com/p/489236769)

## 下载历史版本 vscode

eg. 1.73.1。[see here](https://code.visualstudio.com/docs/supporting/faq#_previous-release-versions)

| platform            | link                                                                   |
| ------------------- | ---------------------------------------------------------------------- |
| macOS Universal     | https://update.code.visualstudio.com/{version}/darwin-universal/stable |
| macOS Intel chip    | https://update.code.visualstudio.com/{version}/darwin/stable           |
| macOS Apple silicon | https://update.code.visualstudio.com/{version}/darwin-arm64/stable     |
