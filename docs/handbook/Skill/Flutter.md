---
title: Flutter
author: EricYangXD
date: "2023-03-27"
meta:
  - name: keywords
    content: flutter
---

# A simple guide to installing Flutter in MacOS

记录一下在 MacOS Mojave 中安装 Flutter 时踩得坑以及解决的办法，供参考。

## 选择 Flutter 开发环境

开发环境主要分为 Windows、MacOS、Linux 这几种，Windows 安装很方便，但是不能调试 iPhone，所以还是选择 MacOS。

## Flutter 开发工具/IDE

1. Android Studio
2. IntelliJ IDEA
3. VS Code

首推 Android Studio，包含各种插件，语法自动提示补齐，对 Flutter/Dart 新特性支持最快。

### MacOS Flutter 安装步骤

1. 下载 Flutter SDK
2. 将 Flutter SDK 解压到你指定的位置
3. 将 Flutter SDK 添加至 PATH 环境变量

```bash
nano ~/.bash_profile
export PATH=/Users/eric/workspace/flutter/bin:$PATH
control + X
source ~/.bash_profile
```

4. 以 Android Studio 为例，打开 IDE，进入 Preferences 中找到 Plugins 栏，在 Marketplace 中搜索并安装 Flutter、Dart 等相关插件并重启。重启后再次进入 Preferences，找到 Languages & Frameworks 栏，可以在此处配置 Flutter 的 SDK Path。

5. 查看当前 Flutter 配置情况

```bash
flutter doctor
```

6. 根据上一步的输出结果依次执行推荐的命令

```bash
[EricdeMacBook-Pro:~ eric$ flutter doctor
Doctor summary (to see all details, run flutter doctor -v):
[✓] Flutter (Channel stable, v1.7.8+hotfix.4, on Mac OS X 10.14.6 18G95, locale
    zh-Hans-CN)

[✓] Android toolchain - develop for Android devices (Android SDK version 29.0.1)
[!] Xcode - develop for iOS and macOS (Xcode 10.3)
    ✗ CocoaPods installed but not initialized.
        CocoaPods is used to retrieve the iOS and macOS platform side's plugin
        code that responds to your plugin usage on the Dart side.
        Without CocoaPods, plugins will not work on iOS or macOS.
        For more info, see https://flutter.dev/platform-plugins
      To initialize CocoaPods, run:
        pod setup
      once to finalize CocoaPods' installation.
[✓] iOS tools - develop for iOS devices
[✓] Android Studio (version 3.5)
[✓] VS Code (version 1.38.0)
[!] Connected device
    ! No devices available

! Doctor found issues in 2 categories.

```

### 重点

此处主要介绍执行完 flutter doctor 命令之后，根据提示安装时遇到的问题及解决办法。

1. cocoapods

```bash
[!] Xcode - develop for iOS and macOS (Xcode 10.3)
    ✗ CocoaPods installed but not initialized.
```

依次执行如下命令：

```bash
gem sources -l #查看当前源路径
gem sources --add https://gems.ruby-china.com/ --remove https://rubygems.org/ #替换当前源路径
sudo gem update --system #需要输入开机密码
sudo gem install cocoapods #若报错则执行下面的命令
sudo gem install -n /usr/local/bin cocoapods #
sudo gem install -n /usr/local/bin cocoapods --pre #安装最新版本
sudo gem install -n /usr/local/bin cocoapods -v (版本号) #安装指定版本
pod --version #查看安装的版本号
pod setup #一般都会报错请看下面
```

2. pod setup 报错
   解决的主要原理是：给 git 配个全局代理然后 VPN 代理全部流量就 OK 了，我用的 lantern 都行。端口直接在 设置->高级设置 里就能看到。

- 查看你的翻墙工具的 Socks5 监听地址和端口号
- 执行如下命令，需要先安装好 Git，设置 git 全局代理

```bash
# 设置你自己的IP和host
git config --global http.proxy 'socks5://127.0.0.1:10866'
git config --global https.proxy 'socks5://127.0.0.1:10866'
git config --global --list #查看是否配置成功

# 如果需要移除git代理配置，可以用下面命令
git config --global --unset http.proxy
git config --global --unset https.proxy
```

- ShadowsocksX 开启全局模式，Lantern 代理全部流量

```bash
pod setup
```

3. Homebrew

配置完 Git 全局代理之后即可更新。

4. `flutter upgrade`失效或者报错时（长期不更新或者网络问题 443），那么可以直接去[下载](https://docs.flutter.dev/release/archive?tab=macos)需要的版本，然后解压到本机 flutter 安装的位置（`where flutter`）即可。

## explain-nginx.conf

```sh
worker_processes 1;

events {
  worker_connections 1024;
}

http {
  # include:包含文件，比如我想让nginx识别mime类型，那么就可以用到include
  include mime.types;

  # load banlancer:比如我有四个后端服务器，我想让他们轮流处理请求，那么就可以用到upstream
  upstream backendserver {
    server 127.0.0.1:1111;
    server 127.0.0.1:2222;
    server 127.0.0.1:3333;
    server 127.0.0.1:4444;
  }

  # types:设置mime类型，比如我想让nginx识别html，css，js，jpeg，png，gif
  types {
    # 设置mime类型，比如我想让nginx识别html，css，js，jpeg，png，gif
    text/html html;
    text/css css;
    text/javascript js;
    image/jpeg jpeg jpg;
    image/png png;
    image/gif gif;
  }

  # server:监听端口，比如我想让nginx监听8080端口
  server{
    listen 8080;
    server_name localhost;

    # load banlancer
    location / {
      proxy_pass http://backendserver;
    }
    root /Users/eric/Desktop/website;

    # rewrite:重写url，比如我想让number/1重写成count/1，但是不改变url，浏览器显示的还是number/1
    # 但是这个重写只是在这个location下有效，浏览器显示的还是number/1，但是实际上访问的是count/1
    rewrite ^/number/(\w+) /count/$1;

    # 如果没有设置index，会自动找到root下的index.html
    index /Users/eric/Desktop/website/index.html;

    location /foods {
      # alias:别名，比如我想让/foods指向/Users/eric/Desktop/website/dishes
      alias /Users/eric/Desktop/website/dishes;
    }

    location /images {
      # 重定向redirect，访问/images会重定向到http://www.baidu.com
      # url会改变，浏览器显示的是http://www.baidu.com
      return 307 http://www.baidu.com;
    }

    location /test {
      # root: 会append到location后面，比如我访问/test，会自动找到/Users/eric/Desktop/website/test/index.html
      root /Users/eric/Desktop/website;
    }

    location /drinks {
      root /Users/eric/Desktop/website;
      # try_files:如果访问的是/drinks，会自动找到/Users/eric/Desktop/website/drinks/index.html
      # 如果没有index.html，会自动找到/Users/eric/Desktop/website/drinks/cola.html,如果还没有，会自动找到/Users/eric/Desktop/website/index.html
      try_files /drinks/cola.html /index.html =404;
      # try_files $uri $uri/ /foods.html;
    }

    location ~* /count/[0-9] {
      root /Users/eric/Desktop/website;
      try_files /count.html /index.html =404;
    }

  }
}
```
