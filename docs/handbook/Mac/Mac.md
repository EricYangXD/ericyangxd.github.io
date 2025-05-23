---
title: Mac 使用tips
author: EricYangXD
date: "2022-01-17"
meta:
  - name: keywords
    content: Mac,MacOS,iTerm2
---

## MacOS 配置 iTerm2 + oh-my-zsh 及插件教程

- 文章[链接](https://mp.weixin.qq.com/s/ULRQltO0s2ZOMYYwZn9r9Q)

## 安装 Homebrew

1. Mac 下镜像飞速安装 Homebrew 教程: https://zhuanlan.zhihu.com/p/90508170
   - `/bin/bash -c "$(curl -fsSL https://gitee.com/ineo6/homebrew-install/raw/master/install.sh)"`
   - 备用：`/bin/bash -c "$(curl -fsSL https://b.idayer.com/brew.sh)"`
2. M1 芯片 Mac 上 Homebrew 安装教程: https://zhuanlan.zhihu.com/p/341831809

## 设置三指拖移

- 先在「系统偏好设置」-「触控板」设置
- 然后到「系统偏好设置」-「辅助功能」-「指针控制」-「鼠标与触控板」-「触控板选项」/「鼠标选项」，可以启用三指拖移功能以及调整鼠标速度

## 修改鼠标滚轮方向

1. 点击左上角苹果图标，选择菜单：系统偏好设置...。
2. 打开系统偏好设置界面，点击"鼠标"。
3. 取消"滚动方向：自然"的复选框即可。
4. 此时触控板方向也会变，需要配合`Scroll Reverser`独立设置鼠标和触控板这两个设备的滚动方向。

上述方法是个通用的办法，如果使用罗技鼠标，那么直接下载`Logi Options`，在`Point & Scroll`里设置滚动为`standard`即可。

## 安装 Java

- https://www.azul.com/downloads/?version=java-17-lts&os=macos&architecture=arm-64-bit&package=jdk 下载 dmg 一键安装

## Mac 查看 USB 串口

```bash
ls -la /dev/tty.usbserial*
```

## 关闭 time machine 提醒

> MAC 用户在没有使用 Time Machine 时，在 MAC 上插入空白 USB 存储设备后，总会出现一个是否将其作为备份磁盘的系统提示。很多用户都讨厌这个提示，那么该如何将这个提示关掉呢？

- 如何关闭 MAC 系统 Time Machine 用新加磁盘进行备份的提示，解决方法：

1. 首先打开终端（应用程序 – 实用工具 – 终端.app），然后输入以下命令：

```bash
  defaults write com.apple.TimeMachine DoNotOfferNewDisksForBackup -bool TRUE
```

2. 注销并重新登录系统，修改就会生效了。

- 如果你需要恢复此提示，则再次打开终端，输入以下命令就可以了（也要注销并重新登录系统修改才会生效）。

```bash
  defaults delete com.apple.TimeMachine DoNotOfferNewDisksForBackup
```

- 如果你的电脑上也没有使用 Time Machine 为系统备份，为了关闭那个讨厌的系统提示，就可以使用这个命令行，将它关掉。

## 关闭帮助菜单

- 「系统偏好设置」-「键盘」-「快捷键」-「App 快捷键」-取消「显示帮助菜单」勾选

## 不安全目录

今天装完 node 以及 nvm、nrm 后发现打开命令工具或者执行 `source ~/.zshrc` 命令 时会出现下提醒，需要输入 y，这样太不方便了

```sh
zsh compinit: insecure directories, run compaudit for list.
Ignore insecure directories and continue [y] or abort compinit [n]?
```

出现这个原因就是提示又不安全的目录，是否忽略。原因可能不较多，解决方法都一样:

1. 执行: `compaudit`
2. 得到，例如:

```sh
There are insecure directories:
/usr/local/share/zsh/site-functions
/usr/local/share/zsh
```

3. 执行以下语句给对应的目录赋权限即可:

```sh
cd /usr/local/share/zsh
sudo chmod -R 755 ./site-functions

cd ../
sudo chmod -R 755 zsh
```

## 取消 Chrome 自动升级

### 原理

- 最新的 Mac 上在“~/Library/Google”目录下执行操作同样可以禁用自动更新。请执行以下命令：

```bash
cd ~/Library/Google
sudo chown root:wheel GoogleSoftwareUpdate
```

- 相当于修改了 GoogleSoftwareUpdate 这个文件夹的拥有者，而不仅仅是修改了权限，使 Google 对该文件夹没有写入权限.
- 重启 Chrome 完成以后通过“帮助->关于 Google Chrome”可以查看信息.
- 注意取消自动更新之后，后续只能通过下载安装包重装 Chrome 来升级，除非取消

### 步骤

1. 首先关闭 Chrome 浏览器，然后进入目录`cd /Library/Google/GoogleSoftwareUpdate`
2. 先用 `chown` 命令来设置 GoogleSoftwareUpdate 目录的权限。
3. 然后删除该目录下的 GoogleSoftwareUpdate.bundle 即可。
   - 可以通过命令行删除，或者 Finder 手动删除都可以。
   - 最简便的方法，就是改文件扩展名，改到谷歌脸盲。
4. 执行完成以后，再次重启 chrome，就可以看到 chrome 的提示。
   - 表示我们禁用 chrome 的自动更新成功了。
5. 如果你点击了“设置自动更新”，则刚才的“GoogleSoftwareUpdate.bundle”文件就会再次出现了。
   - 点击“不再询问”大功告成。通过“帮助->关于 Google Chrome”可以查看信息。

### 恢复自动更新

下载[Google 软件更新](https://dl.google.com/mac/install/googlesoftwareupdate.dmg)

## Postman

Postman 安装 Interceptor Bridge 时报 ERROR_CODE:CHROME_NOT_INSTSLLED
解决方法如下：

```bash
mkdir ~/Library/Application\ Support/Google/Chrome/NativeMessagingHosts
chmod +wx ~/Library/Application\ Support/Google/Chrome/NativeMessagingHost
```

### 基础教程

[Postman 基础知识教程](https://apifox.com/apiskills/postman-tutorial-series/#postman-%E5%9F%BA%E7%A1%80%E7%9F%A5%E8%AF%86%E6%95%99%E7%A8%8B)

### Postman 将接口响应设置为变量

下面以调用高德地图地址街道信息查询接口为例，它有两个接口：第一个接口将地址转换为经纬度，第二个接口将经纬度转换为街道信息。我们需要先把第一个接口的返回值中的经纬度提取出来，设为环境变量，然后再调用第二个接口并带上经纬度信息。

0. 先了解一下 Postman 中的一些关键字：

   - responseBody：响应体
   - pm.environment.set(key, value)：设置环境变量
   - pm.environment.get(key)：获取环境变量
   - pm.collectionVariables.set(key, value)：设置集合变量
   - pm.collectionVariables.get(key)：获取集合变量
   - eval()：执行返回的 JSONP 响应代码

1. 在第一个接口的 Tests 中添加脚本

```js
// 这是从服务器返回的JSONP响应示例
// let response = 'jsonp_350556_({"status":"1","info":"OK","infocode":"10000","count":"1","geocodes":[{"formatted_address":"上海市浦东新区潍坊路375弄","country":"中国","province":"上海市","citycode":"021","city":"上海市","district":"浦东新区","township":[],"neighborhood":{"name":[],"type":[]},"building":{"name":[],"type":[]},"adcode":"310115","street":"潍坊路375弄","number":[],"location":"121.531411,31.228451","level":"道路"}]})';

// 接口返回一个JSONP响应字符串
// 定义一个与JSONP响应中的回调函数同名的函数
function jsonp_350556_(data) {
  // 在这里处理你的数据
  console.log(data);
  return data.geocodes;
}

// 这是从服务器返回的JSONP响应
let response = responseBody;

// 执行返回的JSONP响应代码
const geocodes = eval(response);
const [long, lat] = geocodes[0].location.split(",");

// pm.environment.set("longitude", long);
// pm.environment.set("latitude", lat);

pm.collectionVariables.set("longitude", long);
pm.collectionVariables.set("latitude", lat);
```

2. 在第二个接口的 Params 中找到 location 并使用`{{longitude}},{{latitude}}`的形式使用环境变量，注意区分全局变量、集合变量等。此处可以直接存 location。

3. 后面使用接口查询的时候，需要先调用接口一，待响应成功之后，再调用接口二，然后去响应中查看对应字段，此处是 formatted_address。

## 修改 host

### 一.系统偏好设置修改

1. 打开系统偏好设置，底部有一个 Hosts 的快捷入口
2. 输入 ip 和 hostname 后，回车确定，勾选改 host 即可

### 二.终端命令行修改

- A

```bash
sudo vi /etc/hosts
```

1. 输入本机密码后，打开 hosts 文件，键盘输入 i （插入），修改 hosts 文件后，按 esc 键退出,再按 shift+：键，再输入 w 和 q，保存退出；
2. 不保存退出，则按 q 和！键。

- B

```bash
open /etc/hosts -e
```

### 三.直接修改系统 Hosts 文件

- A

1. 打开 Finder，按快捷键组合 Shift+Command+G 查找文件，输入/etc/hosts,确认前往；
2. 进入文件夹后，复制该文件到桌面，修改成功后保存，将原先的 host 文件替换掉即可。

- B

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

- python2 语法：`python -m SimpleHTTPServer [port]`
- python3 语法：`python3 -m http.server [port]`
- 如果不指定端口号默认的是 8000 端口。在局域网中使用 web 去访问 http://IP:8000 即可

2. client

- Mac: finder 右键 -> 连接服务器：IP:port
- Windows: Chrome 访问

### 无法打开软件

苹果 macOS Catalina 系统打开软件出现：无法打开“XXXX”，因为 Apple 无法检查其是否包含恶意软件。怎么解决?

- 先`sudo spctl --master-disable`，然后`sudo xattr -r -d com.apple.quarantine ./路径/app名`，如果不好打印可以在仿达里找到拖到命令行里。

### Big Sur 打开应用提示，您没有权限来打开应用程序

1. `codesign --force --deep --sign - /Applications/Sketch.app` -- ok
2. `brew install upx` + `upx -d /Applications/Sketch.app` -- TBD

### m1/intel MacBook 安装 adb

`brew install android-platform-tools`

### 安装 ShadowsocksX-NG-R8

修改 info.plist 后需要重新签名或者移除签名：

- `codesign --remove-signature /Applications/ShadowsocksX-NG-R8.app`

否则重启之后 app 会打不开，更新订阅成功的通知不出现也是因为签名对不上。

### 给一个.sh 文件赋执行权限

1. `sudo xattr -d com.apple.quarantine ./路径/文件名`，去掉「Apple 隔离扩展属性」，查看该属性：`xattr -l ./路径/文件名`
2. `chmod 777 ./路径/文件名`

### 关闭 SIP（System Integrity Protection）

Terminal 运行一个外部的 APP 文件，在有`chmod 777`权限的情况下仍然无法运行。此时的 APP 文件是可以打开编辑的，但是 Terminal 无法启动。研究过后，这种情况有两种可能：一是 Terminal 的权限问题，或者是由于下载的文件来源于网络，所以被系统锁定。

Mac 权限问题，operation not permitted。有时即便我们用了 sudo 还是没有权限，例如我们希望修改/usr/bin 目录下的文件名，这是因为，电脑启用了 `SIP（System Integrity Protection）`，增加了 rootless 机制，即使在 root 权限下依然无法修改文件。

#### 打开 Terminal 完全磁盘访问权限

文件有权限打开，但是不意味着 Terminal 有权限访问文件。此时可以：`系统->安全性与隐私->完全磁盘访问权限`，找到终端，开启权限。

#### 关闭 SIP

如果我们还是需要修改目录`/usr/bin`目录下的文件，就需要关闭 SIP，具体步骤下：

1. 重启，过程中按住 command+R，进入保护模式
2. 打开 terminal 终端，输入`csrutil disable`
3. 重启，即可对 `/usr/bin` 目录下文件进行修改
4. 文件修改完之后，再重新打开 SIP，步骤与上面相同，只是执行的命令换成`csrutil enable`

### 如何在 Mac 上的触摸栏中删除 Siri 图标

显然，这仅适用于具有触摸栏屏幕的 Mac 硬件：

1. 转到  苹果菜单，然后选择“系统偏好设置”，然后转到“键盘”
2. 在“键盘”选项卡下，选择“自定义控制条”(注意此处未称为“触摸栏”)
3. 自定义触摸栏以删除 Siri：光标可以移动到 touchbar 上，把不需要的 Siri 拖出去即可

### Mac 电脑如何设置长按 delete 键进行连续删除？

「系统偏好设置」->「键盘」->「重复前延迟」->「高」

### Mac 设置 python3 为默认

1. 首先获得 python3 安装路径，执行命令：`which python3`
2. 修改`.zshrc`或`.bash_profile`增加：`alias python="/usr/local/bin/python3"`
3. 执行`source ~/.zshrc`

### 查看某个软件的软链接

比如查看 docker 的`ls -l /usr/local/bin/docker*`

## 好用的软件

1. MacZip 永久免费的解压软件，比自带的强。iZip。
2. BetterZip
3. uTools 超强工具
4. magnet 分屏
5. ShadowsocksX-NG、clash、clashX、openvpn（自建） 等
6. CleanMyMac（某宝买或者破解版）
7. Office365（找家庭组拼车便宜）
8. Adobe Acrobat Reader DC
9. VSCode：开发必备
10. iTerm2+zsh：开发必备
11. ApiFox、Postman：api 调试开发必备
12. Network Lite
13. webstorm、idea、pycharm：开发必备
14. 阿里云盘、夸克网盘、天翼网盘
15. Chrome
16. 搜狗输入法
17. shottr、微信+Tweak（防撤回）
18. Movist 视频播放器
19. 移动硬盘写入驱动：Tuxera NTFS(收费)、Omi NTFS 磁盘管理（收费）
20. 系统监控工具：iStat Menus
21. 看图软件：Xee
22. 下载：qBittorrent
23. shell 工具：xshell
24. mindnote、easyfind、Alfred
25. Picgo 图床管理
26. markdown 编辑：Typora
27. Agenda 日程管理
28. 备忘录
29. Grammarly
30. Fastclip 剪切板管理
31. FileZilla
32. Scroll Reverser：独立设置鼠标和触控板这两个设备的滚动方向
33. IINA：视频播放器
34. Fig：终端自动补全命令提示工具，配合 iTerm2 使用。在 vscode 中使用，需修改 `editor.accessibilitySupport` 为 `"off"`
35. Terminus：SSH、Telnet 工具
36. Microsoft Remote Desktop：微软远程桌面，注意 Windows 登录微软账户之后，本地账号就会被强制改成微软账户，需要自己设置登录用户名和密码之后（搜索教程按步骤操作），才可以继续用该软件，PC name 即 ip 地址，User account 是你设置的登录用户名，密码在连接时输入。适用于最新版本 10.8.2 (2088)
37. 万兴恢复专家：SD 卡 TF 卡数据恢复工具（收费买断制可以更换设备，找技术支持）

### Mac 微信功能拓展：`WeChatTweak-CLI`

打开微信，在微信的设置中即可发现 Tweak 小助手。

```sh
# 安装 WeChatTweak-CLI
brew install sunnyyoung/repo/wechattweak-cli
# 安装 Tweak
sudo wechattweak-cli install
# 卸载
sudo wechattweak-cli uninstall
```

### duti 设置默认应用程序

设置默认应用程序的命令行工具

```sh
brew install duti
# 查看指定文件类型的默认应用程序
duti -x txt

# 更改文件类型的默认应用程序
duti -s com.apple.TextEdit .txt all

# 常用的默认应用程序设置
duti -s com.microsoft.VSCode .ts all
duti -s com.microsoft.VSCode .js all
duti -s com.microsoft.VSCode .json all
duti -s com.microsoft.VSCode .wxml all
duti -s com.microsoft.VSCode .wxss all
```

### Mac App Store 命令行工具 mas-cli

```sh
brew install mas

# 搜索应用程序
mas search [query]

# 列出已经安装的应用程序
mas list

# 通过应用程序的 ID 进行安装，可以从 search 命令或者应用程序网页中获取
mas install [app-id]

# 升级已经安装的应用程序
mas upgrade

# 列出有更新可用的应用程序
mas outdated
```

### 系统设置命令

```sh
# 禁止 “Are you sure you want to open this application?” 提示
defaults write com.apple.LaunchServices LSQuarantine -bool false

# 禁止磁盘映像验证
defaults write com.apple.frameworks.diskimages skip-verify -bool true
defaults write com.apple.frameworks.diskimages skip-verify-locked -bool true
defaults write com.apple.frameworks.diskimages skip-verify-remote -bool true

# 桌面隐藏外部磁盘和可移动介质
defaults write com.apple.finder ShowExternalHardDrivesOnDesktop -bool false
defaults write com.apple.finder ShowRemovableMediaOnDesktop -bool false

# 显示所有扩展名和隐藏文件
defaults write -g AppleShowAllExtensions -bool true
defaults write com.apple.finder AppleShowAllFiles -bool true

# 禁用修改扩展名时的警告
defaults write com.apple.finder FXEnableExtensionChangeWarning -bool false

# 显示底部地址栏
defaults write com.apple.finder ShowPathbar -bool true

# 禁止创建 .DS_Store 文件
defaults write com.apple.desktopservices DSDontWriteNetworkStores -bool true
```

### 安装 mactex

用来在 Java 项目中生成 pdf 文件

1. [mactex](https://formulae.brew.sh/cask/mactex)
2. 也可以下载之后安装，如果有问题，参考 1

## 安装虚拟机

### VirtualBox

免费[参考这里](https://blog.csdn.net/Rockandrollman/article/details/123118778)

### Parallels desktop for Mac

需付费，或使用破解版，或某宝

### VMWare Fusion

甲骨文开源的。[下载](https://www.ifunmac.com/2022/08/vmware-fusion-22h2/)

## 工具

### FinalShell

服务器远程桌面加速，ssh，开发运维工具！PS：据说不安全。

[下载](https://www.hostbuf.com/downloads/finalshell_install.pkg)

### XShell

收费

### 宝塔面板

[服务器开发运维工具](https://www.bt.cn/new/download.html)

### FTP 工具

#### FileZilla

跨平台，免费，中文支持。[download](https://www.filezilla.cn/download/client)

#### Termius

有免费版本，可以 Telnet、ssh、ftp 等，[download](https://www.termius.com/mac-os)

#### iTerm2

- 也可以配置
  - scp：`scp -r username@ip:folder username@ip:folder`
  - 使用 rz 和 sz 的方式进行，在安装完成 iTerm2 之后打开，然后使用 homebrew 的方式安装 lrzsz，[教程 1](https://github.com/RobberPhex/iterm2-zmodem)，[教程 2](https://blog.csdn.net/whowhowhoisimportant/article/details/117566485)
- 配置`alt/option + 左右箭头`在文字间跳转

  - Go to iTerm `Preferences` → `Profiles`
  - select your profile
  - then the `Keys` tab with its sub-tab `Key Mappings`
  - Click `Load Preset`...
  - and choose `Natural Text Editing`

- 设置 Status bar: 显示网速、CPU、内存等：点击 `Configure Status bar` 进入配置页面，这里将想要的 `Status bar` 拖入下面的方框即可。这里还推荐选择 `Auto-Rainbow`，这样 `Status bar` 就是以彩色的形式展示了。

## Commands

### 查看某个端口的占用情况

`sudo lsof -i :8080`

### Mac 微信桌面客户端多开

1. `nohup /Applications/WeChat.app/Contents/MacOS/WeChat > /dev/null 2>&1 &`

### zsh 报错

1. `compinit:503: no such file or directory: /usr/local/share/zsh/site-functions/_brew_cask`
   - `brew cleanup`:有可能是 brew 缓存记录导致的
   - `brew doctor && brew cleanup && source ~/.zshrc`

### 安装受信任的证书

可以使用以下命令通过 CLI 安装受信任的证书：

`security add-trusted-cert -d -r trustRoot -k ~/Library/Keychains/login.keychain-db your-cert.cer`

或者，通过将其导入 Keychain Access 应用程序并将您的证书的信任更新为“始终信任”。

### 禁止应用自启动

- 打开路径 `/Library/LaunchAgents` 这里是用户的自启动应用的代理，找到不希望他自动启动的 xxx.plist 文件，删除它就可以了。

- `/Library/Apple/System/Library/LaunchAgents` 这里是 Apple 系统自带的 xx.plist 应用，这里一般不要删除。

- Library 即 资源库
