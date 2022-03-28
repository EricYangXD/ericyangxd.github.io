---
title: Mac 使用tips
author: EricYangXD
date: "2022-01-17"
---

## MacOS 配置 iTerm2 + oh-my-zsh 及插件教程

-   文章[链接](https://mp.weixin.qq.com/s/ULRQltO0s2ZOMYYwZn9r9Q)

## 安装 Homebrew

1. Mac 下镜像飞速安装 Homebrew 教程: https://zhuanlan.zhihu.com/p/90508170
2. M1 芯片 Mac 上 Homebrew 安装教程: https://zhuanlan.zhihu.com/p/341831809

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

## Postman

Postman 安装 Interceptor Bridge 时报 ERROR_CODE:CHROME_NOT_INSTSLLED
解决方法如下：

```zsh
mkdir ~/Library/Application\ Support/Google/Chrome/NativeMessagingHosts
chmod +wx ~/Library/Application\ Support/Google/Chrome/NativeMessagingHost
```

## 修改 host

### 一.系统偏好设置修改

1. 打开系统偏好设置，底部有一个 Hosts 的快捷入口
2. 输入 ip 和 hostname 后，回车确定，勾选改 host 即可

### 二.终端命令行修改

-   A

```zsh
sudo vi /etc/hosts
```

1. 输入本机密码后，打开 hosts 文件，键盘输入 i （插入），修改 hosts 文件后，按 esc 键退出,再按 shift+：键，再输入 w 和 q，保存退出；
2. 不保存退出，则按 q 和！键。

-   B

```zsh
open /etc/hosts -e
```

### 三.直接修改系统 Hosts 文件

-   A

1. 打开 Finder，按快捷键组合 Shift+Command+G 查找文件，输入/etc/hosts,确认前往；
2. 进入文件夹后，复制该文件到桌面，修改成功后保存，将原先的 host 文件替换掉即可。

-   B

1. 打开 Finder，按快捷键组合 Shift+Command+G 查找文件，输入/private,确认前往后可看到 etc 文件夹，邮件选择'显示简介'，在底部打开‘共享和权限’；
2. 将 everyone 的权限改为‘读与写’，保存后直接修改 hosts 文件，最后完成后将权限改回来。

### 如何在 Macbook 中更新使用他人账号安装的软件

有时候工作时接手了别人留下的电脑，由于大部分需要的软件都已经安装好了，为了方便自己也懒得再去重装系统，这就导致当现有软件出现新版本时，你无法更新，因为你没有别人账户的密码。

这样的安装模式会出现一个问题，更新应用时 AppStroe 会提示让你输入下载该应用的账号及密码，该账号不能直接修改。下面的方法可以删除原有账号信息，而后可以使用新的账号信息更新。

方法如下:

1. 打开访达，进入应用程序目录
2. 找到要更新的应用，右键点击“显示包内容”
3. 找到\_MASReceipt 文件夹
4. 删除它，然后退出重启 AppStroe，即可更新该应用。

To make the AppStore forget the old credentials with which the app was downloaded, you must remove the \_MASReceipt directory in the app itself.

To do this:

1. Open Finder and navigate to Applications,
2. Ctrl+Click XCode and choose "Show Package Contents",
3. Expand the Contents directory and click \_MASReceipt to select it,
4. Type Command+Delete to delete the directory permanently---you will be prompted for your credentials since this is a protected file.

Quit and restart AppStore, then find XCode. The button should now say "Free" or "Install" instead of "Update". Clicking it will update your XCode to the latest version as the currently logged-in Apple user.

### 局域网大文件资源共享传输

0. ifconfig 获取 IP 先

1. host

-   python2 语法：`python -m SimpleHTTPServer [port]`
-   python3 语法：`python -m http.server [port]`
-   如果不指定端口号默认的是 8000 端口。在局域网中使用 web 去访问 http://IP:8000 即可

2. client

-   Mac: finder 右键 -> 连接服务器：IP:port
-   Windows: Chrome 访问
