---
title: Mac 使用tips
author: EricYangXD
date: "2022-01-17"
---

## MacOS 配置 iTerm2 + oh-my-zsh 及插件教程

-   文章[链接](https://mp.weixin.qq.com/s/ULRQltO0s2ZOMYYwZn9r9Q)

## 设置三指拖移

-   先在「系统偏好设置」-「触控板」设置
-   然后到「系统偏好设置」-「辅助功能」-「指针控制」-「鼠标与触控板」-「触控板选项」/「鼠标选项」，可以启用三指拖移功能以及调整鼠标速度

## 安装 Java

-   https://www.azul.com/downloads/?version=java-17-lts&os=macos&architecture=arm-64-bit&package=jdk 下载 dmg 一键安装

## Mac 查看 USB 串口

```bash
ls -la /dev/tty.usbserial*
```

## 关闭 time machine 提醒

> MAC 用户在没有使用 Time Machine 时，在 MAC 上插入空白 USB 存储设备后，总会出现一个是否将其作为备份磁盘的系统提示。很多用户都讨厌这个提示，那么该如何将这个提示关掉呢？

-   如何关闭 MAC 系统 Time Machine 用新加磁盘进行备份的提示，解决方法：

1. 首先打开终端（应用程序 – 实用工具 – 终端.app），然后输入以下命令：

```bash
  defaults write com.apple.TimeMachine DoNotOfferNewDisksForBackup -bool TRUE
```

2. 注销并重新登录系统，修改就会生效了。

-   如果你需要恢复此提示，则再次打开终端，输入以下命令就可以了（也要注销并重新登录系统修改才会生效）。

```bash
  defaults delete com.apple.TimeMachine DoNotOfferNewDisksForBackup
```

-   如果你的电脑上也没有使用 Time Machine 为系统备份，为了关闭那个讨厌的系统提示，就可以使用这个命令行，将它关掉。

## 关闭帮助菜单

-   「系统偏好设置」-「键盘」-「快捷键」-「App 快捷键」-取消「显示帮助菜单」勾选

## 取消 Chrome 自动升级

### 原理

-   最新的 Mac 上在“~/Library/Google”目录下执行操作同样可以禁用自动更新。请执行以下命令：

```bash
cd ~/Library/Google
sudo chown root:wheel GoogleSoftwareUpdate
```

-   相当于修改了 GoogleSoftwareUpdate 这个文件夹的拥有者，而不仅仅是修改了权限，使 Google 对该文件夹没有写入权限.
-   重启 Chrome 完成以后通过“帮助->关于 Google Chrome”可以查看信息.

### 步骤

1. 首先关闭 Chrome 浏览器，然后进入目录“/Library/Google/GoogleSoftwareUpdate”

```bash
cd /Library/Google/GoogleSoftwareUpdate
```

2. 先用 chown 命令来设置 GoogleSoftwareUpdate 目录的权限。
3. 然后删除该目录下的 GoogleSoftwareUpdate.bundle 即可。
    - 可以通过命令行删除，或者 Finder 手动删除都可以。
    - 最简便的方法，就是改文件扩展名，改到谷歌脸盲。
4. 执行完成以后，再次重启 chrome，就可以看到 chrome 的提示。
    - 表示我们禁用 chrome 的自动更新成功了。
5. 如果你点击了“设置自动更新”，则刚才的“GoogleSoftwareUpdate.bundle”文件就会再次出现了。
    - 点击“不再询问”大功告成。通过“帮助->关于 Google Chrome”可以查看信息。
