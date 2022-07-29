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
