---
title: 安卓使用技巧
author: EricYangXD
date: "2022-02-09"
---

## 安卓手机安装谷歌服务

### 手动模式

首先必须了解 Google 套件正常运行是由三个基础构建而成：服务框架，账户管理程序，Play 服务。

一般大家用的都是商店为基础，那就再加个 商店 组成四件套。

安装四个谷歌软件，软件安装的顺序很关键，（顺序出错要么闪退要么卡死）。

软件的顺序错了的话，基本上是怎么折腾也不会有结果的。

1. 安装 Google Service Framework (谷歌服务框架 GSF)。
2. 安装 Google Account Manager (谷歌账户管理程序，貌似已经不需要了？2022-05-20)。
3. 安装 Google Play Service (Google Play 服务又称 GMS）。
4. 安装 商店 Google Play Store。

可以从此处[www.apkmirror.com](https://www.apkmirror.com)下载所需的 APK 及对应版本。

### 自动模式

使用谷歌安装器

1. 点击下载[Go 安装器](/demos/software/GoInstaller.apk)

## 运行安卓项目

Android Studio>sidebar>project 切换找不到 app moudle 和 project moudle

- 1. app moudle

为什么找不到呢，估计是 IDE 抽风 先记录下:

1. 剪切一下 settings.gradle 下的 include ‘:app’，
2. 然后 Sync Project with gradle files，
3. 再然后，粘贴回去 include ‘:app’,
4. 再 build 一下就可以了.

- 2. project moudle

1. 去项目根目录找到.idea 文件夹
2. 找到.idea 后删除
3. 重启 AS 就可以了

- 3. Android Studio > sidebar 控制显示隐藏：通过 view -> tool windows -> 控制
