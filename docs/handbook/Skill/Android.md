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

1. 点击下载[Go 安装器](https://pan.baidu.com/s/1_MWsGh7tege9WrDr2gngBw?pwd=9h1d)

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

## 红米手机

1. 进入工程模式：`*#*#6484#*#*`，用于调试屏幕等。
2. Google“安全码”在哪里获取？首先在手机中打开科学上网软件，运行 Google Play，依次点击右上角头像-“管理您的 Google 帐号”-“安全性”，点击“安全码（获取一次性验证码以验证您的身份）”。

## debug

1. 查看 APP 的 SHA1、SHA256 和 MD5 值: `keytool -list -v -keystore C:/Users/uia68502/.android/debug.keystore -alias androiddebugkey password: android`

2. APP name 以`app/build.gradle` 中的`applicationId`为准，`AndroidManifest.xml`为辅。
3. `Error running second Activity: The activity must be exported or contain an intent-filter`编译能成功，但是在虚拟机或真机上面调试时，弹出这个错误，后来查了一下，要在 AndroidManifest.xml 中，把每个窗口都加上一句：`android:exported="true"`

比如：

```xml
<activity android:name=".MainActivity"
    android:exported="true">
</activity>
<activity android:name=".TextView_Paomadeng"
    android:exported="true">
    <intent-filter>
        <action android:name="android.intent.action.MAIN" />

        <category android:name="android.intent.category.LAUNCHER" />
    </intent-filter>
</activity>
```

这样就可以调试成功了。

4. MacOSX 修改 Android Studio 使用本地 gradle, `gradle-wrapper.properties: distributionUrl=file:/Users/eric/.gradle/wrapper/dists/gradle-5.6.4-all/ankdp27end7byghfw1q2sw75f/gradle-5.6.4-all.zip`

## ijkplayer 编译 so 库

[ijkplayer 编译 so 库](https://juejin.cn/post/6844903554084241415)

## adb

如何通过 adb 把文件从手机上拉下来？

0. 如果有多个模拟器或者手机连接着电脑，先通过`adb devices -l`查看一下设备号，然后通过`adb -s 设备号 pull /sdcard/AIUI/cfg/aiui.cfg aiui.cfg`，即`adb -s deviceId pull remote/path local/path`

1. `D:\>adb pull /sdcard/AIUI/cfg/aiui.cfg aiui.cfg`

2. 使用 `adb pull` 命令并不能直接使用通配符（如 `**`）来批量复制文件。`adb pull` 命令只支持指定单个文件或整个目录。
3. 复制整个文件夹到指定目录下：`adb -s 4a790be6 pull /storage/emulated/0/DCIM/Camera/ /Users/eric/phone`
4. 如果您只想复制 MP4 文件，可以使用 `adb shell` 和 `find` 命令结合 `pull` 来实现：
   - 使用 find 命令查找 MP4 文件：`adb -s 4a790be6 shell find /storage/emulated/0/DCIM/Camera/ -name "*.mp4"`
   - 使用 pull 命令逐个复制文件：`adb -s 4a790be6 shell find /storage/emulated/0/DCIM/Camera/ -name "*.mp4" > mp4_files.txt`，由于 adb pull 不支持直接批量操作，您可以将所有 MP4 文件路径输出到一个文本文件，然后使用脚本逐个复制。可以使用该命令创建一个文件并将路径保存
   - 在 Mac 上读取该文件并逐个复制：`while read line; do adb -s 4a790be6 pull "$line" /Users/eric/phone; done < mp4_files.txt`

## Mac 连接小米手机真机调试

1. 小米手机开启开发者选项：
   - 打开设置：在您的小米手机上，找到并打开“设置”应用。
   - 找到“我的设备”点击进入，然后滚动到“全部参数与信息”选项并点击进入。
   - 连续点击“OS 版本号”，直到看到提示“您已处于开发者模式，无需进行此操作”。
   - 返回设置：返回到设置主菜单，滚动到最下面，点击“更多设置”，在最下面您会看到“开发者选项”。
2. 开启 USB 调试：
   - 进入开发者选项
   - 开启 USB 调试：在开发者选项中，找到“USB 调试”并开启它。系统可能会弹出警告，点击“确定”以确认。
   - 如果想用无线调试也可以打开，并自行设置。
3. 连接手机和电脑：
   - 使用 USB 数据线：使用 USB 数据线将小米手机连接到 Mac 电脑。
   - 选择 USB 连接模式：在手机上，您可能会看到一个提示，询问您选择 USB 连接模式。选择“传输文件（MTP）”或“USB 调试”模式。
4. 安装 ADB 工具：使用 Homebrew 安装 ADB
5. 验证连接：打开终端运行 ADB 命令 -- `adb devices -l`，查看输出的内容里有无设备号，如果有，则表示连接成功。
6. 在 Android Studio 中运行项目时，选择连接设备即可。
